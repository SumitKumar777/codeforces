import { judgeEngine } from "@repo/redis-client";
import { redis } from "@repo/redis-client";



export async function createStreamConsumerGroup(client: redis.RedisClientType) {

   try {
      const consGrpCrt = await client.xGroupCreate(
         "submissionStream",
         "submissionReaderGroup",
         "0",
         {
            MKSTREAM: true,
         },
      );
      console.log("stream and group created", consGrpCrt);
   } catch (error) {
      console.log("error in creation of readerGroup", error);
      throw error
   }

   console.log("consumer group created successfully");

}

(async () => {
   const client = await judgeEngine.getJudgeWriteRedisClient();

   try {
      await createStreamConsumerGroup(client);
      console.log("created the stream and consumer group in the script");
   } catch (err) {
      console.error("error running redis init script", err);
   } finally {
      await client.quit();
   }
})();
