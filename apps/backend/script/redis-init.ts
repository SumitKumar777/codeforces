

import { apiClient, redis } from "@repo/redis-client";




export async function createStreamConsumerGroup() {

   const client = await apiClient.getApiWriteRedisClient();

   const type = await client.type("resultStream");

   if (type != "stream") {
      const consGrpCrt = await client.xGroupCreate("resultStream", "resultStreamConsumerGroup", "0", {
         MKSTREAM: true
      })
      console.log("stream and group created", consGrpCrt);
   } else {
      console.log("stream and group already created");

   }
   return;
}



(async()=>{
   await createStreamConsumerGroup();
   console.log("created the stream and consumer group in the script");
})()