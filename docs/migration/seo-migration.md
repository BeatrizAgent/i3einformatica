# Migración SEO

Inventario base: 33 URLs indexadas, 32 en 16 pares ES/EN y un staging ES. Snapshot conserva title, description, canonical, robots, OG, headings y alternates.

## Contrato

- `generateMetadata` consulta solo traducción `published`: title, description, canonical absoluta, OG localizado y robots.
- Alternates recíprocos solo entre traducciones publicadas; `x-default` = ES. Borradores y preview: `noindex,nofollow`.
- Sitemap generado desde DB, separable por locale si volumen lo requiere; contiene canonical publicada y lastmod editorial. Robots enlaza índice de sitemap.
- JSON-LD localizado: Organization común; BreadcrumbList y WebPage/Service según plantilla. No inventar reviews, precios ni datos.
- Un H1, headings jerárquicos, alt localizado y enlaces internos a equivalente de locale.
- Redirect map prueba origen→destino final 200, sin cadena/bucle. Conservar todas las canonicals actuales cuando sea posible.

## Validación previa/post corte

Crawler compara 33 URLs: status, final URL, title/description, canonical, hreflang recíproco, H1, enlaces, imágenes y formularios. Validar ocho variantes publicadas, `x-default`, ausencia de drafts/staging, sitemap sin huérfanas, 404 reales, Open Graph y JSON-LD. Monitorizar 404, 5xx, cobertura e impresiones; WordPress queda accesible para rollback sin indexación duplicada.

Decisiones: destino de `/sobre-nosotros-pruebas/`; slugs nuevos aprobados por idioma; dominio preview; política de trailing slash; analítica y consentimiento.

