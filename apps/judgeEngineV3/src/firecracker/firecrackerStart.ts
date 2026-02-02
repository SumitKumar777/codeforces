import path from "path";
import {spawn} from "child_process";

const API_SOCKET = "~/firecracker.socket"




export const startFirecrackerProcess = async ()=>{

   return new Promise<void>((resolve, reject)=>{

      try {
         const cleanSocket = spawn("sudo", ["rm", "-f", API_SOCKET])

         cleanSocket.on("error",(err)=>{
            reject(err);
         })

         const startFirecracker= spawn("sudo",["~/firecracker", "--api-sock",API_SOCKET,"--enable-pci"]);
         startFirecracker.on("error",(err)=>{
            reject(err);
         })

         startFirecracker.on("exit",(code,signal)=>{
            if(code===0){
               resolve()
            }else{
               reject(`failed to start the firecracker ${signal} `)
            }
         })


      } catch (error) {
         console.log('error in startfirecracker', error);
         reject(error);
      }
   })

}