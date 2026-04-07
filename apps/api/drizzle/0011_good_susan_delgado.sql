CREATE TABLE "design_download" (
	"id" text PRIMARY KEY NOT NULL,
	"design_id" text NOT NULL,
	"user_id" text,
	"downloaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "design" ADD COLUMN "download_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "design_download" ADD CONSTRAINT "design_download_design_id_design_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."design"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "design_download" ADD CONSTRAINT "design_download_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "designDownload_designId_idx" ON "design_download" USING btree ("design_id");--> statement-breakpoint
CREATE INDEX "designDownload_userId_idx" ON "design_download" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "designDownload_design_user_idx" ON "design_download" USING btree ("design_id","user_id");--> statement-breakpoint
CREATE INDEX "designDownload_downloadedAt_idx" ON "design_download" USING btree ("downloaded_at");