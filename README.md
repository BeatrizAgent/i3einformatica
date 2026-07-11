# i3e Informática

Migración de la web corporativa a Next.js 16, PostgreSQL y Drizzle. Contenido editorial, traducciones, navegación y SEO viven en PostgreSQL; los JSON de auditoría solo son artefactos de importación.

## Requisitos

- Node.js 22
- pnpm 10+
- Docker Desktop o PostgreSQL 17 compatible

## Desarrollo local

```powershell
Copy-Item .env.example .env.local
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

- Web: http://localhost:3000
- Admin: http://localhost:3000/admin
- MinIO: http://localhost:9001
- Mailpit: http://localhost:8025

Sin OIDC configurado, el panel muestra la configuración pendiente y las mutaciones permanecen bloqueadas. No añadas un bypass de producción.

## Auditoría e importación

```powershell
pnpm audit
pnpm content:import
```

`pnpm audit` vuelve a rastrear sitemap, páginas, metadata, imágenes y formularios de la web WordPress. `pnpm content:import` importa el snapshot de forma idempotente; no publica borradores automáticos.

## Assets locales

```powershell
pnpm assets:sync
```

Descarga recursos visuales de `www.i3einformatica.com` y su sitemap, incluyendo variantes responsive, iconos, SVG de servicios/certificaciones y favicons. Convierte raster a WebP, limita dimensiones a 1800 px y escribe `public/assets/i3e/manifest.json` con URL original, hashes y tamaños. Recursos inaccesibles se registran como `SKIP` sin bloquear el resto del lote.

## Validación

```powershell
pnpm check
```

El comando ejecuta ESLint, TypeScript, Vitest y build standalone. Para comprobar migraciones desde cero, elimina solo el volumen local de desarrollo y repite `db:migrate` + `db:seed`.

## Producción

Construcción portable:

```powershell
docker build -t i3e-web .
docker run --env-file .env.production -p 3000:3000 i3e-web
```

Producción necesita PostgreSQL, OIDC, S3 privado, SMTP, ClamAV y secretos de cron. Traducción automática necesita `OPENAI_API_KEY`; el modelo puede cambiarse con `OPENAI_TRANSLATION_MODEL`.

`TRUST_PROXY_HEADERS=true` presupone que proxy/CDN elimina cabeceras IP aportadas por cliente y escribe su propia IP verificada. No expongas directamente el servidor Node con esa opción activa.

Consulta `docs/migration/implementation-plan.md` y `docs/migration/open-questions.md` antes del corte DNS.
