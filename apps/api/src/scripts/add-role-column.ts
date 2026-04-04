import { config } from "dotenv"
import { neon } from "@neondatabase/serverless"

config()

const sql = neon(process.env.DATABASE_URL!)

async function main() {
  console.log("Adding role column to user table...")
  
  try {
    // Check if role column already exists
    const checkResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user' AND column_name = 'role'
    `
    
    if (checkResult.length > 0) {
      console.log("✓ Role column already exists")
      return
    }
    
    // Add the role column
    await sql`ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL`
    console.log("✓ Role column added successfully")
    
    // Verify
    const verifyResult = await sql`SELECT role FROM "user" LIMIT 1`
    console.log("✓ Verified: role column is accessible")
    
  } catch (error) {
    console.error("✗ Error:", error)
    process.exit(1)
  }
}

main()
