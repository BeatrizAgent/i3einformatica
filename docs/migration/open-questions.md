# Preguntas y decisiones abiertas

| ID | Decisión | Propietario requerido | Bloquea |
|---|---|---|---|
| O1 | ¿Eliminar, 301 a `/sobre-nosotros/` o migrar `/sobre-nosotros-pruebas/`? | Contenido/SEO | import final, redirects |
| O2 | ¿Teléfono oficial por contexto: `934 58 80 23` o `900 923 330`? | Negocio | settings/footer/contacto |
| O3 | ¿Derechos, originales y permiso de logos/partners/clientes? | Legal/marketing | import/publicación assets |
| O4 | ¿Inglés actual está completo y quién lo aprueba? | Contenido | estado EN `approved` |
| O5 | ¿Slugs definitivos para ca/eu/gl/pt/fr/de y quién revisa cada idioma? | Localización | publicación/SEO nuevos locales |
| O6 | ¿IdP OIDC, grupos/roles y política de sesión/MFA? | IT/seguridad | admin producción |
| O7 | ¿Proveedor/región/bucket S3 y KMS? | Infra/seguridad | medios/uploads |
| O8 | ¿SMTP, remitentes, destinatarios y política de rebotes? | IT/negocio | notificaciones forms |
| O9 | ¿Plazos de retención, base legal, cifrado, responsables y legal hold para contacto/CV/denuncias? | DPO/jurídico | forms producción |
| O10 | ¿Tipos/tamaños de adjunto y motor antimalware/SLA de cuarentena? | Seguridad | empleo/denuncias |
| O11 | ¿Textos legales y consentimientos son vigentes en ocho idiomas? | Jurídico/DPO | publicación legal/forms |
| O12 | ¿Plataforma final, dominio preview, CDN/WAF, backups y ventana rollback? | Infra | despliegue/corte |
| O13 | ¿Herramienta analítica, eventos y CMP? | Marketing/DPO | analytics/consentimiento |
| O14 | ¿Contenido de casos/datos corporativos puede publicarse sin cambios? | Marketing/legal | casos/home |
| O15 | ¿Política de trailing slash y redirects históricos fuera del sitemap? | SEO | mapa definitivo |

Defaults hasta resolver: `about_test` excluida; EN `in_review`; seis idiomas `machine_draft`; adjuntos privados/cuarentena; notificaciones sin adjunto; ninguna analítica antes de consentimiento; ninguna traducción nueva publicada automáticamente.
