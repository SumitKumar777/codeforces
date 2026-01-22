import { spawn } from "child_process";
import { promises as fs } from "fs";
import * as http from "http";

const SOCKET_PATH = "/tmp/firecracker/firecracker.socket";

/* -------------------- utils -------------------- */

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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
            headers: { "Content-Type": "application/json" },
         },
         res => {
            if ((res.statusCode ?? 500) >= 400) {
               reject(new Error(`Firecracker API error ${res.statusCode}`));
            } else {
               resolve();
            }
         }
      );

      req.on("error", reject);
      req.write(JSON.stringify(body));
      req.end();
   });
}

/* -------------------- steps -------------------- */

export async function startFirecracker() {
   await fs.mkdir("/tmp/firecracker", { recursive: true });
   await fs.rm(SOCKET_PATH, { force: true });

   const fc = spawn("sudo", [
      "firecracker",
      "--api-sock",
      SOCKET_PATH,
   ], {
      stdio: ["ignore", "pipe", "pipe"],
   });

   fc.stdout.on("data", d => console.log("[fc]", d.toString()));
   fc.stderr.on("data", d => console.error("[fc err]", d.toString()));
   fc.on("exit", code => console.error("Firecracker exited:", code));

   await waitForSocket(SOCKET_PATH);
   return fc;
}

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
      boot_args: "console=ttyS0 reboot=k panic=1 pci=off",
   });
}

export async function configureRootfs() {
   await fcPut("/drives/rootfs", {
      drive_id: "rootfs",
      path_on_host: "/home/sumitkumar/hello-rootfs.ext4",
      is_root_device: true,
      is_read_only: false,
   });
}


export async function startMicroVM() {
   await fcPut("/actions", {
      action_type: "InstanceStart",
   });
}

/* -------------------- main -------------------- */

