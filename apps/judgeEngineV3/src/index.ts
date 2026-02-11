import path from "path";
import { projectRoot } from "./firecracker/ioOperation.js";

import { promises as fs } from "fs";
import { controller } from "./firecracker/controlller.js";
import { evaluator } from "./firecracker/evaluator.js";
import { judgeEngine } from "@repo/redis-client";
import crypto from "crypto";

import createSubmissionObject from "./firecracker/get-testcases.js";



async function main() {
   try {

      const readClient = await judgeEngine.getJudgeReadRedisClient();
      const consumerName = `consumer-${process.pid}`;

      console.log("consumer name", consumerName);

      while (true) {

         const response = await readClient.xReadGroup(
            "submissionReaderGroup",
            consumerName, {
            key: "submissionStream",
            id: ">"
         }, {
            BLOCK: 0,
            COUNT: 10
         }
         )

         const submissions = response?.[0]?.messages.map((msg) => {
            const submissionData = msg.message.submission;
            if (!submissionData) {
               console.log("no submission data in the message", msg);
               return null;
            }
            return JSON.parse(submissionData);
         }) || [];


         if (response) {

            console.log("received data from stream", submissions);

            for (const sub of submissions) {
               try {
                  const formattedSubData = await createSubmissionObject(sub.submission_id);
                  console.log("formatted submission data", formattedSubData);
                  // await controller(formattedSubData);
                  // await evaluator(formattedSubData);


               } catch (error) {
                  console.log("error in processing submission", sub, error);
               }
            }

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