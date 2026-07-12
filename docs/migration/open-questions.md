# Preguntas y decisiones resueltas — Corte Estático (12/07/2026)

Este documento registra las decisiones tomadas y las resoluciones aplicadas para el corte estático del proyecto.

---

## 1. Decisiones Registradas y Resueltas

| ID | Decisión / Tema | Resolución Aplicada | Propietario / Fecha |
|---|---|---|---|
| **O2** | Teléfono oficial de contacto | Se mantiene `900 923 330` como teléfono público de contacto (gratuito) visible en el footer y `934 588 023` en los datos legales del aviso legal. | Negocio / 12-Jul-2026 |
| **O5** | Alcance de locales | **Opción 2:** Se declara ES/EN como alcance oficial de este despliegue. Los otros 6 locales se retiran del array activo para evitar rutas vacías o traducciones automáticas no supervisadas. | Localización / 12-Jul-2026 |
| **O9** | Flujo de Formularios | Se implementan avisos informativos honestos de fallback (abriendo cliente de correo nativo) y se documenta la política de seguridad/privacidad en `forms_decision.md`. | DPO / Jurídico / 12-Jul-2026 |
| **O11** | Publicación legal | Se publican Aviso legal, Política de cookies, Política de privacidad y el Canal de denuncias estático tras normalizar su contenido con la realidad del sitio estático. | Jurídico / 12-Jul-2026 |
| **O14** | Casos de éxito (Claims) | Se adapta el componente `ProofGrid` para renderizar un aviso de validación editorial y legal en lugar de ocultar la sección o inventar testimonios sin aprobar. | Marketing / 12-Jul-2026 |

---

## 2. Backlog de Preguntas para Futura Evolución Dinámica

Las siguientes preguntas quedan aplazadas hasta que se decida migrar de una arquitectura estática (GitHub Pages) a una arquitectura dinámica con servidor y base de datos:

*   **O6 (IdP OIDC):** Configuración de proveedores de identidad para el panel de administración dinámico.
*   **O7 (S3 Bucket):** Aprovisionamiento de almacenamiento de objetos para subida de CVs.
*   **O8 (SMTP):** Proveedores de envío de correos electrónicos transaccionales desde el backend.
*   **O10 (Antimalware):** Motor de análisis de ficheros subidos.
*   **O12 (Infraestructura Dinámica):** Dominio de previsualización activa y configuraciones de WAF/CDN.
