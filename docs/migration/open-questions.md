# Preguntas y decisiones abiertas

## Estado del corte estático — 12/07/2026

Se ha fijado el límite técnico del corte: ES/EN son las únicas rutas generadas, los formularios no persisten datos, el canal de denuncias no recoge contenido y no se carga analítica sin consentimiento. Aviso legal, privacidad y cookies ya contienen el material normalizado de las fuentes públicas, pero permanecen `in_review` hasta aprobación jurídica. No se inventan decisiones de negocio o legales para cerrar esta puerta.

| Tema | Decisión técnica provisional | Evidencia | Pendiente humano |
|---|---|---|---|
| Teléfono | Mantener `934 588 023` en datos corporativos legales y `900 923 330` como contacto público hasta confirmación | Aviso legal y pie público recuperados el 12/07/2026 | O2: negocio debe elegir un número oficial |
| Formularios | Export estático abre correo para contacto/empleo; no procesa CV ni denuncias | `src/components/submission-form.tsx` | O8–O10: proveedor, retención, antimalware y destinatarios |
| Denuncias | Sin formulario activo; alternativa postal explícita; no promesa de anonimato | `data/content/pages/complaints.json` | O9–O10: endpoint seguro aprobado |
| Cookies | Solo `localStorage` para preferencias; no analítica ni terceros en runtime | `src/components/cookie-banner.tsx` y política de cookies | O13: CMP/analítica futura, si procede |
| Publicación legal | Contenido queda `in_review`; CI bloquea `published` con dependencias pendientes | `scripts/validate-content.ts` | O11: aprobación jurídica/DPO |

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
