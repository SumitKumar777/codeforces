import path from "path";
import { checkExists, projectRoot, type Submission } from "./ioOperation.js";
import { spawn } from "child_process";
import { promises as profs, stat, Stats } from "fs";

const packageUserCode = async (submissionId: string) => {
	return new Promise((resolve, reject) => {
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
					resolve("success");
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


		const userSourceCodePath = path.join(projectRoot, "userSourceCode", `${sub.submission_id}`);


		const userSourceCodeImagePath = path.resolve(process.env.HOME!, "userSourceCodeImages", `${sub.submission_id}.ext4`)

		if (await checkExists(userSourceCodeImagePath, "file")) {
			// console.log('code image exists');
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

		const pkgUserImageResponse = await packageUserCode(sub.submission_id);

		if (pkgUserImageResponse === "success") {
			return { status: "success", imageName: `${sub.submission_id}.ext4` };
		} else {
			console.log(pkgUserImageResponse)
			throw new Error("image not create")
		}

	} catch (error) {
		console.log("error in createUserImage", error);
		return { status: "error", error }
	}
};
