import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const locales = ["es", "ca", "eu", "gl", "pt", "en", "fr", "de"] as const;
export type Locale = (typeof locales)[number];

export const localeEnum = pgEnum("locale", locales);
export const translationStatusEnum = pgEnum("translation_status", [
  "missing",
  "machine_draft",
  "in_review",
  "approved",
  "published",
]);
export const translatorTypeEnum = pgEnum("translator_type", [
  "migration",
  "machine",
  "human",
  "human_edited_machine",
]);
export const pageTypeEnum = pgEnum("page_type", ["landing", "legal", "listing", "form"]);
export const userRoleEnum = pgEnum("user_role", ["admin", "editor", "reviewer"]);
export const translationJobStatusEnum = pgEnum("translation_job_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
]);
export const attachmentStatusEnum = pgEnum("attachment_status", [
  "pending_scan",
  "clean",
  "infected",
  "rejected",
  "deleted",
]);
export const submissionStatusEnum = pgEnum("submission_status", [
  "new",
  "in_progress",
  "resolved",
  "deleted",
]);
export const navigationLocationEnum = pgEnum("navigation_location", ["header", "footer", "legal"]);

const createdAt = timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const updatedAt = timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();

export type PageConfig = Record<string, unknown>;
export type PageContent = Record<string, unknown>;
export type SectionContent = Record<string, unknown>;
export type JsonSchema = Record<string, unknown>;

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    oidcSubject: text("oidc_subject").notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    displayName: text("display_name"),
    role: userRoleEnum("role").default("reviewer").notNull(),
    active: boolean("active").default(true).notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("users_oidc_subject_uidx").on(table.oidcSubject),
    uniqueIndex("users_email_lower_uidx").on(sql`lower(${table.email})`),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 128 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    ipHash: varchar("ip_hash", { length: 128 }),
    userAgent: text("user_agent"),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt,
  },
  (table) => [
    uniqueIndex("sessions_token_hash_uidx").on(table.tokenHash),
    index("sessions_user_expires_idx").on(table.userId, table.expiresAt),
  ],
);

export const pages = pgTable(
  "pages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 160 }).notNull(),
    type: pageTypeEnum("type").default("landing").notNull(),
    sourceRevision: integer("source_revision").default(1).notNull(),
    config: jsonb("config").$type<PageConfig>().default({}).notNull(),
    active: boolean("active").default(true).notNull(),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("pages_key_uidx").on(table.key),
    check("pages_source_revision_positive", sql`${table.sourceRevision} > 0`),
  ],
);

export const pageTranslations = pgTable(
  "page_translations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pageId: uuid("page_id").notNull().references(() => pages.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    localizedPath: varchar("localized_path", { length: 500 }).notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    ogImageId: uuid("og_image_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    content: jsonb("content").$type<PageContent>().default({}).notNull(),
    status: translationStatusEnum("status").default("missing").notNull(),
    translatorType: translatorTypeEnum("translator_type").default("human").notNull(),
    sourceRevision: integer("source_revision").default(1).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("page_translations_page_locale_uidx").on(table.pageId, table.locale),
    uniqueIndex("page_translations_locale_path_uidx").on(table.locale, table.localizedPath),
    index("page_translations_status_locale_idx").on(table.status, table.locale),
    check("page_translations_path_shape", sql`${table.localizedPath} LIKE '/%'`),
    check("page_translations_source_revision_positive", sql`${table.sourceRevision} > 0`),
  ],
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storageKey: text("storage_key").notNull(),
    sourceUrl: text("source_url"),
    checksum: varchar("checksum", { length: 128 }).notNull(),
    mimeType: varchar("mime_type", { length: 255 }).notNull(),
    byteSize: bigint("byte_size", { mode: "number" }).notNull(),
    width: integer("width"),
    height: integer("height"),
    isPrivate: boolean("is_private").default(false).notNull(),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("media_assets_storage_key_uidx").on(table.storageKey),
    uniqueIndex("media_assets_checksum_uidx").on(table.checksum),
    check("media_assets_byte_size_nonnegative", sql`${table.byteSize} >= 0`),
  ],
);

export const mediaAssetTranslations = pgTable(
  "media_asset_translations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mediaAssetId: uuid("media_asset_id").notNull().references(() => mediaAssets.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    alt: text("alt").notNull(),
    title: text("title"),
    caption: text("caption"),
    translatorType: translatorTypeEnum("translator_type").default("human").notNull(),
    sourceRevision: integer("source_revision").default(1).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("media_asset_translations_asset_locale_uidx").on(table.mediaAssetId, table.locale)],
);

