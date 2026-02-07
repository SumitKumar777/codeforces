import path from "path";
import { projectRoot } from "./firecracker/ioOperation.js";

import { promises as fs } from "fs";
import { controller } from "./firecracker/controlller.js";
import { evaluator } from "./firecracker/evaluator.js";
import { judgeEngine } from "@repo/redis-client";



async function main() {
   try {

      const readClient = await judgeEngine.getJudgeReadRedisClient();

      while (true) {

         const response = await readClient.xReadGroup(
            "submissionReaderGroup",
            "consumer1", {
            key: "submissionStream",
            id: ">"
         }, {
            BLOCK: 0,
            COUNT: 10
         }
         )


         if (response) {
            console.log("judge submission  Read respone ", response[0]?.messages[0]?.message);

         } else {
            console.log("no response", response);
         }


      }

      // for (const sub of submissionData) {
      //    await controller(sub);
      //    await evaluator(sub);
      // }

   } catch (error) {
      console.log("error in main", error);
   }
}

main().catch(err => console.log(err));