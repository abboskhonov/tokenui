// Migration script to update CLI tracking from installs to runs
import { sql } from "drizzle-orm"
import { db } from "../db/index.js"

async function migrate() {
  try {
    // Drop the old cli_install table if it exists
    await db.execute(sql`DROP TABLE IF EXISTS cli_install`)
    console.log("Dropped old cli_install table")

    // Create the new cli_run table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cli_run (
        id TEXT PRIMARY KEY NOT NULL,
        machine_id TEXT NOT NULL,
        version TEXT,
        platform_hash TEXT,
        ip_hash TEXT,
        command TEXT,
        run_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `)
    console.log("Created new cli_run table")

    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS cliRun_machineId_idx ON cli_run USING btree (machine_id)`)
    await db.execute(sql`CREATE INDEX IF NOT EXISTS cliRun_runAt_idx ON cli_run USING btree (run_at)`)
    await db.execute(sql`CREATE INDEX IF NOT EXISTS cliRun_command_idx ON cli_run USING btree (command)`)
    console.log("Created indexes")

    console.log("Migration completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

migrate()
