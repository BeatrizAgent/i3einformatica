# Plan de implementación verificable

Orden: auditoría → scaffold → DB/import → público → admin/i18n → forms/security → SEO → corte. Sin estimaciones horarias. Estado inicial de todas las tareas: `pending`, salvo A1 completada por snapshot.

## Tareas

| ID | Objetivo | Entradas | Archivos previstos | Resultado | Validación | Dependencias | Estado |
|---|---|---|---|---|---|---|---|
| A1 | Snapshot reproducible | sitemap/web viva | `scripts/audit-site.ts`, `data/audit/*`, estos docs | 33 páginas/34 assets inventariados | ejecutar script; reconciliar conteos/hash | — | completed |
| A2 | Cerrar decisiones editoriales | inventarios/open questions | docs + acta externa | staging, teléfonos, legales, licencias decididos | aprobaciones con propietario/fecha | A1 | pending |
| S1 | Scaffold Next 16 TS estricto | contrato técnico | app/config/CI/Docker | standalone conectado a PostgreSQL | lint, typecheck, test, build, health DB | A1 | pending |
| S2 | Indexar arquitectura | scaffold | `.codegraph/` | índice saludable | `codegraph status` | S1 | pending |
| D1 | Crear schema/migraciones | database-design | schema + migrations | tablas/enums/constraints | migrar ida/vuelta en DB efímera | S1,A2 parcial | pending |
| D2 | Seed e importador idempotente | audit JSON, assets | seed/import scripts | ES/EN y medios importados; staging excluido | ejecutar dos veces, comparar estado | D1,A2 licencias | pending |
| P1 | Sistema visual y bloques | original + componentes | UI/tokens/blocks | header/footer/heroes/cards/grids/métricas/logos/casos/CTA/forms | Storybook/test visual/a11y | S1,A1 | pending |
| P2 | Resolver rutas/locales | DB publicada | catch-all/metadata helpers | 16 pares renderizados y fallback seguro | integración por locale/path | D2,P1 | pending |
| I1 | Workflow editorial | i18n strategy | admin/actions/services | matriz, editor, preview, estados, stale e historial | E2E RBAC y transiciones | D1,P2 | pending |
| I2 | Proveedor y cola | glosario, OpenAI | provider/jobs/worker route | seis locales como machine_draft, reintentos | contrato mock, claim concurrente, no autopublish | I1 | pending |
| F1 | Contacto y empleo | campos auditados | routes/forms/storage/mail | envíos persistidos y notificados | E2E válido/inválido/upload | D1,P1,A2 | pending |
| F2 | Canal denuncias | decisión DPO | route/form/policies | flujo sensible aislado | seguridad/IDOR/retención/AV | D1,P1,A2 | pending |
| SEC1 | Endurecer plataforma | security review | headers/middleware/deploy | CSP/HSTS/RBAC/rate limit/log redaction | suite seguridad + scan | S1,F1,F2 | pending |
| SEO1 | Metadata/sitemap/redirects | SEO map, published DB | metadata/sitemap/robots | canonical/hreflang/JSON-LD/redirects correctos | crawler SEO automático | P2,D2,A2 | pending |
| Q1 | Validación integral | todas funciones | tests/reports | paridad 16 ES/EN; idiomas aprobados seleccionados | unit/DB/integration/E2E/axe/Lighthouse/visual | anteriores | pending |
| R1 | Preview y corte reversible | build validado, infra | deploy/runbook | preview aprobado, backup y rollback | smoke preview; restauración ensayada | Q1 | pending |
| R2 | Producción y monitorización | aprobación humana | plataforma final | tráfico nuevo; WordPress en ventana rollback | smoke vivo, 404/5xx/SEO/forms | R1 | pending |

## Hitos y puertas

1. **Discovery**: A1/A2. Puerta: 33/34 reconciliados, incertidumbres asignadas.
2. **Foundation**: S1/S2/D1/D2. Puerta: PostgreSQL real, migración/seed idempotentes, build verde.
3. **Experience**: P1/P2. Puerta: 16 entidades ES/EN, móvil/escritorio, selector/fallback.
4. **Editorial**: I1/I2. Puerta: estados independientes, stale, historial; cero autopublicación.
5. **Trust**: F1/F2/SEC1/SEO1. Puerta: revisión DPO, suite seguridad y crawler verde.
6. **Release**: Q1/R1/R2. Puerta: aceptación humana, rollback probado, smoke vivo.

Paralelo: A2 puede avanzar con S1; D1 y P1; traducciones por locale tras I2; pruebas visual/a11y/SEO tras estabilizar P1/P2. Revisión humana obligatoria: staging, teléfonos, derechos, inglés, cada idioma nuevo, legales/consentimientos, denuncias, casos/datos corporativos, IdP/S3/SMTP/analytics/plataforma y corte DNS.

Pruebas requeridas: unit locale/parser/workflow/schema; DB constraints/migrations/concurrencia/idempotencia; integración rutas/fallback/jobs/RBAC/uploads/redirects; E2E selector/preview/forms/workflow; SEO; axe/teclado; Lighthouse móvil LCP <2.5 s, INP <200 ms, CLS <0.1; seguridad; comparación visual desktop/móvil. Riesgos: contenido incompleto, licencia, traducción legal, PII, entrega SMTP, lock de proveedor, SEO/redirects y rollback DB.

