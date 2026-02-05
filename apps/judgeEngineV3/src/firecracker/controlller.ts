import path from "path";
import { runSpawn, startFirecrackerProcess } from "./firecrackerStart.js";
import { createTestCaseImage, projectRoot, type Submission } from "./ioOperation.js";
import { startMicroVm } from "./startmicrovm.js";
import { createUserCodeImage } from "./usercodeImage.js";
import { spawn } from "child_process";

const compilerRootfsImage = "compiler-rootfs.squashfs";
const executionRootfsImage = "execution-cpp.squashfs"
const testCaseImagePath = "problem-testcase-images";
const verdictImagePath = "user-output-code-Images";
const userSourceCodeImagePathDir = "userSourceCodeImages";
const userBinaryCodePathDir = "userBinaryCodeImages";





const convertToSquashfs = async (submissionId: string) => {
   return new Promise((resolve, reject) => {
      try {
         const convertToSquashfsScript = path.join(projectRoot, "scripts", "convert-ext4-to-squashfs.sh");

         const runScript = spawn("bash", [convertToSquashfsScript], {
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
               console.log("convert to squashfs script ran successfull");
               resolve("success");
            } else {
               reject(new Error(`error in convert to squashfs runscript ${signal}`));
            }
         });
      } catch (error) {
         console.log("error in convert to squashfs", error);
         reject(error);
      }
   });
};




export const controller = async (sub: Submission) => {
   try {
      // need to be implemented like check if we are getting the testcaseImage for that problem



      const testCaseImage = await createTestCaseImage(sub);

      const userSourceCodeImage = await createUserCodeImage(sub);

      if (userSourceCodeImage?.status === "error") {
         throw userSourceCodeImage.error;
      }

      // will return the apiSocketpath or Error;

      const firecrackerStartResponse = await startFirecrackerProcess();
      if (!firecrackerStartResponse.success) {
         throw firecrackerStartResponse.error;
      }

      await startMicroVm(
         firecrackerStartResponse.apiSocket,
         compilerRootfsImage,
         `${userSourceCodeImagePathDir}/${sub.submission_id}.ext4`,
         `${userBinaryCodePathDir}/${sub.submission_id}.ext4`,
         "compilation",
         firecrackerStartResponse.firecrackerProcess,
      );
      console.log("compiler vm started");

      const fireCrackExecVmProcess = await startFirecrackerProcess();
      if (!fireCrackExecVmProcess.success) {
         throw fireCrackExecVmProcess.error;
      }


      await convertToSquashfs(sub.submission_id);

      await startMicroVm(
         fireCrackExecVmProcess.apiSocket,
         executionRootfsImage,
         `${testCaseImagePath}/problem-${sub.problem_id}.squashfs`,
         `${verdictImagePath}/${sub.submission_id}.ext4`,
         "execution",
         firecrackerStartResponse.firecrackerProcess,
         `${userBinaryCodePathDir}/${sub.submission_id}.squashfs`,
      );

      console.log("executed successfully");
   } catch (error) {
      console.log("error in the controller ", error);
   }
};
