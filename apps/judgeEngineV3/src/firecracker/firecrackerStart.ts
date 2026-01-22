

// import {spawn } from "child_process"



// export const  firecrackerStart = async () => {
//    try {
//       const socketPath = "/tmp/firecracker/firecracker.socket";
//       const fileDeletionCheck = spawn("rm", ["-f",socketPath ]);

//       console.log("fileDeletionChecklog", fileDeletionCheck);

//       fileDeletionCheck.on("exit", (status) => {
//          if (status != 0) {
//             console.log("failed to remove the socket file");
//             throw new Error("file not deleted")
//          }
//       })
//       console.log("file cleared");

//       const firecrackerProcess= spawn("firecracker",["--api-sock",socketPath]);

//       await new Promise(resolve => setTimeout(resolve, 2000));

//       firecrackerProcess.on("exit",(code)=>{
//          if(code!=0){
//             console.log("firecracker didn't started");
//          }
      
//       })

//       console.log("firecracker started");

      
//    } catch (error) {
//       console.log("error while starting the firecracker",error);
//    }
// }




// export const configureFirecracker= async ()=>{

//    try {
//       const attachKernalImage = spawn("curl", [
//          "--unix-socket",
//          "/tmp/firecracker/firecracker.socket",
//          "-i",
//          "-X",
//          "PUT",
//          "http://localhost/boot-source",
//          "-H",
//          "Content-Type: application/json",
//          "-d",
//          JSON.stringify({
//             kernel_image_path: "./hello-vmlinux.bin",
//             boot_args: "console=ttyS0 reboot=k panic=1 pci=off"
//          })
//       ], {
//          stdio: "inherit"
//       });

//       await new Promise(resolve => setTimeout(resolve, 2000));

//       attachKernalImage.on("close", (code) => {
//          console.log(`curl exited with code ${code}`);
//          throw new Error("error in attaching kernal image ")
//       });

//       const attachDiskFiles =  spawn("curl", [
//          "--unix-socket",
//          "/tmp/firecracker/firecracker.socket",
//          "-i",
//          "-X",
//          "PUT",
//          "http://localhost/drives/rootfs",
//          "-H",
//          "Content-Type: application/json",
//          "-d",
//          JSON.stringify({
//             drive_id: "rootfs",
//             path_on_host: "./hello-rootfs.ext4",
//             is_root_device: true,
//             is_read_only: false
//          })
//       ], {
//          stdio: "inherit"
//       });
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       attachDiskFiles.on("close", (code) => {
//          console.log(`rootfs config exited with code ${code}`);
//       });

//    } catch (error) {
//       console.log("Error in configureFirecracker", error);

//    }
// }



// export const startMicroVM= async ()=>{
//    try {
//       const startVm = spawn("curl", [
//          "--unix-socket",
//          "/tmp/firecracker.socket",
//          "-i",
//          "-X",
//          "PUT",
//          "http://localhost/actions",
//          "-H",
//          "Content-Type: application/json",
//          "-d",
//          JSON.stringify({
//             action_type: "InstanceStart"
//          })
//       ], {
//          stdio: "inherit"
//       });

//       startVm.on("close", (code) => {
//          console.log(`VM start exited with code ${code}`);
//          throw new Error("vm not start");
//       });
//    } catch (error) {
//       console.log("error in starting the vm ",error)
//    }
// }




import { spawn } from "child_process";
import { promises as fs } from "fs";
import { once } from "events";
import * as http from "http";

const SOCKET_PATH = "/tmp/firecracker.socket";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));



export async function startFirecracker() {
   // cleanup old socket
   await fs.rm(SOCKET_PATH, { force: true });

   const fc = spawn("firecracker", ["--api-sock", SOCKET_PATH], {
      stdio: ["ignore", "pipe", "pipe"],
   });

   fc.stdout.on("data", d => {
      console.log("[firecracker]", d.toString());
   });

   fc.stderr.on("data", d => {
      console.error("[firecracker:error]", d.toString());
   });

   fc.on("exit", code => {
      console.error(`Firecracker exited with code ${code}`);
   });

   // wait until socket appears
   for (let i = 0; i < 50; i++) {
      try {
         await fs.stat(SOCKET_PATH);
         return fc;
      } catch {
         await sleep(100);
      }
   }

   throw new Error("Firecracker API socket not created");
}




function firecrackerRequest(
   path: string,
   body: object
): Promise<void> {
   return new Promise((resolve, reject) => {
      const req = http.request(
         {
            method: "PUT",
            socketPath: SOCKET_PATH,
            path,
            headers: {
               "Content-Type": "application/json",
            },
         },
         res => {
            if (res.statusCode && res.statusCode >= 400) {
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




export async function configureKernel() {
   await firecrackerRequest("/boot-source", {
      kernel_image_path: "/path/to/vmlinux",
      boot_args: "console=ttyS0 reboot=k panic=1 pci=off",
   });
}


export async function configureRootfs() {
   await firecrackerRequest("/drives/rootfs", {
      drive_id: "rootfs",
      path_on_host: "/path/to/rootfs.ext4",
      is_root_device: true,
      is_read_only: false,
   });
}




export async function configureNetwork() {
   await firecrackerRequest("/network-interfaces/eth0", {
      iface_id: "eth0",
      host_dev_name: "tap0",
      guest_mac: "AA:FC:00:00:00:01",
   });
}



export async function startMicroVM() {
   await firecrackerRequest("/actions", {
      action_type: "InstanceStart",
   });
}
