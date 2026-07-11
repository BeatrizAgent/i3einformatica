# Mapa del sitio y redirects

Fuente: sitemap vivo, 2026-07-10. Todas respondieron 200. `page_key` propuesto conserva identidad entre idiomas. Rutas actuales deben conservarse o redirigirse uno-a-uno; rutas ES/EN coincidentes pueden permanecer.

| page_key | ES | EN | Estado |
|---|---|---|---|
| home | `/` | `/en/` | pareja |
| cookie_policy | `/politica-de-cookies/` | `/en/cookie-policy/` | pareja |
| legal_notice | `/aviso-legal/` | `/en/legal-notice/` | pareja |
| privacy_policy | `/politica-de-privacidad/` | `/en/privacy-policy/` | pareja |
| success_stories | `/casos-de-exito/` | `/en/success-stories/` | pareja |
| complaints | `/denuncias/` | `/en/complaints/` | pareja/formulario |
| about | `/sobre-nosotros/` | `/en/about-us/` | pareja |
| cybersecurity | `/ciberseguridad/` | `/en/cybersecurity/` | pareja |
| infrastructure | `/infraestructuras-it/` | `/en/it-infrastructure/` | pareja |
| microsoft_365 | `/microsoft-365/` | `/en/microsoft-365/` | pareja |
| microsoft_365_products | `/microsoft-365/producto/` | `/en/microsoft-365/microsoft-365-products/` | pareja |
| microsoft_365_solutions | `/microsoft-365/soluciones/` | `/en/microsoft-365/microsoft-365-solutions/` | pareja |
| compliance | `/compliance-y-certificaciones/` | `/en/compliance-and-certifications/` | pareja |
| careers | `/unete-al-equipo/` | `/en/join-the-team/` | pareja/formulario |
| azure | `/microsoft-azure/` | `/en/microsoft-azure/` | pareja |
| contact | `/contacto/` | `/en/contact/` | pareja/formulario |
| about_test | `/sobre-nosotros-pruebas/` | — | staging; decisión humana |

Total: 17 ES + 16 EN = 33. Nuevos locales: `/ca/`, `/eu/`, `/gl/`, `/pt/`, `/fr/`, `/de/`; slugs localizados se fijarán durante revisión. `/admin`, `/api`, preview, metadata, sitemap y robots quedan reservados y nunca se resuelven como páginas editoriales.

## Política de redirect

- Guardar origen normalizado único, destino interno, código y activación. Evitar cadenas y bucles.
- Conservar URL actual cuando sea la canonical nueva. Si cambia, 301 exacto a traducción equivalente.
- Acceso a traducción existente pero no publicada: 307 a ES equivalente; selector la muestra no disponible. Preview autenticado: 200 + `noindex`.
- `about_test` queda excluida de importación y sitemap hasta decisión explícita.

