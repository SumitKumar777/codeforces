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
  try {
    if (response) {
      console.log("response from stream in api ", (response[0]?.messages[0]?.message));
      console.log("response from stream  2 ", JSON.parse(response[0]?.messages[0]?.message.result as string));
      
    }
  } catch (error) {
    console.log("error in the parsing the result Stream in backend api", error);
  }

  }
}

resultListener().catch((err)=>{
   console.error("error in result listener ", err);
});