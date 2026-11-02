import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: {
    allowedHosts: [
      "lee-type.vercel.app",
      "lee-type-*-stanl3yl33s-projects.vercel.app",
      "localhost:*",
    ],
    fallback: process.env.BETTER_AUTH_URL,
  },
});
