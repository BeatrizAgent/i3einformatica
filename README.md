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
pnpm encoding:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm export:validate
```

`pnpm build` crea `out/` mediante `output: "export"`.

## GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` publica `out/` con GitHub Pages. Para un repo de proyecto usa:

```yaml
NEXT_PUBLIC_BASE_PATH: /i3einformatica
```

Para dominio propio, deja `NEXT_PUBLIC_BASE_PATH` vacío y añade `public/CNAME`.

Los formularios de contacto y empleo abren el cliente de correo porque GitHub Pages no ejecuta backend. El canal de denuncias no recoge contenido ni promete anonimato: muestra una alternativa postal hasta aprobar infraestructura segura. La persistencia y edición de contenido se podrán añadir después con un servicio externo.
