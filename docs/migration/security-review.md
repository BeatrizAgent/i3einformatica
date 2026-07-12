# Revisión de seguridad y privacidad — Corte Estático vs Backlog Futuro

Dado que el sitio web actual se despliega como un sitio **100% estático (HTML pre-renderizado)** en GitHub Pages sin base de datos ni runtime de servidor activo, los controles de seguridad se dividen en los aplicables al corte estático actual y los previstos en el backlog futuro.

---

## 1. Controles de Seguridad Activos (Sitio Estático)

| Área | Riesgo | Control Implementado |
|---|---|---|
| **Almacenamiento Local** | Fuga de datos de usuario en Cookies | El Consentimiento de Cookies (CMP) se almacena localmente en `localStorage` con la clave `i3e-cookie-consent`. No se cargan cookies de terceros ni scripts de analítica antes o después del consentimiento. |
| **Formularios** | Exposición de PII o spam en formularios de contacto | Los formularios de envío en el corte estático no procesan ni envían datos sensibles en segundo plano; actúan como avisos informativos y abren el cliente de correo del usuario (mailto) o redirigen a alternativas seguras documentadas en [forms_decision.md](file:///C:/Users/elyam/.gemini/antigravity/brain/4b94fe15-03ca-460c-bdbd-553ca06cc4a1/forms_decision.md). |
| **Dependencies** | Vulnerabilidades en la cadena de suministro | Uso de `pnpm-lock.yaml` para asegurar la reproducibilidad del entorno de build y verificación en CI de la integridad de los paquetes (`pnpm install --frozen-lockfile`). |
| **Privacidad** | Fuga accidental de datos personales en el código fuente | El repositorio de datos usa exclusivamente JSONs limpios en `data/content/pages/` y archivos estáticos validados. |

---

## 2. Controles de Seguridad en Backlog (Requiere Backend / Hosting Activo)

Estos controles quedan documentados como requisitos mandatorios antes de introducir cualquier base de datos, panel de administración dinámico o procesamiento de formularios en el backend:

*   **Autenticación de Administradores:** Implementación obligatoria de OIDC (Authorization Code con PKCE) con rotación de sesiones y MFA para el panel dinámico.
*   **Seguridad de Uploads (CVs):** Escaneo de malware en tiempo real (AV), aislamiento en buckets privados bajo cuarentena, y almacenamiento inaccesible públicamente.
*   **Canal de Denuncias Dinámico:** Cifrado a nivel de fila mediante claves controladas y acceso exclusivo para el DPO/Comité ético, con retención de logs auditada.
*   **Cabeceras de Seguridad CSP/HSTS:** Estas cabeceras dinámicas defensivas deberán configurarse a nivel de servidor web (por ejemplo, Cloudflare, Vercel, o proxy inverso) en lugar de depender del build estático de GitHub Pages.
