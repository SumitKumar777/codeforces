import path from "path";
import { createTestCaseImage, projectRoot } from "./firecracker/ioOperation.js";

import {promises as fs} from "fs";
import { createUserCodeImage } from "./firecracker/usercodeImage.js";


async function main() {
 try {
    const submissionData = JSON.parse(await fs.readFile(path.join(projectRoot, "submission/dummysubmission.json"), "utf-8"));

    for (const sub of submissionData) {
      //  await createTestCaseImage(sub);
       await createUserCodeImage(sub);
    }


 } catch (error) {
   console.log("error in main", error);
 }
}

main().catch(err=>console.log(err));