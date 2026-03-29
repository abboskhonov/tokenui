CREATE TABLE "design" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"content" text NOT NULL,
	"demo_url" text,
	"thumbnail_url" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "design" ADD CONSTRAINT "design_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "design_userId_idx" ON "design" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "design_category_idx" ON "design" USING btree ("category");--> statement-breakpoint
CREATE INDEX "design_public_idx" ON "design" USING btree ("is_public");