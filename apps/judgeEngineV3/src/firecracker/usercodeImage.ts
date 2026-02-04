import path from "path";
import { checkExists, projectRoot, type Submission } from "./ioOperation.js";
import { spawn } from "child_process";
import { promises as profs, stat, Stats } from "fs";

const packageUserCode = async (submissionId: string) => {
	return new Promise<void>((resolve, reject) => {
		try {
			const userCodeScriptPath = path.join(
				projectRoot,
				"scripts/usercode-setup.sh",
			);
			const runScript = spawn("bash", [userCodeScriptPath], {
				stdio: "inherit",
				env: {
					...process.env,
					SUB_ID: submissionId
				}
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

		const userSourceCodePath = path.join(process.env.HOME!, "userSourceCodeImages", `${sub.submission_id}.ext4`)


		if (await checkExists(userSourceCodePath, "file")) {
			console.log('code image exists');
			return
		}


		await profs.mkdir(userSourceCodePath, {
			recursive: true,
		});

		let fileExtension = "";

		if (sub.language === "CPP") {
			fileExtension = "cpp";
		} else if (sub.language === "JS") {
			fileExtension = "js"
		} else {
			fileExtension = "py"
		}

		const filePath = path.join(userSourceCodePath, `main.${fileExtension}`);

		await profs.writeFile(filePath, sub.code);

		await packageUserCode(sub.submission_id);

	} catch (error) {
		console.log("error in createUserImage", error);
	}
};
