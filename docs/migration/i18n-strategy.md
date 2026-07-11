# Estrategia i18n

Locales: `es`, `ca`, `eu`, `gl`, `pt`, `en`, `fr`, `de`. ES sin prefijo; resto con prefijo. Una `page` estable enlaza traducciones y slugs localizados por `(locale, localized_path)`.

## Workflow

Estados: `missing → machine_draft → in_review → approved → published`; despublicar vuelve a `approved`. Solo roles autorizados avanzan estados. ES/EN importados usan `translator_type=migration`; EN queda `in_review` por defecto. Seis idiomas generados desde ES quedan `machine_draft`. Nunca publicación conjunta o automática.

Cambiar ES incrementa `pages.source_revision`. Traducciones con revisión menor quedan `stale` derivado, sin alterar contenido ni estado y sin sobrescribir aprobadas. Regenerar crea revisión inmutable nueva. Cada registro guarda locale, estado, source_locale/revision, timestamps, translator_type y content; toda edición/aprobación/publicación genera auditoría.

`TranslationProvider` recibe esquema de bloque, ES, glosario y contexto; OpenAI es primer adaptador. Debe devolver JSON validable, preservar marcas/IDs/direcciones/emails y registrar proveedor/modelo, entrada hash, salida, intentos y error sanitizado. Glosario aprobado prevalece; conflicto bloquea aprobación.

## Resolución y fallback

- URL publicada: render + canonical propia + alternates solo publicados.
- Traducción no publicada o inexistente: 307 a ES equivalente, sin página indexable. Selector la deshabilita y explica estado.
- Preview autenticado: contenido concreto con `noindex,nofollow`, sin sitemap.
- Si ES no está publicada: 404; nunca fallback circular.
- `x-default` apunta a ES publicada. Slug cambia mediante redirect 301 desde el anterior.

Panel: matriz página × locale, filtros, stale, comparación fuente/destino, edición, glosario, slug, preview, aprobar/publicar/despublicar. Legales, denuncias, casos, datos corporativos y los seis idiomas requieren revisión humana.

