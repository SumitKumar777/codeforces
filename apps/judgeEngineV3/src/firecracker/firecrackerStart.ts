import { spawn } from "child_process";
import { promises as fs } from "fs";
import * as http from "http";

const SOCKET_PATH = "/tmp/firecracker/firecracker.socket";

/* ---------------- utils ---------------- */



async function waitForApiReady(retries = 50) {
   for (let i = 0; i < retries; i++) {
      try {
         await new Promise<void>((resolve, reject) => {
            const req = http.request(
               {
                  method: "GET",
                  socketPath: SOCKET_PATH,
                  path: "/version",
                  agent: false,
                  headers: { "Connection": "close" },
               },
               res => {
                  res.resume(); // drain
                  res.on("end", () => {
                     if (res.statusCode === 200) resolve();
                     else reject();
                  });
               }
            );
            req.on("error", reject);
            req.end();
         });
         return;
      } catch {
         await sleep(50);
      }
   }
   throw new Error("Firecracker API not ready");
}


export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function waitForSocket(path: string, retries = 50) {
   for (let i = 0; i < retries; i++) {
      try {
         await fs.stat(path);
         return;
      } catch {
         await sleep(100);
      }
   }
   throw new Error("Firecracker socket not created");
}

function fcPut(path: string, body: object): Promise<void> {
   return new Promise((resolve, reject) => {
      const req = http.request(
         {
            method: "PUT",
            socketPath: SOCKET_PATH,
            path,
            agent: false,               
            headers: {
               "Content-Type": "application/json",
               "Connection": "close",      
            },
         },
         res => {
            let data = "";

            res.on("data", chunk => {
               data += chunk;
            });

            res.on("end", () => {
               if ((res.statusCode ?? 500) >= 400) {
                  reject(
                     new Error(
                        `Firecracker API error ${res.statusCode}: ${data}`
                     )
                  );
               } else {
                  resolve();
               }
            });
         }
      );

      req.on("error", reject);
      req.write(JSON.stringify(body));
      req.end();
   });
}


/* ---------------- lifecycle ---------------- */
export async function startFirecracker() {
   await fs.mkdir("/tmp/firecracker", { recursive: true });
   await fs.rm(SOCKET_PATH, { force: true });

   const fc = spawn("firecracker", ["--api-sock", SOCKET_PATH], {
      stdio: ["pipe", "pipe", "pipe"],
   });

   let exited = false;

   fc.on("exit", code => {
      exited = true;
      console.error("Firecracker exited with code", code);
   });

   fc.stderr.on("data", d => {
      console.error("[fc err]", d.toString());
   });

   // 1️⃣ Wait for socket creation
   for (let i = 0; i < 50; i++) {
      if (exited) {
         throw new Error("Firecracker exited before creating socket");
      }
      try {
         await fs.stat(SOCKET_PATH);
         break; 
      } catch {
         await sleep(100);
      }
   }

   // 2️⃣ Wait for API readiness
   await waitForApiReady();

   return fc;
}


/* ---------------- REQUIRED STEPS ---------------- */

export async function configureMachine() {
   await fcPut("/machine-config", {
      vcpu_count: 1,
      mem_size_mib: 512,
      smt: false
   });
}

export async function configureKernel() {
   await fcPut("/boot-source", {
      kernel_image_path: "/home/sumitkumar/hello-vmlinux.bin",
      boot_args: "console=ttyS0 reboot=k panic=1 pci=off"
   });
}

export async function configureRootfs() {
   await fcPut("/drives/rootfs", {
      drive_id: "rootfs",
      path_on_host: "/home/sumitkumar/hello-rootfs.ext4",
      is_root_device: true,
      is_read_only: false
   });
}

export async function startMicroVM() {
   await fcPut("/actions", {
      action_type: "InstanceStart"
   });
}
