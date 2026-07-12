# Diseño de Base de Datos (Backlog Futuro — PostgreSQL)

El sitio web estático actual utiliza un sistema de archivos estructurados locales (JSON) como base de datos de contenido editorial (`data/content/pages/`).

Este documento se conserva como especificación técnica para cuando el proyecto requiera migrar a una arquitectura dinámica con PostgreSQL + Drizzle ORM.

---

## 1. Entidades en Backlog

| Tabla | Propósito y Reglas |
|---|---|
| `pages` y `page_translations` | Almacenamiento dinámico e historial de versiones por locale de las páginas. |
| `media_assets` | Catálogo de activos y su metadata en la base de datos sincronizada. |
| `translation_jobs` | Cola de traducción en background (OpenAI/DeepL). |
| `contact_submissions` | Registro seguro de consultas con campos de PII cifrados. |
| `job_applications` | Candidaturas y CVs en cuarentena para revisión. |
| `complaint_submissions` | Canal de denuncias con cifrado a nivel de fila y retención DPO. |

---

## 2. Reglas transaccionales de control

*   Cualquier introducción de base de datos activa requerirá la habilitación de migraciones idempotentes versionadas (Drizzle Kit).
*   Se prohibirá la persistencia de datos sensibles sin cifrado de extremo a extremo y auditoría integrada.
