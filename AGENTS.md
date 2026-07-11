# Agent Instructions — i3e Informática

Guidelines for AI agents working on this repository.

## Project overview

- **Framework:** Next.js 16.2.10 + React 19.2.4 + TypeScript 5.
- **Styling:** Tailwind CSS 4 + custom CSS in `src/app/globals.css`.
- **Database:** PostgreSQL 17 + Drizzle ORM.
- **Testing:** Vitest 4 (unit tests, no E2E yet).
- **Package manager:** pnpm 10+.
- **Runtime:** Node.js 22.

## Critical conventions

- **This is NOT stock Next.js.** Read `node_modules/next/dist/docs/` before using any Next.js API. Conventions and file structure may differ from older versions.
- **App Router.** All routes live under `src/app/`.
- **i18n:** Supported locales are `es`, `ca`, `eu`, `gl`, `pt`, `en`, `fr`, `de`. Default locale is `es`.
  - Locale negotiation happens in `src/proxy.ts` (Next.js 16 `proxy` convention, formerly `middleware`), which injects the `x-i3e-locale` request header.
  - The root layout reads that header to set `<html lang>`.
- **Content source of truth:** PostgreSQL. `data/content/pages/` holds curated JSON snapshots used by import scripts and tests.
- **Migration artifacts:** `data/migration/` and `docs/migration/` are reference material and planning documents, not production content.
- **Output:** `next.config.ts` uses `output: "standalone"` for containerized deployments.

## Directory map

| Path | Purpose |
|---|---|
| `src/app/` | Next.js routes and root layout. |
| `src/components/` | React components (public pages, admin, shell). |
| `src/lib/` | Business logic: auth, content, forms, i18n, mail, security, storage, translation. |
| `src/db/` | Drizzle schema, relations, migrations, and connection helpers. |
| `scripts/` | TypeScript CLI tooling for auditing, importing, seeding, and asset syncing. |
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
pnpm db:migrate       # run database migrations
pnpm db:seed          # seed local development data
pnpm assets:sync      # download and optimize remote assets
pnpm audit            # audit original WordPress site
pnpm content:import   # import content snapshot idempotently
```

## Code style

- Strict TypeScript is enabled.
- ESLint runs with `no-unused-vars` via `@typescript-eslint/no-unused-vars`. Prefix unused bindings with `_` to ignore them.
- Prefer Server Components; mark Client Components with `"use client"`.
- Use `server-only` for modules that must never run in the browser.
- Validate inputs with Zod.
- Use `drizzle-orm` for all database access.

## Design system

- See `DESIGN.md` for full tokens and principles.
- **Fonts:** Space Grotesk (titles, `--font-title`) and Manrope (body, `--font-body`).
- **Key colors:** surface `#f9f9fb`, nav-dark `#0B113E`, action-blue `#21CFF1`.

## Agent constraints

- DO NOT commit `node_modules`, `.next`, `out`, `output`, `.codegraph`, `.playwright-cli`, or `.opencode/node_modules`.
- DO NOT add production bypasses for authentication.
- DO NOT expose `TRUST_PROXY_HEADERS=true` directly to the public internet.
- DO keep this file updated when project conventions change.
