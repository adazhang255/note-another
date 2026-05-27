import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: [".env.local", ".env"] });

// Detect common Prisma CLI invocation patterns so migrations run against
// the direct DB connection (DIRECT_URL) while the app can continue using
// the pooled DATABASE_URL at runtime.
const isPrismaCliMigration = process.argv.some((arg) => /migrate|db/.test(arg)) || process.env.PRISMA_MIGRATE === "true";

const runtimeDatabaseUrl = process.env["DATABASE_URL"];
const directDatabaseUrl = process.env["DIRECT_URL"];

const effectiveUrl = isPrismaCliMigration ? (directDatabaseUrl ?? runtimeDatabaseUrl) : runtimeDatabaseUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // `url` is what Migrate/CLI will use; we prefer DIRECT_URL during CLI migrate runs.
    url: effectiveUrl,
    // Keep `directUrl` available for Prisma Client runtime if needed.
    directUrl: directDatabaseUrl,
  },
});
