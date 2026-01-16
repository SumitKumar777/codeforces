import { createClient, type RedisClientType } from "redis";

let readClient: RedisClientType | null = null;
let writeClient: RedisClientType | null = null;
export async function getApiReadRedisClient(): Promise<RedisClientType> {
   if (readClient) return readClient;

   readClient = createClient({ url: "redis://localhost:6379" });
   await readClient.connect();

   return readClient;
}

export async function getApiWriteRedisClient():Promise<RedisClientType>{
   if (writeClient) return writeClient;

   writeClient = createClient({ url: "redis://localhost:6379" });
   await writeClient.connect();

   return writeClient;
}

