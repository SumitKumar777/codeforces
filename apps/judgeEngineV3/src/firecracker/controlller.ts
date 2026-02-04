


import { startFirecrackerProcess } from "./firecrackerStart.js";
import { createTestCaseImage, type Submission } from "./ioOperation.js"
import { startMicroVm } from "./startmicrovm.js";
import { createUserCodeImage } from "./usercodeImage.js";



// i have to create make separate testcaseImage(means on the fly i have to create a image for that particular problem that particular testcase then delete that ) ,
// * compilor vm 
//  userSourcecodeImage(input compilor vm) , 
// userBinaryCode(output compilor vm )  , 
// * execution vm 
// input-> TestCaseImage
// output-> outputImage(will have testcase output for each input testcase )
// program-> userBinaryCode


const compilerRootfsImage = "compiler-cpp.squashfs";
const executionRootfsImage = "rootfs-cpp.squashfs";
const testCaseImagePath = "problem-testcase-images";
const verdictImagePath = "user-output-code-Images";
const userSourceCodeImagePathDir = "userSourceCodeImages";
const userBinaryCodePathDir = "userBinaryCodeImages";



// export const startMicroVm = async (
//    apiSocket: string,
//    rootfsImage: string,
//    inputImagePath: string,
//    outputImagePath: string,
//    type: MicroVmType = "compilation",
//    programImagePath: string = "",
// ) => {


export const controller = async (sub: Submission) => {

   try {
      // need to be implemented like check if we are getting the testcaseImage for that problem
      const testCaseImage = await createTestCaseImage(sub);


      // create a unique userSource code image  and also the binaryUserCode image which will we used to take output from the compilorvm and then will send that as input to the executionvm 
      const userSourceCodeImage = await createUserCodeImage(sub);

      if (userSourceCodeImage?.status === "error") {
         throw userSourceCodeImage.error;
      }

      // will return the apiSocketpath or Error;
      const firecrackerStartResponse = await startFirecrackerProcess();
      if (!firecrackerStartResponse.success) {
         throw firecrackerStartResponse.error
      }
      await startMicroVm(firecrackerStartResponse.apiSocket, compilerRootfsImage, `${userSourceCodeImagePathDir}/${sub.submission_id}.ext4`, `${userBinaryCodePathDir}/${sub.submission_id}.ext4`, "compilation");
      console.log('compiler vm started')

      const fireCrackExecVmProcess = await startFirecrackerProcess();
      if (!fireCrackExecVmProcess.success) {
         throw fireCrackExecVmProcess.error
      }

      await startMicroVm(fireCrackExecVmProcess.apiSocket, executionRootfsImage, `${testCaseImagePath}/${sub.problem_id}.ext4`, `${verdictImagePath}/${sub.submission_id}.ext4`, "execution", `${userBinaryCodePathDir}/${sub.submission_id}.ext4`);



      console.log("executed successfully");

   } catch (error) {
      console.log('error in the controller ', error);
   }
}


