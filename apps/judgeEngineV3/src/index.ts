import path from "path";
import { createTestCaseImage, projectRoot } from "./firecracker/ioOperation.js";

import {promises as fs} from "fs";


async function main() {
  const submissionData = JSON.parse(await fs.readFile(path.join(projectRoot, "submission/dummysubmission.json"), "utf-8"));

  for(const sub of submissionData){
     createTestCaseImage(sub).catch(err => console.log(err));
  }
}

main().catch(err=>console.log(err));