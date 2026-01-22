import { configureKernel, configureMachine, configureRootfs, sleep, startFirecracker, startMicroVM } from "./firecracker/firecrackerStart.js";

async function main() {
   await configureMachine();
   await sleep(50);

   await configureKernel();
   await sleep(50);

   await configureRootfs();
   await sleep(50);

   await startMicroVM();


   console.log("MicroVM started successfully");
}

main().catch(err => {
   console.error("FAILED:", err);
   process.exit(1);
});