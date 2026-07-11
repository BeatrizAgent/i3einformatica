# Auditoría de migración

Snapshot: 2026-07-10. Fuente: `https://www.i3einformatica.com/page-sitemap.xml` y HTML público. Artefacto reproducible: `data/audit/site-audit.json`; copia del sitemap: `data/audit/page-sitemap.xml`.

## Método y cobertura

`pnpm exec tsx scripts/audit-site.ts` descarga sitemap y las 33 URLs, sigue redirecciones y registra estado, URL final, título, descripción, canonical, robots, Open Graph, alternates, headings, enlaces, imágenes, documentos, formularios, texto visible, cabeceras y SHA-256 del HTML. Descarga además las 34 imágenes declaradas, registrando estado, MIME, bytes, dimensiones cuando son deducibles, SHA-256 y páginas usuarias. El snapshot es evidencia intermedia; PostgreSQL será fuente de verdad tras importar.

Resultado: 33/33 páginas respondieron 200; 17 ES y 16 EN; 16 parejas estables; 34 imágenes únicas en sitemap, 48 URLs de imagen vistas en HTML, seis formularios (tres tipos × dos idiomas), cero documentos PDF/DOC/XLS/PPT/ZIP enlazados.

## Hallazgos

| Severidad | Hallazgo | Acción |
|---|---|---|
| Alta | Formularios de empleo y denuncias admiten archivos y datos sensibles. | S3 privado, análisis antimalware, autorización, retención y auditoría antes de producción. |
| Alta | Respuestas inspeccionadas no incluyen CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy ni Permissions-Policy. | Definir cabeceras en app/proxy y probarlas. |
| Alta | `/sobre-nosotros-pruebas/` está indexada, sin EN y sin meta description. | Decidir eliminar, redirigir o migrar; no importarla por defecto. |
| Media | Solo ES/EN existen. Seis idiomas nuevos requieren traducción y aprobación humana. | Crear como `machine_draft`; excluir del índice. |
| Media | Teléfono de contacto observado difiere del footer (`934 58 80 23` frente a `900 923 330`). | Validación corporativa. |
| Media | Inglés existente no acredita revisión humana ni equivalencia completa. | Revisión editorial antes de marcar `approved`. |
| Media | Stack legado detectado en markup/headers: WordPress, WPML, Elementor, WP Rocket. | Migrar contenido y patrones, no HTML generado. |
| Baja | Metadatos y alternates ES/EN están presentes en sitemap; staging carece de pareja. | Reconstruir desde traducciones `published`. |

## Limitaciones

Auditoría HTTP no prueba destinatarios de email, almacenamiento interno, licencias, originales multimedia, configuración WordPress, analítica tras consentimiento ni comportamiento real de envío. Texto dinámico posterior a JS o protegido por interacción puede no aparecer. No se enviaron formularios. No se descargaron recursos fuera de imágenes declaradas. Datos legales, casos, partners y traducciones requieren propietario humano.

