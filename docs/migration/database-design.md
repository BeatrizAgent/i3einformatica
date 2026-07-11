# Diseño PostgreSQL

PostgreSQL + Drizzle ORM/Kit, UUID, timestamps UTC, JSONB validado en aplicación, migraciones versionadas. Sin SQLite. Índices de FK y consultas editoriales.

## Entidades

| Tabla | Campos clave / reglas |
|---|---|
| `pages` | id, key único, type, source_revision, config JSONB, status global, timestamps |
| `page_translations` | page_id, locale, localized_path, title, excerpt, seo/og, content, workflow/trazabilidad; únicos `(page_id,locale)` y `(locale,localized_path)` |
| `page_sections` | id, page_id, type, position, config; único `(page_id,position)` |
| `page_section_translations` | section_id, locale, content, workflow/trazabilidad; único `(section_id,locale)` |
| `media_assets` | id, object_key único, source_url, SHA-256, MIME, bytes, width/height, visibility, timestamps |
| `media_asset_translations` | asset_id, locale, alt, title, caption; único `(asset_id,locale)` |
| `navigation_items` | id, parent_id, page_id/url, position, config; evitar ciclos en servicio |
| `navigation_item_translations` | item_id, locale, label; único `(item_id,locale)` |
| `site_settings` | id, key único, value/config no traducible |
| `site_setting_translations` | setting_id, locale, content; único `(setting_id,locale)` |
| `translation_glossary` | source_term, target_locale, approved_translation, notes; único normalizado por término/locale |
| `translation_jobs` | entity type/id, locale, provider, status, attempts/max, available/locked timestamps, input/output/error JSONB |
| `translation_revisions` | entity type/id, locale, revision, immutable content, actor/type/timestamp; único por entidad/locale/revision |
| `redirects` | source_path único, target_path, status_code 301/302/307/308, active, timestamps |
| `users` | id, oidc_subject único, email, role, active, timestamps |
| `sessions` | id hash, user_id, expires_at, revoked_at, metadata mínima |
| `audit_logs` | actor, action, target, before/after JSONB redacted, request metadata sin PII, timestamp |
| `contact_submissions` | id, locale, fields cifrables, consent_at, status, retention_until |
| `job_applications` | id, locale, identity/contact, message, consent_at, status, retention_until |
| `complaint_submissions` | id, locale, anonymous flag, sensitive payload cifrado, status, retention_until |
| `submission_attachments` | owner type/id, private object_key, checksum, MIME, bytes, scan status/result, timestamps |

Enums: `locale`; `translation_status`; `translator_type`; `user_role(admin,editor,reviewer)`; job status; submission status; attachment scan status; visibility. `complaint_submissions` separado para autorización/retención jurídica.

## Reglas transaccionales

- Publicar bloque/página modifica solo locale objetivo, exige estado aprobado y revisión vigente según política.
- Editar ES incrementa una vez `source_revision`; stale se calcula comparando revisiones.
- Edición de contenido aprobado crea nueva `translation_revision`; nunca update destructivo sin historial.
- Worker reclama job con `FOR UPDATE SKIP LOCKED`, lease y límite de intentos; idempotency key evita duplicados.
- Importación hace upsert por keys estables y checksum; segunda ejecución mantiene mismo estado lógico.
- Audit log se escribe en misma transacción que acción editorial/sensible.
- Borrado personal usa job auditado; adjunto se elimina del objeto y DB según retención/legal hold.

