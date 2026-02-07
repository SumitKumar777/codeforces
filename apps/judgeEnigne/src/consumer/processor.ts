import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { prisma, SubmissionState, SubmissionVerdict } from "@repo/db";
import Docker from "dockerode";

import { judgeEngine } from "@repo/redis-client";

interface CodeExecuteDetails {
	problemId: number;
	userCode: string;
	language: string;
	testCases: {
		order: number;
		problemId: number;
		id: string;
		input: string;
		output: string;
	}[];
}

type TestResult = {
	testCaseId: string;
	order: number;
	statusCode: number;
	stdout: string;
	stderr: string;
	passed: boolean;
};

type TestCaseType = {
	code: string;
	testCaseId: string;
	order: number;
	input: string;
	output: string;
};

const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const IMAGE = "sumit487/judge-cpp-base-image:1.0";
const MEMORY_BYTES = 256 * 1024 * 1024;
const NANO_CPUS = 1e9;
const TIMEOUT_MS = 10_000;

// pull image
const pulledImages = new Set<string>();

async function ensureImage(image: string) {
	if (pulledImages.has(image)) return;

	try {
		await docker.getImage(image).inspect();
	} catch {
		await new Promise<void>((resolve, reject) => {
			docker.pull(image, (err: Error, stream: NodeJS.ReadableStream) => {
				if (err) return reject(err);
				docker.modem.followProgress(stream, (err2) =>
					err2 ? reject(err2) : resolve(),
				);
			});
		});
	}

	pulledImages.add(image);
}

async function writeSandbox(code: string, input: string) {
	const dir = await fs.mkdtemp(path.join(os.tmpdir(), "judge-"));

	await fs.writeFile(path.join(dir, "main.cpp"), code, "utf8");
	await fs.writeFile(path.join(dir, "input.txt"), input, "utf8");

	return { dir };
}

// runOnetestCase

async function runOneTest(params: {
	code: string;
	testCaseId: string;
	order: number;
	input: string;
	expected: string;
}): Promise<TestResult> {
	const { code, testCaseId, order, input, expected } = params;

	await ensureImage(IMAGE);

	const { dir } = await writeSandbox(code, input);
	const containerMount = "/sandbox";

	const container = await docker.createContainer({
		Image: IMAGE,
		WorkingDir: containerMount,
		Cmd: [
			"bash",
			"-lc",
			[
				"set -e",
				`g++ -std=c++17 -O2 ${containerMount}/main.cpp -o ${containerMount}/a.out`,
				`${containerMount}/a.out < ${containerMount}/input.txt`,
			].join(" && "),
		],
		Tty: false,
		HostConfig: {
			Binds: [`${dir}:${containerMount}:rw`],
			NetworkMode: "none",
			Memory: MEMORY_BYTES,
			NanoCpus: NANO_CPUS,
			PidsLimit: 256,
			CapDrop: ["ALL"],
			AutoRemove: false,
		},
	});

	let stdout = "";
	let stderr = "";
	let timeout: NodeJS.Timeout | null = null;

	try {
		const stream = await container.attach({
			stream: true,
			stdout: true,
			stderr: true,
		});

		stream.on("data", (chunk: Buffer) => {
			const type = chunk[0];
			const payload = chunk.subarray(8).toString("utf8");
			if (type === 1) stdout += payload;
			else if (type === 2) stderr += payload;
		});

		const runPromise = container.start().then(() => container.wait());

		const waitResult = await Promise.race([
			runPromise,
			new Promise<never>((_, reject) => {
				timeout = setTimeout(() => reject(new Error("TIMEOUT")), TIMEOUT_MS);
			}),
		]);

		const statusCode = waitResult.StatusCode ?? -1;

		return {
			testCaseId,
			order,
			statusCode,
			stdout: stdout.trimEnd(),
			stderr,
			passed: statusCode === 0 && stdout.trimEnd() === expected.trimEnd(),
		};
	} finally {
		if (timeout) clearTimeout(timeout);
		try {
			await container.remove({ force: true });
		} catch { }
		try {
			await fs.rm(dir, { recursive: true, force: true });
		} catch { }
	}
}

// write to the sandbox files

// execute code

const executeUserCode = async (
	codeExecDetails: CodeExecuteDetails,
): Promise<TestResult[]> => {
	const { userCode, testCases } = codeExecDetails;
	const testResults: TestResult[] = [];

	for (const tc of testCases) {
		const res = await runOneTest({
			code: userCode,
			testCaseId: tc.id,
			order: tc.order,
			input: tc.input,
			expected: tc.output,
		});

		if (!res.passed) {
			testResults.push(res);
			break;
		}

		testResults.push(res);
	}

	return testResults;
};

export async function problemProcessor(submissionId: string): Promise<void> {
	try {
		const submissionDetails = await prisma.$transaction(async (tx) => {
			const submissionDetails = await tx.submissions.findUnique({
				where: {
					id: submissionId,
				},
				select: {
					problemId: true,
					code: true,
					language: true,
				},
			});

			if (!submissionDetails) {
				throw new Error("submissionDetails not found ProblemProcessor");
			}

			const problemDetails = await tx.problems.findUnique({
				where: {
					id: submissionDetails.problemId,
				},
				select: {
					id: true,
					visibleTestCase: true,
					hiddenTestCase: true,
				},
			});
			return {
				problemId: problemDetails?.id as number,
				userCode: submissionDetails.code,
				language: submissionDetails.language,
				testCases: [
					...(problemDetails?.hiddenTestCase ?? []),
					...(problemDetails?.visibleTestCase ?? []),
				].map((tc, index) => ({
					...tc,
					order: index + 1,
				})),
			};
		});

		if (!submissionDetails) {
			throw new Error("submission details are missing");
		}

		const result = await executeUserCode(submissionDetails);

		const resultState = result[result.length - 1]?.passed;

		console.log("result of the code execution is ", result);

		// push this into db and also push the event in the redis queue for the api backend to know the result of the submission

		const submissionResult = await prisma.submissions.update({
			where: {
				id: submissionId,
			},
			data: {
				state: resultState ? SubmissionState.SUCCESS : SubmissionState.FAILED,
				verdict: resultState ? SubmissionVerdict.AC : SubmissionVerdict.WA,
			},
		});

		const redisWriteClient = await judgeEngine.getJudgeWriteRedisClient();

		// ! the error message is not inferred by the prisma so i am not sending the submission error message but need to send it to the frontend so that the client gets to know that

		await redisWriteClient.xAdd("resultStream", "*", {
			result: JSON.stringify({
				submissionId: submissionResult.id,
				state: submissionResult.state,
				verdict: submissionResult.verdict,
			}),
		});

		console.log("submission send to redis ");
		return;

	} catch (error) {
		console.log('Error in the processor ', error);
		return
	}
}
