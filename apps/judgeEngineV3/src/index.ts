import path from "path";
import { createTestCaseImage, projectRoot } from "./firecracker/ioOperation.js";

import { promises as fs } from "fs";
import { createUserCodeImage } from "./firecracker/usercodeImage.js";
import { startFirecrackerProcess } from "./firecracker/firecrackerStart.js";
import { controller } from "./firecracker/controlller.js";



async function main() {
   try {
      const submissionData = JSON.parse(await fs.readFile(path.join(projectRoot, "submission/dummysubmission.json"), "utf-8"));

      for (const sub of submissionData) {
         await controller(sub);
      }

   } catch (error) {
      console.log("error in main", error);
   }
}

main().catch(err => console.log(err));