-- Add status column to design table
ALTER TABLE "design" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'draft' NOT NULL;

-- Add review message column
ALTER TABLE "design" ADD COLUMN IF NOT EXISTS "review_message" text;

-- Migrate existing data: is_public=true -> 'approved', is_public=false -> 'draft'
UPDATE "design" SET "status" = CASE WHEN "is_public" = true THEN 'approved' ELSE 'draft' END;

-- Create indexes for status
CREATE INDEX IF NOT EXISTS "design_status_idx" ON "design" USING btree ("status");
CREATE INDEX IF NOT EXISTS "design_approved_createdAt_idx" ON "design" USING btree ("status","created_at");

-- Note: Keep is_public column for now, don't drop it to avoid breaking existing code
