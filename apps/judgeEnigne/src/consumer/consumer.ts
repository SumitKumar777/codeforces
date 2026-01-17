import { judgeEngine } from "@repo/redis-client";



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
         console.log("judge submission  Read respone ", response[0]?.messages[0]);
         
      }else{
         console.log("no response");
      }
  



   }

}


submissionListner().catch((err)=>{
   console.log("error in judge listner",err)
})