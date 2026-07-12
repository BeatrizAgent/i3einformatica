# i3e Informática

Web corporativa estática. Next.js genera HTML/CSS/JS desde JSON local; no hay PostgreSQL, API, autenticación ni panel editorial en este corte.

## Requisitos

- Node.js 22
- pnpm 10+

## Desarrollo

```powershell
pnpm install
pnpm dev
```

Contenido editorial vive en `data/content/pages/*.json`. Assets optimizados viven en `public/assets/i3e/`.

## Validación

```powershell
pnpm content:validate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm build` crea `out/` mediante `output: "export"`.

## GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` publica `out/` con GitHub Pages. Para un repo de proyecto usa:

```yaml
NEXT_PUBLIC_BASE_PATH: /i3einformatica
```

Para dominio propio, deja `NEXT_PUBLIC_BASE_PATH` vacío y añade `public/CNAME`.

Los formularios muestran contacto por correo porque GitHub Pages no ejecuta backend. La persistencia y edición de contenido se podrán añadir después con un servicio externo.
