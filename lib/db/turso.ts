import { createClient, type Client } from "@libsql/client";

function createTursoClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;

  // Fall back to a local SQLite file so API routes can load without Turso env vars.
  // An empty URL makes createClient throw at import time, which causes Next.js
  // to return an HTML error page instead of JSON.
  if (!url) {
    return createClient({ url: "file:local.db" });
  }

  return createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

export const turso = createTursoClient();
