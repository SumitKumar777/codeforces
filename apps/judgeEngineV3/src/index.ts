import { configureKernel, configureMachine, configureRootfs, startFirecracker, startMicroVM } from "./firecracker/firecrackerStart.js";

async function main() {
   await startFirecracker();
   await configureMachine();
   await configureKernel();
   await configureRootfs();
   await startMicroVM();

   console.log("MicroVM started successfully");
}

main().catch(err => {
   console.error("FAILED:", err);
   process.exit(1);
});