export const pageSections = pgTable(
  "page_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pageId: uuid("page_id").notNull().references(() => pages.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 160 }).notNull(),
    componentType: varchar("component_type", { length: 80 }).notNull(),
    position: integer("position").notNull(),
    config: jsonb("config").$type<Record<string, unknown>>().default({}).notNull(),
    schema: jsonb("schema").$type<JsonSchema>().default({}).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("page_sections_page_key_uidx").on(table.pageId, table.key),
    uniqueIndex("page_sections_page_position_uidx").on(table.pageId, table.position),
    check("page_sections_position_nonnegative", sql`${table.position} >= 0`),
  ],
);

export const pageSectionTranslations = pgTable(
  "page_section_translations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pageSectionId: uuid("page_section_id").notNull().references(() => pageSections.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    content: jsonb("content").$type<SectionContent>().default({}).notNull(),
    status: translationStatusEnum("status").default("missing").notNull(),
    translatorType: translatorTypeEnum("translator_type").default("human").notNull(),
    sourceRevision: integer("source_revision").default(1).notNull(),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("page_section_translations_section_locale_uidx").on(table.pageSectionId, table.locale),
    index("page_section_translations_status_locale_idx").on(table.status, table.locale),
  ],
);

export const navigationItems = pgTable(
  "navigation_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 160 }).notNull(),
    parentId: uuid("parent_id").references((): AnyPgColumn => navigationItems.id, { onDelete: "cascade" }),
    pageId: uuid("page_id").references(() => pages.id, { onDelete: "set null" }),
    location: navigationLocationEnum("location").notNull(),
    position: integer("position").notNull(),
    externalUrl: text("external_url"),
    active: boolean("active").default(true).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("navigation_items_key_uidx").on(table.key),
    index("navigation_items_location_position_idx").on(table.location, table.position),
  ],
);

export const navigationItemTranslations = pgTable(
  "navigation_item_translations",
  {
    navigationItemId: uuid("navigation_item_id").notNull().references(() => navigationItems.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    label: text("label").notNull(),
    ariaLabel: text("aria_label"),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.navigationItemId, table.locale] })],
);

export const siteSettings = pgTable(
  "site_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 160 }).notNull(),
    value: jsonb("value").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex("site_settings_key_uidx").on(table.key)],
);

export const siteSettingTranslations = pgTable(
  "site_setting_translations",
  {
    siteSettingId: uuid("site_setting_id").notNull().references(() => siteSettings.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    value: jsonb("value").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.siteSettingId, table.locale] })],
);

export const translationGlossary = pgTable(
  "translation_glossary",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceTerm: text("source_term").notNull(),
    targetLocale: localeEnum("target_locale").notNull(),
    approvedTranslation: text("approved_translation").notNull(),
    notes: text("notes"),
    caseSensitive: boolean("case_sensitive").default(false).notNull(),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("translation_glossary_term_locale_uidx").on(table.sourceTerm, table.targetLocale),
    check("translation_glossary_target_not_es", sql`${table.targetLocale} <> 'es'::locale`),
  ],
);

export const translationJobs = pgTable(
  "translation_jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    provider: varchar("provider", { length: 80 }).notNull(),
    status: translationJobStatusEnum("status").default("pending").notNull(),
    targetType: varchar("target_type", { length: 80 }).notNull(),
    targetId: uuid("target_id").notNull(),
    sourceLocale: localeEnum("source_locale").default("es").notNull(),
    targetLocale: localeEnum("target_locale").notNull(),
    sourceRevision: integer("source_revision").notNull(),
    input: jsonb("input").$type<Record<string, unknown>>().notNull(),
    output: jsonb("output").$type<Record<string, unknown>>(),
    attempts: integer("attempts").default(0).notNull(),
    maxAttempts: integer("max_attempts").default(3).notNull(),
    error: text("error"),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    lockedBy: varchar("locked_by", { length: 160 }),
    runAfter: timestamp("run_after", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("translation_jobs_claim_idx").on(table.status, table.runAfter, table.createdAt),
    uniqueIndex("translation_jobs_target_revision_uidx").on(table.targetType, table.targetId, table.targetLocale, table.sourceRevision),
    check("translation_jobs_target_not_source", sql`${table.targetLocale} <> ${table.sourceLocale}`),
    check("translation_jobs_attempts_valid", sql`${table.attempts} >= 0 AND ${table.maxAttempts} > 0`),
  ],
);

export const translationRevisions = pgTable(
  "translation_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    targetType: varchar("target_type", { length: 80 }).notNull(),
    targetId: uuid("target_id").notNull(),
    locale: localeEnum("locale").notNull(),
    revision: integer("revision").notNull(),
    sourceRevision: integer("source_revision").notNull(),
    status: translationStatusEnum("status").notNull(),
    translatorType: translatorTypeEnum("translator_type").notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    translationJobId: uuid("translation_job_id").references(() => translationJobs.id, { onDelete: "set null" }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt,
  },
  (table) => [
    uniqueIndex("translation_revisions_target_locale_revision_uidx").on(
      table.targetType,
      table.targetId,
      table.locale,
      table.revision,
    ),
    index("translation_revisions_target_idx").on(table.targetType, table.targetId, table.locale),
  ],
);

