import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function getApiRedisClient(): Promise<RedisClientType> {
   if (client) return client;

   client = createClient({ url: "redis://localhost:6379" });
   await client.connect();

   return client;
}
