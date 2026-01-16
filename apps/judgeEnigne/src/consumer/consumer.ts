import { judgeEngine } from "@repo/redis-client";



console.log("Judge Engine Client:", judgeEngine);



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
   console.log("judge submission  Read respone ", response);
   }

}


submissionListner().catch((err)=>{
   console.log("error in judge listner",err)
})