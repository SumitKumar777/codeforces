import path from "path";
import { runSpawn } from "./firecrackerStart.js";
import { checkExists, type Submission } from "./ioOperation.js";
import { promises as profs } from "fs";

import { judgeEngine } from "@repo/redis-client";


const HOME = process.env.HOME!;
const verdictImagePath = "user-output-code-Images";

type VerdictDataValue = { testcase: string, verdict: string }

type VerditData = {
   results: VerdictDataValue[];
}

export const evaluator = async (sub: Submission) => {
   const mountPath = path.join(HOME, "mount", `output-${sub.submission_id}`);

   const imagePath = path.resolve(
      HOME,
      verdictImagePath,
      `${sub.submission_id}.ext4`,
   );

   let mounted = false;

   try {
      await profs.mkdir(mountPath, { recursive: true });

      const imageExists = await checkExists(imagePath, "file");
      if (!imageExists) {
         throw new Error("evaluation image does not exist");
      }

      await runSpawn("sudo", ["mount", imagePath, mountPath]);
      mounted = true;

      const raw = await profs.readFile(
         path.join(mountPath, "result.json"),
         "utf-8",
      );



      type VerdictDataValue = { testcase: string, verdict: string }

      type VerditData = {
         results: VerdictDataValue[];
      }


      const { results }: VerditData = JSON.parse(raw);

      console.log(results);

      // ! push the data into the redis stream 

      const client = await judgeEngine.getJudgeWriteRedisClient();


      await client.xAdd("resultStream", "*", {
         sub_id: sub.submission_id,
         results:JSON.stringify(results)
      })


      // after this need to create a seprate script for the output image because of testcase image creation check logic 
      

   } catch (error) {
      console.error("error in evaluator:", error);
      throw error;
   } finally {
      if (mounted) {
         try {
            await runSpawn("sudo", ["umount", mountPath]);
         } catch (e) {
            console.error("failed to umount:", mountPath, e);
         }
      }

      try {
         await profs.rmdir(mountPath);
      } catch (e) {
         console.error("failed to remove mount dir:", mountPath, e);
      }
   }
};
