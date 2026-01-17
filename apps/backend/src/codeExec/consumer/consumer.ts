import { apiClient } from "@repo/redis-client";



 

async function resultListener(){

const  readClient = await apiClient.getApiReadRedisClient();
console.log("consumer started in api");

while (true) {
    const response = await readClient.xReadGroup(
      "resultStreamConsumerGroup",
      "ApiConsumer1",{
        key:"resultStream",
        id:">"
      },{
        BLOCK:0,
        COUNT:10
      }
    );
    console.log("response from stream in api ", response);

  }
}

resultListener().catch((err)=>{
   console.error("error in result listener ", err);
});