import { startFirecrackerProcess } from "./firecrackerStart.js";
import { createTestCaseImage, type Submission } from "./ioOperation.js";
import { startMicroVm } from "./startmicrovm.js";
import { createUserCodeImage } from "./usercodeImage.js";

const compilerRootfsImage = "compiler-cpp.squashfs";
const executionRootfsImage = "rootfs-cpp.squashfs";
const testCaseImagePath = "problem-testcase-images";
const verdictImagePath = "user-output-code-Images";
const userSourceCodeImagePathDir = "userSourceCodeImages";
const userBinaryCodePathDir = "userBinaryCodeImages";

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
      );
      console.log("compiler vm started");

      const fireCrackExecVmProcess = await startFirecrackerProcess();
      if (!fireCrackExecVmProcess.success) {
         throw fireCrackExecVmProcess.error;
      }

      await startMicroVm(
         fireCrackExecVmProcess.apiSocket,
         executionRootfsImage,
         `${testCaseImagePath}/problem-${sub.problem_id}.ext4`,
         `${verdictImagePath}/${sub.submission_id}.ext4`,
         "execution",
         `${userBinaryCodePathDir}/${sub.submission_id}.ext4`,
      );

      console.log("executed successfully");
   } catch (error) {
      console.log("error in the controller ", error);
   }
};
