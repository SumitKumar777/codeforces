


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
const executionRootfsImage = "rootfs-cpp.ext4";
const inputImagePath = "input.ext4";
const outputImagePath = "output.ext4";
const userSourceCodeImagePath = "usercode.ext4";
const userBinaryCodePath = "binarycode.ext4";






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
      // const testCaseImage = await createTestCaseImage(sub);
      // create a unique userSource code image  and also the binaryUserCode image which will we used to take output from the compilorvm and then will send that as input to the executionvm 
      //const userSourceCodeImage = await createUserCodeImage(sub);

      // will return the apiSocketpath or Error;
      const firecrackerStartResponse = await startFirecrackerProcess();
      if (!firecrackerStartResponse.success) {
         throw firecrackerStartResponse.error
      }
      const compilorVm = await startMicroVm(firecrackerStartResponse.apiSocket, compilerRootfsImage, userSourceCodeImagePath, userBinaryCodePath, "compilation");

      const fireCrackExecVmProcess = await startFirecrackerProcess();
      if (!fireCrackExecVmProcess.success) {
         throw fireCrackExecVmProcess.error
      }

      const executorVm = await startMicroVm(fireCrackExecVmProcess.apiSocket, executionRootfsImage, inputImagePath, userBinaryCodePath, "execution", outputImagePath);

   } catch (error) {
      console.log('error in the controller ', error);
   }
}
