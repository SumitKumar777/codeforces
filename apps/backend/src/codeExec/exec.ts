import {spawn} from "child_process";



type  CodeResult= {
   exitCode: number | null;
   stdout: string;
   stderr: string;
}


export const runUserCode = (filePath:string, input:string):Promise<CodeResult | Error> => {
   return new Promise((resolve, reject) => {
      const child = spawn(
         "node",
         [filePath],
         {
            stdio: ["pipe", "pipe", "pipe"],
            env: {
               ...process.env,
               FORCE_COLOR: "0",
               NODE_DISABLE_COLORS: "1"
            }
         }
      );

      let stdout = "";
      let stderr = "";

      child.stdin.write(input);
      child.stdin.end();

      child.stdout.on("data", (data) => {
         stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
         stderr += data.toString();
      });

      child.on("error", (error) => {
         reject(error);
      });

      child.on("close", (exitCode) => {
         resolve({ exitCode, stdout, stderr });
      });
   });
};
