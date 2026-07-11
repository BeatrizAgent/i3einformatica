# Referencias de migración

Estos JSON convierten auditoría de la web original en contratos reutilizables.

La capa editorial curada v2 vive en `data/content/pages/`. Estos artefactos de migración permanecen como referencia global, evidencia y reglas de importación; no son el lugar para mantener el copy final de cada página.

- `components.json`: datos, presentación, accesibilidad y decisión de migración por bloque.
- `page-blueprints.json`: plantilla de cada familia de rutas.
- `content-contract.json`: contenido mínimo, entidades compartidas y schemas de formularios.
- `assets.json`: recursos locales por rol semántico. `public/assets/i3e/manifest.json` sigue siendo índice técnico completo.
- `ux-findings.json`: deuda UX priorizada que no debe copiarse desde WordPress.

Validar sintaxis después de editar:

```powershell
Get-ChildItem data/migration -Filter *.json | ForEach-Object { Get-Content -Raw $_ | ConvertFrom-Json | Out-Null }
```

Datos de negocio, teléfonos, derechos de logos y textos legales siguen bloqueados por `docs/migration/open-questions.md`.
