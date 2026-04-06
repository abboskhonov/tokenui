// Setup script for simplified anonymous cli_run table
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "../../.env") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function setup() {
  try {
    // Drop old tables
    await sql`DROP TABLE IF EXISTS cli_install`;
    await sql`DROP TABLE IF EXISTS cli_run`;
    console.log("✓ Dropped old tables");
    
    // Create new anonymous table - just version, command, timestamp
    await sql`CREATE TABLE cli_run (
      id TEXT PRIMARY KEY NOT NULL,
      version TEXT,
      command TEXT,
      run_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`;
    console.log("✓ Created anonymous cli_run table");
    
    // Create indexes
    await sql`CREATE INDEX cliRun_runAt_idx ON cli_run (run_at)`;
    await sql`CREATE INDEX cliRun_command_idx ON cli_run (command)`;
    console.log("✓ Created indexes");
    
    console.log("\n✅ Anonymous tracking ready!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

setup();
