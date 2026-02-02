import http from "http";
import path from "path";

const rootDirectory = process.env.HOME;

const confReqOption = (
   path: string,
   socketPath: string,
   requestBody: any,
   method = "PUT",
) => {
   return {
      socketPath,
      path,
      method,
      headers: {
         "Content-Type": "application/json",
         "Content-Lenght": Buffer.byteLength(requestBody),
      },
   };
};

const firecrackerHttpRequest = (
   imagePath: string,
   path: string,
   socketPath: string,
   requestBody: any,
   title: string,
) => {
   return new Promise<void>((resolve, reject) => {
      const option = confReqOption(path, socketPath, requestBody);

      if (Object.keys(option).length === 0) {
         reject(new Error(`"failed to configure ${title} option"`));
      }

      const req = http.request(option, (res) => {
         let data = "";
         res.on("data", (d) => {
            data += d;
         });

         res.on("end", () => {
            const statusCode = res.statusCode ?? 0;

            if (statusCode >= 200 && statusCode < 300) {
               resolve();
            } else {
               reject(
                  new Error(
                     ` firecracker failed to configure ${title} Status ${statusCode} and data is ${data}`,
                  ),
               );
            }
         });
      });

      req.on("error", (err) => {
         reject(new Error(`Error in ${title} ${err}`));
      });
      req.write(requestBody);

      req.end();
   });
};

const configureVM = async (
   socketPath: string,
   vcpu: number = 1,
   memory: number = 512,
) => {
   const requestBody = JSON.stringify({
      v_cpu_count: vcpu,
      mem_siz_mib: memory,
      smt: false,
   });

   return new Promise<void>((resolve, reject) => {
      const option = confReqOption("/machine-config", socketPath, requestBody);

      if (Object.keys(option).length === 0) {
         reject(new Error("failed to configure request option"));
      }

      const req = http.request(option, (res) => {
         let data = "";
         res.on("data", (d) => {
            data += d;
         });

         res.on("end", () => {
            const statusCode = res.statusCode ?? 0;

            if (statusCode >= 200 && statusCode < 300) {
               resolve();
            } else {
               reject(
                  new Error(
                     ` firecracker failed to configure machine Status ${statusCode} and data is ${data}`,
                  ),
               );
            }
         });
      });

      req.on("error", (err) => {
         reject(err);
      });
      req.write(requestBody);

      req.end();
   });
};

const confBootSource = (socketPath: string) => {
   const requestBody = JSON.stringify({
      kernal_image_path: path.resolve(rootDirectory!, "vmlinux-6.1.155"),
      boot_args: "console=tty0 reboot=acpi, panic=1 init=/init",
   });

   return new Promise<void>((resolve, reject) => {
      const option = confReqOption("/boot-source", socketPath, requestBody);

      if (Object.keys(option).length === 0) {
         reject(new Error("failed to configure request option"));
      }

      const req = http.request(option, (res) => {
         let data = "";

         req.on("data", (d) => {
            data += d;
         });

         res.on("end", () => {
            const status = res.statusCode ?? 0;

            if (status >= 200 && status < 300) {
               resolve();
            } else {
               reject(
                  new Error(
                     `failed to conf boot-source data is  ${data} status ${status}`,
                  ),
               );
            }
         });
      });

      req.on("error", (err) => {
         reject(new Error(`Error in conf-bootSource ${err}`));
      });

      req.write(requestBody);
      req.end();
   });
};

const confRequest = async (
   imagePath: string,
   socketPath: string,
   drive_id: string,
   title: string,
   root_Device: boolean = false,
   read_only: boolean = true,
) => {
   const requestBody = JSON.stringify({
      drive_id,
      path_on_host: path.resolve(rootDirectory!, imagePath),
      is_root_device: root_Device,
      is_read_only: read_only,
   });

   await firecrackerHttpRequest(
      imagePath,
      `/drives/${drive_id}`,
      socketPath,
      requestBody,
      title,
   );
};

export type MicroVmType = "compilation" | "execution";

export const startMicroVm = async (
   apiSocket: string,
   rootfsImage: string,
   inputImagePath: string,
   outputImagePath: string,
   type: MicroVmType = "compilation",
   programImagePath: string = "",
) => {
   try {
      await configureVM(apiSocket);
      await confBootSource(apiSocket);

      const rootfsReq = await confRequest(
         rootfsImage,
         apiSocket,
         "rootfs",
         "Rootfs",
         true,
      );
      const inputReq = await confRequest(
         inputImagePath,
         apiSocket,
         "input",
         "Input",
      );
      const outputReq = await confRequest(
         outputImagePath,
         apiSocket,
         "output",
         "Output",
      );

      if (type === "execution") {
         const binaryProgramReq = await confRequest(
            programImagePath,
            apiSocket,
            "program",
            "Program",
         );
      }

   } catch (error) {
      console.log("Error while starting vm ", error);
      throw error;
   }
};
