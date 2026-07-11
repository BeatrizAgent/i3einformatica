# Contenido curado v2

`pages/*.json` es la fuente editorial por página para las plantillas internas.

Cada documento contiene:

- `family` y `templateVariant`: composición visual permitida.
- `locales.es` y `locales.en`: SEO, hero, bloques y CTA localizado.
- `assetId`: nunca se guarda una ruta de asset dentro del copy.
- `editorialStatus`: `in_review`, `approved` o `published`.
- `approvalStatus`, `sourceNote` y `verifiedAt` para claims, métricas y casos.

El catálogo técnico está en `assets.json`. El snapshot original sigue en `data/audit/site-audit.json` y no se modifica.

Validación local:

```powershell
pnpm content:validate
pnpm content:import-curated
```

El importador solo escribe en PostgreSQL cuando se ejecuta con `--apply`.
