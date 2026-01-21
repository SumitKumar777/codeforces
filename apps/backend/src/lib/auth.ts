import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins";

import { ac, admin, user, teacher } from "@repo/auth";

import { prisma } from "@repo/db";
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL as string,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    adminPlugin({
      adminUserIds: ["34562f3b-8335-445c-b983-40c03050e3aa"],
      ac,
      roles: {
        admin,
        user,
        teacher,
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false,
  },
});
