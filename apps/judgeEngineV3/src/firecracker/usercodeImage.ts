import path from "path";
import { projectRoot, type Submission } from "./ioOperation.js";
import { spawn } from "child_process";
import { promises as fs } from "fs";

const packageUserCode = async () => {
	return new Promise<void>((resolve, reject) => {
		try {
			const userCodeScriptPath = path.join(
				projectRoot,
				"scripts/usercode-setup.sh",
			);
			const runScript = spawn( "sudo", ["bash", userCodeScriptPath], {
				stdio: "inherit",
			});

			runScript.on("error", (err) => {
				reject(err);
			});

			runScript.on("exit", (code, signal) => {
				if (code === 0) {
					console.log("usercodeImage script ran successfull");
					resolve();
				} else {
					reject(new Error(`error in usercodeImage runscript ${signal}`));
				}
			});
		} catch (error) {
			console.log("error in packageUserCode", error);
			reject(error);
		}
	});
};

export const createUserCodeImage = async (sub: Submission) => {
	try {
		if (!Object.keys(sub).length) {
			throw new Error("submission is empty");
		}

		await fs.mkdir(path.join(projectRoot, "userSourceCode"), {
			recursive: true,
		});
		await fs.writeFile(
			path.join(projectRoot, "userSourceCode", `code-${sub.submission_id}.cpp`),
			sub.code,
		);

		await packageUserCode();
	} catch (error) {
		console.log("error in createUserImage", error);
	}
};
