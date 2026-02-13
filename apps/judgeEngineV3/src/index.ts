import path from "path";
import { projectRoot } from "./firecracker/ioOperation.js";

import { promises as fs } from "fs";
import { controller } from "./firecracker/controlller.js";
import { evaluator } from "./firecracker/evaluator.js";
import { judgeEngine } from "@repo/redis-client";
import crypto from "crypto";

import createSubmissionObject from "./firecracker/get-testcases.js";

// type SubmissionRedisType = {
//    id: string;
//    data: {
//       submission_id: string;
//       problem_id: string;  }[]
// }
async function main() {
   try {
      const readClient = await judgeEngine.getJudgeReadRedisClient();
      const consumerName = `consumer-${process.env.NODE_APP_INSTANCE}`;

      console.log("consumer name", consumerName);

      while (true) {
         const response = await readClient.xReadGroup(
            "submissionReaderGroup",
            consumerName,
            {
               key: "submissionStream",
               id: ">",
            },
            {
               BLOCK: 0,
               COUNT: 10,
            },
         );



         const submissions = response?.[0]?.messages.map((msg) => {
            const submissionData = msg.message.submission;
            console.log("msg is ", msg);
            if (!submissionData) {
               console.log("no submission data in the message", msg);
               return null;
            }
            return { id: msg.id, data: JSON.parse(submissionData) };
         }) || [];

         if (response) {


            for (const sub of submissions) {
               try {
                  console.log("processing submission id is ", sub?.id, "submission data is ", sub?.data);
                  const formattedSubData = await createSubmissionObject(
                     sub?.data.submission_id,
                  );
                  console.log("formatted submission data", formattedSubData);

                  await controller(formattedSubData);
                  await evaluator(formattedSubData);



                  await readClient.xAck("submissionStream", "submissionReaderGroup", sub!.id);
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

main().catch((err) => console.log(err));