export const redirects = pgTable(
  "redirects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourcePath: varchar("source_path", { length: 500 }).notNull(),
    destinationPath: varchar("destination_path", { length: 500 }).notNull(),
    statusCode: integer("status_code").default(301).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("redirects_source_path_uidx").on(table.sourcePath),
    check("redirects_status_code_valid", sql`${table.statusCode} IN (301, 302, 307, 308)`),
    check("redirects_not_self", sql`${table.sourcePath} <> ${table.destinationPath}`),
  ],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 120 }).notNull(),
    entityType: varchar("entity_type", { length: 80 }).notNull(),
    entityId: uuid("entity_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
    ipHash: varchar("ip_hash", { length: 128 }),
    createdAt,
  },
  (table) => [index("audit_logs_entity_idx").on(table.entityType, table.entityId, table.createdAt)],
);

const submissionColumns = {
  id: uuid("id").defaultRandom().primaryKey(),
  idempotencyKeyHash: varchar("idempotency_key_hash", { length: 128 }).notNull(),
  status: submissionStatusEnum("status").default("new").notNull(),
  locale: localeEnum("locale").default("es").notNull(),
  consent: boolean("consent").notNull(),
  retentionUntil: timestamp("retention_until", { withTimezone: true }).notNull(),
  createdAt,
  updatedAt,
};

export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    ...submissionColumns,
    name: text("name").notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 80 }),
    company: text("company"),
    subject: text("subject"),
    message: text("message").notNull(),
  },
  (table) => [index("contact_submissions_status_created_idx").on(table.status, table.createdAt), uniqueIndex("contact_submissions_idempotency_uidx").on(table.idempotencyKeyHash)],
);

export const jobApplications = pgTable(
  "job_applications",
  {
    ...submissionColumns,
    name: text("name").notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 80 }),
    position: text("position"),
    message: text("message"),
    encryptedIdentity: text("encrypted_identity"),
  },
  (table) => [index("job_applications_status_created_idx").on(table.status, table.createdAt), uniqueIndex("job_applications_idempotency_uidx").on(table.idempotencyKeyHash)],
);

export const complaintSubmissions = pgTable(
  "complaint_submissions",
  {
    ...submissionColumns,
    referenceCodeHash: varchar("reference_code_hash", { length: 128 }).notNull(),
    encryptedPayload: text("encrypted_payload").notNull(),
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("complaint_submissions_reference_hash_uidx").on(table.referenceCodeHash),
    uniqueIndex("complaint_submissions_idempotency_uidx").on(table.idempotencyKeyHash),
    index("complaint_submissions_status_created_idx").on(table.status, table.createdAt),
  ],
);

export const formRateLimits = pgTable("form_rate_limits", {
  keyHash: varchar("key_hash", { length: 128 }).primaryKey(),
  count: integer("count").default(1).notNull(),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
  updatedAt,
});

export const submissionAttachments = pgTable(
  "submission_attachments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contactSubmissionId: uuid("contact_submission_id").references(() => contactSubmissions.id, { onDelete: "cascade" }),
    jobApplicationId: uuid("job_application_id").references(() => jobApplications.id, { onDelete: "cascade" }),
    complaintSubmissionId: uuid("complaint_submission_id").references(() => complaintSubmissions.id, { onDelete: "cascade" }),
    storageKey: text("storage_key").notNull(),
    originalFilename: text("original_filename").notNull(),
    mimeType: varchar("mime_type", { length: 255 }).notNull(),
    byteSize: bigint("byte_size", { mode: "number" }).notNull(),
    checksum: varchar("checksum", { length: 128 }).notNull(),
    status: attachmentStatusEnum("status").default("pending_scan").notNull(),
    scannedAt: timestamp("scanned_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt,
  },
  (table) => [
    uniqueIndex("submission_attachments_storage_key_uidx").on(table.storageKey),
    index("submission_attachments_status_idx").on(table.status, table.createdAt),
    check(
      "submission_attachments_one_owner",
      sql`num_nonnulls(${table.contactSubmissionId}, ${table.jobApplicationId}, ${table.complaintSubmissionId}) = 1`,
    ),
    check("submission_attachments_byte_size_nonnegative", sql`${table.byteSize} >= 0`),
  ],
);

export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type PageTranslation = typeof pageTranslations.$inferSelect;
export type NewPageTranslation = typeof pageTranslations.$inferInsert;
export type TranslationJob = typeof translationJobs.$inferSelect;
export type NewTranslationJob = typeof translationJobs.$inferInsert;
