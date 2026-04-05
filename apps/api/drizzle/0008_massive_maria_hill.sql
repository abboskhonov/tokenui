CREATE TABLE "star" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"design_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "design" RENAME COLUMN "is_public" TO "status";--> statement-breakpoint
DROP INDEX "design_public_idx";--> statement-breakpoint
DROP INDEX "design_public_createdAt_idx";--> statement-breakpoint
ALTER TABLE "design" ADD COLUMN "review_message" text;--> statement-breakpoint
ALTER TABLE "design" ADD COLUMN "files" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "youtube" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "instagram" text;--> statement-breakpoint
ALTER TABLE "star" ADD CONSTRAINT "star_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "star" ADD CONSTRAINT "star_design_id_design_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."design"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "star_userId_idx" ON "star" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "star_designId_idx" ON "star" USING btree ("design_id");--> statement-breakpoint
CREATE INDEX "star_user_design_idx" ON "star" USING btree ("user_id","design_id");--> statement-breakpoint
CREATE INDEX "design_status_idx" ON "design" USING btree ("status");--> statement-breakpoint
CREATE INDEX "design_approved_createdAt_idx" ON "design" USING btree ("status","created_at");