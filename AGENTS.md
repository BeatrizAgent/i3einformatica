# Agent Instructions — i3e Informática

Guidelines for AI agents working on this repository.

## Project overview

- **Framework:** Next.js 16.2.10 + React 19.2.4 + TypeScript 5.
- **Styling:** Tailwind CSS 4 + custom CSS in `src/app/globals.css`.
- **Content:** Local JSON snapshots under `data/content/pages/`; no backend in this deployment.
- **Testing:** Vitest 4 (unit tests, no E2E yet).
- **Package manager:** pnpm 10+.
- **Runtime:** Node.js 22.

## Critical conventions

- **This is NOT stock Next.js.** Read `node_modules/next/dist/docs/` before using any Next.js API. Conventions and file structure may differ from older versions.
- **App Router.** All routes live under `src/app/`.
- **i18n:** Supported locales are `es`, `ca`, `eu`, `gl`, `pt`, `en`, `fr`, `de`. Default locale is `es`.
-  - Static export publishes Spanish and English routes from `src/app/[[...segments]]/page.tsx`.
- **Content source of truth:** `data/content/pages/` JSON documents and `data/content/assets.json`.
- **Migration artifacts:** `data/migration/` and `docs/migration/` are reference material and planning documents, not production content.
- **Output:** `next.config.ts` uses `output: "export"` for GitHub Pages.

## Directory map

| Path | Purpose |
|---|---|
| `src/app/` | Next.js routes and root layout. |
| `src/components/` | React components for public pages and shell. |
| `src/lib/` | JSON content, static route helpers, assets, i18n copy, and UI data. |
| `scripts/` | TypeScript CLI tooling for auditing, validating content, and asset syncing. |
| `public/assets/i3e/` | Optimized static assets (images, SVGs, fonts). |
| `data/content/pages/` | Curated page JSON snapshots. |
| `data/migration/` | Migration reference JSONs. |
| `docs/migration/` | Planning and audit markdown documents. |

## Common commands

```powershell
pnpm dev              # start development server
pnpm build            # production build
pnpm lint             # ESLint
pnpm typecheck        # TypeScript --noEmit
pnpm test             # Vitest
pnpm check            # lint + typecheck + test + build
pnpm assets:sync      # download and optimize remote assets
pnpm audit            # audit original WordPress site
pnpm content:validate # validate JSON content, actions, and assets
```

## Code style

- Strict TypeScript is enabled.
- ESLint runs with `no-unused-vars` via `@typescript-eslint/no-unused-vars`. Prefix unused bindings with `_` to ignore them.
- Prefer Server Components; mark Client Components with `"use client"`.
- Keep editorial changes in JSON; validate them with `pnpm content:validate`.

## Design system

- See `DESIGN.md` for full tokens and principles.
- **Fonts:** Space Grotesk (titles, `--font-title`) and Manrope (body, `--font-body`).
- **Key colors:** surface `#f9f9fb`, nav-dark `#0B113E`, action-blue `#21CFF1`.

## Documentation

- `README.md` — Visión general, capturas, roadmap y comandos
- `CONTRIBUTING.md` — Guía para contribuidores
- `DESIGN.md` — Sistema de diseño y tokens
- `LICENSE` — Licencia Apache 2.0
- `docs/screenshots/` — Capturas del sitio para documentación
- `docs/migration/` — Documentación de migración (referencia)

## Agent constraints

- DO NOT commit `node_modules`, `.next`, `out`, `output`, `.codegraph`, `.playwright-cli`, or `.opencode/node_modules`.
- DO NOT add production bypasses for authentication.
- DO NOT expose `TRUST_PROXY_HEADERS=true` directly to the public internet.
- DO keep this file updated when project conventions change.
