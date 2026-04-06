// Check CLI tracking data
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

async function check() {
  try {
    const runs = await sql`SELECT * FROM cli_run ORDER BY run_at DESC LIMIT 10`;
    const count = await sql`SELECT COUNT(*) as total FROM cli_run`;
    
    console.log(`Total CLI runs: ${count[0].total}`);
    console.log("\nRecent runs:");
    console.table(runs);
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

check();
