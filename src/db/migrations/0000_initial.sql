CREATE TYPE "public"."attachment_status" AS ENUM('pending_scan', 'clean', 'infected', 'rejected', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('es', 'ca', 'eu', 'gl', 'pt', 'en', 'fr', 'de');--> statement-breakpoint
CREATE TYPE "public"."navigation_location" AS ENUM('header', 'footer', 'legal');--> statement-breakpoint
CREATE TYPE "public"."page_type" AS ENUM('landing', 'legal', 'listing', 'form');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('new', 'in_progress', 'resolved', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."translation_job_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."translation_status" AS ENUM('missing', 'machine_draft', 'in_review', 'approved', 'published');--> statement-breakpoint
CREATE TYPE "public"."translator_type" AS ENUM('migration', 'machine', 'human', 'human_edited_machine');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor', 'reviewer');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"action" varchar(120) NOT NULL,
	"entity_type" varchar(80) NOT NULL,
	"entity_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ip_hash" varchar(128),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "complaint_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idempotency_key_hash" varchar(128) NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"locale" "locale" DEFAULT 'es' NOT NULL,
	"consent" boolean NOT NULL,
	"retention_until" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reference_code_hash" varchar(128) NOT NULL,
	"encrypted_payload" text NOT NULL,
	"acknowledged_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idempotency_key_hash" varchar(128) NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"locale" "locale" DEFAULT 'es' NOT NULL,
	"consent" boolean NOT NULL,
	"retention_until" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(80),
	"company" text,
	"subject" text,
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idempotency_key_hash" varchar(128) NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"locale" "locale" DEFAULT 'es' NOT NULL,
	"consent" boolean NOT NULL,
	"retention_until" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(80),
	"position" text,
	"message" text,
	"encrypted_identity" text
);
--> statement-breakpoint
CREATE TABLE "form_rate_limits" (
	"key_hash" varchar(128) PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"reset_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_asset_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_asset_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"alt" text NOT NULL,
	"title" text,
	"caption" text,
	"translator_type" "translator_type" DEFAULT 'human' NOT NULL,
	"source_revision" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_key" text NOT NULL,
	"source_url" text,
	"checksum" varchar(128) NOT NULL,
	"mime_type" varchar(255) NOT NULL,
	"byte_size" bigint NOT NULL,
	"width" integer,
	"height" integer,
	"is_private" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_byte_size_nonnegative" CHECK ("media_assets"."byte_size" >= 0)
);
--> statement-breakpoint
CREATE TABLE "navigation_item_translations" (
	"navigation_item_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"label" text NOT NULL,
	"aria_label" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "navigation_item_translations_navigation_item_id_locale_pk" PRIMARY KEY("navigation_item_id","locale")
);
--> statement-breakpoint
CREATE TABLE "navigation_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(160) NOT NULL,
	"parent_id" uuid,
	"page_id" uuid,
	"location" "navigation_location" NOT NULL,
	"position" integer NOT NULL,
	"external_url" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_section_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_section_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "translation_status" DEFAULT 'missing' NOT NULL,
	"translator_type" "translator_type" DEFAULT 'human' NOT NULL,
	"source_revision" integer DEFAULT 1 NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"key" varchar(160) NOT NULL,
	"component_type" varchar(80) NOT NULL,
	"position" integer NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"schema" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_sections_position_nonnegative" CHECK ("page_sections"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "page_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"localized_path" varchar(500) NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"seo_title" text,
	"seo_description" text,
	"og_title" text,
	"og_description" text,
	"og_image_id" uuid,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "translation_status" DEFAULT 'missing' NOT NULL,
	"translator_type" "translator_type" DEFAULT 'human' NOT NULL,
	"source_revision" integer DEFAULT 1 NOT NULL,
	"published_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "page_translations_path_shape" CHECK ("page_translations"."localized_path" LIKE '/%'),
	CONSTRAINT "page_translations_source_revision_positive" CHECK ("page_translations"."source_revision" > 0)
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(160) NOT NULL,
	"type" "page_type" DEFAULT 'landing' NOT NULL,
	"source_revision" integer DEFAULT 1 NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_source_revision_positive" CHECK ("pages"."source_revision" > 0)
);
--> statement-breakpoint
CREATE TABLE "redirects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_path" varchar(500) NOT NULL,
	"destination_path" varchar(500) NOT NULL,
	"status_code" integer DEFAULT 301 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "redirects_status_code_valid" CHECK ("redirects"."status_code" IN (301, 302, 307, 308)),
	CONSTRAINT "redirects_not_self" CHECK ("redirects"."source_path" <> "redirects"."destination_path")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(128) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_hash" varchar(128),
	"user_agent" text,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_setting_translations" (
	"site_setting_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"value" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_setting_translations_site_setting_id_locale_pk" PRIMARY KEY("site_setting_id","locale")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(160) NOT NULL,
	"value" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_submission_id" uuid,
	"job_application_id" uuid,
	"complaint_submission_id" uuid,
	"storage_key" text NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" varchar(255) NOT NULL,
	"byte_size" bigint NOT NULL,
	"checksum" varchar(128) NOT NULL,
	"status" "attachment_status" DEFAULT 'pending_scan' NOT NULL,
	"scanned_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "submission_attachments_one_owner" CHECK (num_nonnulls("submission_attachments"."contact_submission_id", "submission_attachments"."job_application_id", "submission_attachments"."complaint_submission_id") = 1),
	CONSTRAINT "submission_attachments_byte_size_nonnegative" CHECK ("submission_attachments"."byte_size" >= 0)
);
--> statement-breakpoint
CREATE TABLE "translation_glossary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_term" text NOT NULL,
	"target_locale" "locale" NOT NULL,
	"approved_translation" text NOT NULL,
	"notes" text,
	"case_sensitive" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "translation_glossary_target_not_es" CHECK ("translation_glossary"."target_locale" <> 'es'::locale)
);
--> statement-breakpoint
CREATE TABLE "translation_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar(80) NOT NULL,
	"status" "translation_job_status" DEFAULT 'pending' NOT NULL,
	"target_type" varchar(80) NOT NULL,
	"target_id" uuid NOT NULL,
	"source_locale" "locale" DEFAULT 'es' NOT NULL,
	"target_locale" "locale" NOT NULL,
	"source_revision" integer NOT NULL,
	"input" jsonb NOT NULL,
	"output" jsonb,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"error" text,
	"locked_at" timestamp with time zone,
	"locked_by" varchar(160),
	"run_after" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "translation_jobs_target_not_source" CHECK ("translation_jobs"."target_locale" <> "translation_jobs"."source_locale"),
	CONSTRAINT "translation_jobs_attempts_valid" CHECK ("translation_jobs"."attempts" >= 0 AND "translation_jobs"."max_attempts" > 0)
);
--> statement-breakpoint
CREATE TABLE "translation_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_type" varchar(80) NOT NULL,
	"target_id" uuid NOT NULL,
	"locale" "locale" NOT NULL,
	"revision" integer NOT NULL,
	"source_revision" integer NOT NULL,
	"status" "translation_status" NOT NULL,
	"translator_type" "translator_type" NOT NULL,
	"snapshot" jsonb NOT NULL,
	"translation_job_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"oidc_subject" text NOT NULL,
	"email" varchar(320) NOT NULL,
	"display_name" text,
	"role" "user_role" DEFAULT 'reviewer' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_asset_translations" ADD CONSTRAINT "media_asset_translations_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "navigation_item_translations" ADD CONSTRAINT "navigation_item_translations_navigation_item_id_navigation_items_id_fk" FOREIGN KEY ("navigation_item_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_navigation_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_section_translations" ADD CONSTRAINT "page_section_translations_page_section_id_page_sections_id_fk" FOREIGN KEY ("page_section_id") REFERENCES "public"."page_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_section_translations" ADD CONSTRAINT "page_section_translations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_section_translations" ADD CONSTRAINT "page_section_translations_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_translations" ADD CONSTRAINT "page_translations_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_translations" ADD CONSTRAINT "page_translations_og_image_id_media_assets_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_translations" ADD CONSTRAINT "page_translations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_translations" ADD CONSTRAINT "page_translations_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_setting_translations" ADD CONSTRAINT "site_setting_translations_site_setting_id_site_settings_id_fk" FOREIGN KEY ("site_setting_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_attachments" ADD CONSTRAINT "submission_attachments_contact_submission_id_contact_submissions_id_fk" FOREIGN KEY ("contact_submission_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_attachments" ADD CONSTRAINT "submission_attachments_job_application_id_job_applications_id_fk" FOREIGN KEY ("job_application_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_attachments" ADD CONSTRAINT "submission_attachments_complaint_submission_id_complaint_submissions_id_fk" FOREIGN KEY ("complaint_submission_id") REFERENCES "public"."complaint_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translation_glossary" ADD CONSTRAINT "translation_glossary_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translation_glossary" ADD CONSTRAINT "translation_glossary_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translation_jobs" ADD CONSTRAINT "translation_jobs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translation_revisions" ADD CONSTRAINT "translation_revisions_translation_job_id_translation_jobs_id_fk" FOREIGN KEY ("translation_job_id") REFERENCES "public"."translation_jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translation_revisions" ADD CONSTRAINT "translation_revisions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "complaint_submissions_reference_hash_uidx" ON "complaint_submissions" USING btree ("reference_code_hash");--> statement-breakpoint
CREATE INDEX "complaint_submissions_status_created_idx" ON "complaint_submissions" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "complaint_submissions_idempotency_uidx" ON "complaint_submissions" USING btree ("idempotency_key_hash");--> statement-breakpoint
CREATE INDEX "contact_submissions_status_created_idx" ON "contact_submissions" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "contact_submissions_idempotency_uidx" ON "contact_submissions" USING btree ("idempotency_key_hash");--> statement-breakpoint
CREATE INDEX "job_applications_status_created_idx" ON "job_applications" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "job_applications_idempotency_uidx" ON "job_applications" USING btree ("idempotency_key_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "media_asset_translations_asset_locale_uidx" ON "media_asset_translations" USING btree ("media_asset_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_storage_key_uidx" ON "media_assets" USING btree ("storage_key");--> statement-breakpoint
CREATE UNIQUE INDEX "media_assets_checksum_uidx" ON "media_assets" USING btree ("checksum");--> statement-breakpoint
CREATE UNIQUE INDEX "navigation_items_key_uidx" ON "navigation_items" USING btree ("key");--> statement-breakpoint
CREATE INDEX "navigation_items_location_position_idx" ON "navigation_items" USING btree ("location","position");--> statement-breakpoint
CREATE UNIQUE INDEX "page_section_translations_section_locale_uidx" ON "page_section_translations" USING btree ("page_section_id","locale");--> statement-breakpoint
CREATE INDEX "page_section_translations_status_locale_idx" ON "page_section_translations" USING btree ("status","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "page_sections_page_key_uidx" ON "page_sections" USING btree ("page_id","key");--> statement-breakpoint
CREATE UNIQUE INDEX "page_sections_page_position_uidx" ON "page_sections" USING btree ("page_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "page_translations_page_locale_uidx" ON "page_translations" USING btree ("page_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "page_translations_locale_path_uidx" ON "page_translations" USING btree ("locale","localized_path");--> statement-breakpoint
CREATE INDEX "page_translations_status_locale_idx" ON "page_translations" USING btree ("status","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_key_uidx" ON "pages" USING btree ("key");--> statement-breakpoint
CREATE UNIQUE INDEX "redirects_source_path_uidx" ON "redirects" USING btree ("source_path");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_hash_uidx" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "sessions_user_expires_idx" ON "sessions" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "site_settings_key_uidx" ON "site_settings" USING btree ("key");--> statement-breakpoint
CREATE UNIQUE INDEX "submission_attachments_storage_key_uidx" ON "submission_attachments" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "submission_attachments_status_idx" ON "submission_attachments" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "translation_glossary_term_locale_uidx" ON "translation_glossary" USING btree ("source_term","target_locale");--> statement-breakpoint
CREATE INDEX "translation_jobs_claim_idx" ON "translation_jobs" USING btree ("status","run_after","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "translation_jobs_target_revision_uidx" ON "translation_jobs" USING btree ("target_type","target_id","target_locale","source_revision");--> statement-breakpoint
CREATE UNIQUE INDEX "translation_revisions_target_locale_revision_uidx" ON "translation_revisions" USING btree ("target_type","target_id","locale","revision");--> statement-breakpoint
CREATE INDEX "translation_revisions_target_idx" ON "translation_revisions" USING btree ("target_type","target_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "users_oidc_subject_uidx" ON "users" USING btree ("oidc_subject");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_uidx" ON "users" USING btree (lower("email"));
