

import { apiClient } from "@repo/redis-client";
import { redis } from "@repo/redis-client";


export async function createStreamConsumerGroup(client: redis.RedisClientType) {

   try {
      const consGrpCrt = await client.xGroupCreate("resultStream", "resultStreamConsumerGroup", "0", {
         MKSTREAM: true
      })
      console.log("stream and group created", consGrpCrt);
   } catch (error) {
      console.log('error in result stream creation', error);
      throw error;
   }
   return;
}


(async () => {
   const client = await apiClient.getApiWriteRedisClient();
   try {
      await createStreamConsumerGroup(client);
      console.log("created the stream and consumer group in the script");
   } catch (err) {
      console.error("error running redis init script", err);
   } finally {
      await client.quit();
   }
})();