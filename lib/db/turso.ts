import { createClient } from "@libsql/client";

export const turso = createClient({
  url: process.env.NEXT_PUBLIC_TURSO_DATABASE_URL || "",
  authToken: process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN,
});