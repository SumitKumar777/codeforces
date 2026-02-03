import path from "path";
import { spawn } from "child_process";
import crypto from "crypto";

import fs from "fs";

const FIRECRACKER_BIN = path.resolve(process.env.HOME!, "firecracker");


type StartFirecrackerResult =
	| {
		success: true;
		apiSocket: string;
	}
	| {
		success: false;
		error: unknown;
	};


const runSpawn = (cmd: string, arg: string[]) => {
	return new Promise<void>((resolve, reject) => {
		const p = spawn(cmd, arg);

		p.once("error", reject);

		p.once("close", (code) => {
			if (code !== 0) {
				reject(`failed to  runSpawn ${code}`);
			} else {
				resolve();
			}
		});
	});
};

const runFirecracker = (cmd: string, args: string[], API_SOCKET: string, timeOut = 3000) => {
	return new Promise<void>((resolve, reject) => {
		const startTime = Date.now();

		const p = spawn(cmd, args);

		p.once("error", reject);

		p.once("close", (code) => {
			if (code === 0) {
				console.log("firecracker closed peacefully code => ", code);
			} else {
				console.log("firecracker Closed unsuccesfully =>", code);
			}
		});

		const timer = setInterval(() => {
			if (fs.existsSync(API_SOCKET)) {
				clearInterval(timer);
				resolve();
			} else if (Date.now() - startTime > timeOut) {
				clearInterval(timer);
				reject("failed to start firecracker");
			}
		}, 20);
	});
};

export const startFirecrackerProcess = async (): Promise<StartFirecrackerResult> => {
	const API_SOCKET_PATH = path.resolve(process.env.HOME!, "firecrackerSockets")
	const API_SOCKET = path.join(API_SOCKET_PATH, `${crypto.randomUUID()}.socket`);

	try {
		const cleanSocket = await runSpawn("sudo", ["rm", "-f", API_SOCKET]);

		console.log("cleanSocket", cleanSocket);

		const startFirecracker = await runFirecracker("sudo", [
			FIRECRACKER_BIN,
			"--api-sock",
			API_SOCKET,
			"--enable-pci",
		], API_SOCKET);

		await runSpawn("sudo", ["chmod", "666", API_SOCKET]);


		return { success: true, apiSocket: API_SOCKET };
	} catch (error) {
		console.log("error while starting firecracker", error);
		return { success: false, error }
	}
};
