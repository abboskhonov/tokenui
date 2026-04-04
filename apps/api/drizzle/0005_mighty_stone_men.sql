CREATE TABLE "bookmark" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"design_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "design_view" (
	"id" text PRIMARY KEY NOT NULL,
	"design_id" text NOT NULL,
	"user_id" text,
	"ip_hash" text,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_design_id_design_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."design"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_view" ADD CONSTRAINT "design_view_design_id_design_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."design"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_view" ADD CONSTRAINT "design_view_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookmark_userId_idx" ON "bookmark" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bookmark_designId_idx" ON "bookmark" USING btree ("design_id");--> statement-breakpoint
CREATE INDEX "bookmark_user_design_idx" ON "bookmark" USING btree ("user_id","design_id");--> statement-breakpoint
CREATE INDEX "designView_designId_idx" ON "design_view" USING btree ("design_id");--> statement-breakpoint
CREATE INDEX "designView_userId_idx" ON "design_view" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "designView_design_user_idx" ON "design_view" USING btree ("design_id","user_id");--> statement-breakpoint
CREATE INDEX "designView_design_ip_idx" ON "design_view" USING btree ("design_id","ip_hash");--> statement-breakpoint
CREATE INDEX "designView_viewedAt_idx" ON "design_view" USING btree ("viewed_at");--> statement-breakpoint
CREATE INDEX "design_createdAt_idx" ON "design" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "design_public_createdAt_idx" ON "design" USING btree ("is_public","created_at");