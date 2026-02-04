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
         "Content-Length": Buffer.byteLength(requestBody),
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

const configureVM = (
   socketPath: string,
   vcpu: number = 1,
   memory: number = 512,
) => {
   const requestBody = JSON.stringify({
      vcpu_count: vcpu,
      mem_size_mib: memory,
      smt: false
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
      kernel_image_path: path.resolve(rootDirectory!, "vmlinux-6.1.155"),
      boot_args: "console=ttyS0 reboot=acpi panic=1 init=/init",

   });

   return new Promise<void>((resolve, reject) => {
      const option = confReqOption("/boot-source", socketPath, requestBody);

      if (Object.keys(option).length === 0) {
         reject(new Error("failed to configure request option"));
      }

      const req = http.request(option, (res) => {
         let data = "";

         res.on("data", (d) => {
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



const confStartVm = (socketPath: string) => {

   const requestBody = JSON.stringify({
      action_type: "InstanceStart"
   })



   return new Promise<void>((resolve, reject) => {
      const option = confReqOption("/actions", socketPath, requestBody)

      if (Object.keys(option).length === 0) {
         reject(new Error("failed to configure Instance option"));
      }

      const req = http.request(option, (res) => {
         let data = "";

         res.on("data", (d) => {
            data += d;
         });

         res.on("end", () => {
            console.log("data of startvm =>  ", data)
            const status = res.statusCode ?? 0;

            if (status >= 200 && status < 300) {
               resolve();
            } else {
               reject(
                  new Error(
                     `failed to conf  instance data is  ${data} status ${status}`,
                  ),
               );
            }
         });
      });

      req.on("error", (err) => {
         reject(new Error(`Error in instance ${err}`));
      });

      req.write(requestBody);
      req.end();
   });



}

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
      console.log("api socket path in startMicrovm", apiSocket);
      await configureVM(apiSocket);
      await confBootSource(apiSocket);

      const inputReadOnly = type === "compilation" ? false : true

      // compilor rootfs
      await confRequest(
         rootfsImage,
         apiSocket,
         "rootfs",
         "Rootfs",
         true,
         true,
      );

      console.log(`input readonly ${inputReadOnly}  type is => ${type} `)
      // inputimage
      await confRequest(
         inputImagePath,
         apiSocket,
         "input",
         "Input",
         false,
         inputReadOnly

      );
      // output Image
      await confRequest(
         outputImagePath,
         apiSocket,
         "output",
         "Output",
         false,
         false,
      );

      if (type === "execution") {
         await confRequest(
            programImagePath,
            apiSocket,
            "program",
            "Program",
            false,
            true,
         );
      }
      await confStartVm(apiSocket)

   } catch (error) {
      console.log("Error while starting vm ", error);
      throw error;
   }
};
