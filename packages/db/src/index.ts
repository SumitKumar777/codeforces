import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
export * from "../generated/prisma/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



config({ path: join(__dirname, "../../.env") });

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});


export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
    log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}





export default prisma;
