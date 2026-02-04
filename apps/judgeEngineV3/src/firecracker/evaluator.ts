import path from "path";
import { runSpawn } from "./firecrackerStart.js";
import { checkExists, type Submission } from "./ioOperation.js";
import { promises as profs } from "fs";

const HOME = process.env.HOME!;
const verdictImagePath = "user-output-code-Images";

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

      const verdictData = JSON.parse(raw);

      console.log(verdictData);

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
