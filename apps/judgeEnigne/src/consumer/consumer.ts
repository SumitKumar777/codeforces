import { judgeEngine } from "@repo/redis-client";
import { problemProcessor } from "./processor.js";



async function submissionListner(){

   const readClient= await judgeEngine.getJudgeReadRedisClient();

   while(true){

      const response = await readClient.xReadGroup(
         "submissionReaderGroup",
         "consumer1",{
            key:"submissionStream",
            id:">"
         },{
            BLOCK:0,
            COUNT:10
         }
      )


      if(response){
         console.log("judge submission  Read respone ", response[0]?.messages[0]?.message);

         if (response[0]?.messages[0]?.message.submissionId){
            await problemProcessor(response[0]?.messages[0]?.message.submissionId);
         }else{
            console.log("submission id is missing in judgeConsumer");
         }

      }else{
         console.log("no response");
      }


   }

}


submissionListner().catch((err)=>{
   console.log("error in judge listner",err)
})