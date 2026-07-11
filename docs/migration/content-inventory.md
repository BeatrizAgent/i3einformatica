# Inventario de contenido

Fuente completa sin reinterpretación: campos `pages[].visibleText`, headings, SEO, alternates y enlaces en `data/audit/site-audit.json`. Importador debe segmentar ese snapshot por secciones tras revisión, no re-scrapear silenciosamente.

| Entidad | ES H1 | EN H1 | Plantilla |
|---|---|---|---|
| home | Impulsamos tu organización | Powering your organization | landing corporativa |
| microsoft_365 | Microsoft 365 | Microsoft 365 | servicio |
| microsoft_365_products | Microsoft 365 adaptado… | Microsoft 365 tailored… | servicio/cards |
| microsoft_365_solutions | Microsoft 365 con… | Microsoft 365 with… | servicio/cards |
| cybersecurity | Ciberseguridad | Cybersecurity | servicio/cards/casos |
| azure | Microsoft Azure | Microsoft Azure | servicio/cards |
| infrastructure | Infraestructuras IT | IT Infrastructure | servicio/cards |
| compliance | Compliance y certificaciones | Compliance and certifications | servicio/cards |
| success_stories | Casos de éxito | Success stories | casos |
| about | Impulsamos la tecnología… | Driving the technology… | empresa/métricas |
| careers | Únete al equipo | Join the team | formulario |
| contact | Contacto | Contact | formulario/ubicaciones |
| privacy_policy | Política de privacidad | Privacy Policy | legal |
| cookie_policy | Política de cookies | Cookie Policy | legal |
| legal_notice | Aviso legal | Legal Notice | legal |
| complaints | Buzón denuncias | Complaints mailbox | legal/formulario sensible |

`about_test`: H1 similar a empresa, sin descripción y sin EN; no importar hasta decisión. Las 32 páginas emparejadas tienen título y descripción según snapshot salvo esta anomalía.

## Formularios observados

- Contacto ES/EN: nombre y correo obligatorios; teléfono, mensaje y consentimiento. El markup legado incluye campos técnicos/honeypot.
- Empleo ES/EN: nombre, apellidos, correo y CV obligatorios; DNI/teléfono/mensaje/consentimiento. En EN, `dni` aparece con `type=email`, anomalía a corregir tras confirmar necesidad del campo.
- Denuncias ES/EN: identidad/contacto opcionales, modalidad de reporte y tipo obligatorios, observaciones y adjunto. Opciones ES/EN no son idénticas en cantidad: revisar semántica jurídica.

Marcas, certificaciones, direcciones, emails e identificadores legales no se traducen. Inglés migrado lleva `translator_type=migration`, pero su estado no supera `in_review` sin confirmación. Los seis idiomas nuevos nacen `machine_draft` desde ES.

