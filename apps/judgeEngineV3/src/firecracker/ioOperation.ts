import fs, { promises as profs } from "fs";

import path from "path";
import { spawn } from "child_process";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectRoot: string = (() => {
	let dir = __dirname;

	while (dir !== path.dirname(dir)) {
		if (path.basename(dir) === "judgeEngineV3") {
			return dir;
		}
		dir = path.dirname(dir);
	}

	throw new Error("folder is not found");
})();

interface Submission {
	submission_id: string;
	problem_id: string;
	language: string;
	code: string;
	limits: { time_seconds: number; memory_mb: number };
	testcases: { input: string; expected_output: string }[];
}

type PathType = "file" | "dir";

const checkExists = async (path: string, type: PathType) => {
	try {
		const fileStat = await profs.stat(path);

		if (type === "file") {
			return fileStat.isFile();
		}
		if (type === "dir") {
			return fileStat.isDirectory();
		}
	} catch (error) {
		console.log("error in the checkExists", error);
		return false;
	}
};

const scriptPath: string = path.join(projectRoot, "scripts/testcase-setup.sh");

// this runScript function will start the script and create the testcaseImage and then we will delete
const runScript = async (problemId:string) => {

   // check if the image exists for that problem 

   

	return new Promise<void>((resolve, reject) => {
		// ! add runtime variable in this script right now node added just wanted to test if this is working


     

      const runScript = spawn( "sudo",
         ["--preserve-env=PROBLEM","bash",
         scriptPath],
         {
            stdio: "inherit",
            env: {
               ...process.env,  
               PROBLEM: `problem-${problemId}`
            }
         }
      );


		runScript.on("error", (err) => {
			console.log("error is ", err);
			reject(err);
		});

		runScript.on("exit", (code, signal: NodeJS.Signals) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`failed to run the script signal is ${signal}`));
			}
		});
	});
};

const checkProblemImageExist = async (problemId: string) => {
	try {
		if (!problemId) {
			console.log("problemId is required", problemId);
			return;
		}

		const problemImagePath = path.join(projectRoot, "problemImages");

		await profs.mkdir(problemImagePath,{recursive:true});

		if (await profs.stat(path.join(problemImagePath, `problem-${problemId}.ext4`))) {
			return true;
		}
	} catch (error) {
		return false;
	}
};

// create the function which create the folder and files of testcase for that submission and that question

const createTestCaseFiles = async (
	problem_id: string,
	testcase: { input: string; expected_output: string }[],
) => {
	try {
		const testCasesPath = path.join(projectRoot, "testcases");
		await profs.mkdir(testCasesPath, { recursive: true });
		const problemPath = path.join(testCasesPath, `problem-${problem_id}`);

		if (await checkProblemImageExist(problem_id)) {
			console.log("imageExists");
			return true
		}

		if (!(await checkExists(problemPath, "dir"))) {
			await profs.mkdir(problemPath);
		} else {
			console.log("already exists problem");
			return true
		}

		let count = 0;
		for (const tstCase of testcase) {
			await profs.writeFile(
				path.join(problemPath, `input-${count}.txt`),
				tstCase.input,
			);
			await profs.writeFile(
				path.join(problemPath, `expected-${count}.txt`),
				tstCase.expected_output,
			);
			count++;
		}
		console.log("files created successfully");

		return true
	} catch (error) {
		console.log("error in the creatingTestCaseFile", error);
      return false;
	}
};

export const createTestCaseImage = async (submission: Submission) => {
	try {
		if (!submission) {
			throw new Error("submission is not found", submission);
		}

		const testCaseFilesCreationResponse = await createTestCaseFiles(
			submission.problem_id,
			submission.testcases,
		);

      if(!testCaseFilesCreationResponse){
         throw new Error("testcaseFile  not created")
      }

		const result = await runScript(submission.problem_id);
		console.log("result of the script", result);
		return result;
	} catch (error) {
		console.log("error in the createTestCaseImage", error);
	}
};
