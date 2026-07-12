# Plan de implementación verificable — Corte Estático vs Backlog Futuro

Este plan documenta el estado del proyecto, dividiendo el alcance en la arquitectura estática actual desplegada en GitHub Pages y el backlog futuro reservado para cuando se decida incorporar una base de datos o backend dinámico.

---

## 1. Alcance Implentado (Corte Estático Actual)

Estas tareas corresponden al sitio web estático pre-renderizado con Next.js y alojado en GitHub Pages.

| ID | Objetivo | Entradas | Archivos implicados | Estado | Validación / Criterio de Aceptación |
|---|---|---|---|---|---|
| **A1** | Snapshot reproducible | sitemap/web viva | `scripts/audit-site.ts`, `data/audit/*` | **Completed** | Mapeo y recolección de 33 páginas y 34 assets originales. |
| **A2** | Cerrar decisiones editoriales | inventarios/preguntas | `data/content/pages/*.json` | **Completed** | Normalización de contenidos, imágenes, datos corporativos y aprobaciones de licencias. |
| **S1** | Scaffold Next 16 TS estricto | contrato técnico | `src/app/`, `next.config.ts`, `.github/workflows/` | **Completed** | Compilación estricta y pipeline de CI para pruebas y linter. |
| **P1** | Sistema visual y bloques | diseño / componentes | `src/components/landing/`, `src/app/globals.css` | **Completed** | Estructuras premium para heroes, grids, métricas, logos y banners alternativos. |
| **P2** | Resolver rutas y locales | JSON publicado | `src/app/[[...segments]]/page.tsx` | **Completed** | Generación estática params en ES y EN, y ocultamiento explícito de machine drafts. |
| **SEO1** | Metadata y Sitemap | sitemap / robots | `src/app/sitemap.ts`, `src/app/robots.ts`, `scripts/validate-export.ts` | **Completed** | Generación de canonicals, hreflang alternativos, x-default y validación automatizada en build. |
| **Q1** | E2E y Accesibilidad | HTML generado | `scripts/validate-e2e.ts`, `scripts/post-build.ts` | **Completed** | Corrección de lang attributes y validación de alts de imágenes, etiquetas e inputs. |

---

## 2. Backlog Futuro (Requiere Base de Datos / Backend)

Estas tareas están fuera del corte estático actual y se mantienen documentadas como backlog para una futura evolución.

| ID | Objetivo | Requisitos de Desbloqueo | Archivos Previstos | Estado |
|---|---|---|---|---|
| **D1** | Schema y Migraciones DB | Aprobación de hosting dinámico y aprovisionamiento de PostgreSQL. | `src/lib/db/` | **Backlog** |
| **D2** | Importador / Seed dinámico | Migración de los JSONs locales a las tablas de PostgreSQL. | `scripts/db-import.ts` | **Backlog** |
| **I1** | Panel de administración | Implementación de autenticación de editores y control de cambios. | `src/app/admin/` | **Backlog** |
| **I2** | Traducción automática (AI Workers) | Configuración de API keys y worker queues en background. | `src/app/api/translate/` | **Backlog** |
| **F1** | Persistencia de candidaturas y CVs | Almacenamiento seguro de ficheros en bucket privado con cuarentena AV. | `src/app/api/jobs/` | **Backlog** |
| **F2** | Canal de denuncias dinámico | Endpoint seguro con cifrado a nivel de fila y aislamiento de datos de DPO. | `src/app/api/complaints/` | **Backlog** |
| **SEC1** | Cabeceras dinámicas y Rate Limit | Configuración de WAF/CDN corporativo o servidor activo (Node/Vercel). | `src/middleware.ts` | **Backlog** |

---

## 3. Comandos de Validación Activos

Todos los comandos de comprobación del sitio estático actual se ejecutan con Node 22 + pnpm 10:

```bash
pnpm lint             # Análisis estático de código (ESLint)
pnpm typecheck        # Compilación estricta de TypeScript
pnpm test             # Pruebas unitarias de Vitest
pnpm build            # Generación de la build de Next.js y post-procesamiento de lang HTML
pnpm content:validate # Validador del esquema JSON de contenidos y dependencias de assets
pnpm export:validate  # Auditoría SEO y rastreador de enlaces del export estático (out/)
pnpm e2e:validate     # Verificador de accesibilidad (axe/a11y) y smoke tests en out/
pnpm check            # Secuencia completa de validaciones antes de push/merge
```
