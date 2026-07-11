import { relations } from "drizzle-orm";

import {
  mediaAssets,
  mediaAssetTranslations,
  pages,
  pageSections,
  pageSectionTranslations,
  pageTranslations,
  sessions,
  translationJobs,
  translationRevisions,
  users,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({ sessions: many(sessions) }));
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
export const pagesRelations = relations(pages, ({ many }) => ({
  translations: many(pageTranslations),
  sections: many(pageSections),
}));
export const pageTranslationsRelations = relations(pageTranslations, ({ one }) => ({
  page: one(pages, { fields: [pageTranslations.pageId], references: [pages.id] }),
}));
export const pageSectionsRelations = relations(pageSections, ({ one, many }) => ({
  page: one(pages, { fields: [pageSections.pageId], references: [pages.id] }),
  translations: many(pageSectionTranslations),
}));
export const pageSectionTranslationsRelations = relations(pageSectionTranslations, ({ one }) => ({
  section: one(pageSections, {
    fields: [pageSectionTranslations.pageSectionId],
    references: [pageSections.id],
  }),
}));
export const mediaAssetsRelations = relations(mediaAssets, ({ many }) => ({
  translations: many(mediaAssetTranslations),
}));
export const mediaAssetTranslationsRelations = relations(mediaAssetTranslations, ({ one }) => ({
  asset: one(mediaAssets, {
    fields: [mediaAssetTranslations.mediaAssetId],
    references: [mediaAssets.id],
  }),
}));
export const translationJobsRelations = relations(translationJobs, ({ many }) => ({
  revisions: many(translationRevisions),
}));
export const translationRevisionsRelations = relations(translationRevisions, ({ one }) => ({
  job: one(translationJobs, {
    fields: [translationRevisions.translationJobId],
    references: [translationJobs.id],
  }),
}));
