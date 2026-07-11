# Revisión de seguridad y privacidad

## Hallazgos y controles

| Área | Riesgo | Control requerido |
|---|---|---|
| Headers | Seis cabeceras defensivas ausentes en muestra | CSP con nonce, HSTS tras HTTPS estable, frame-ancestors, nosniff, referrer/permissions policies; test integración. |
| Admin | Edición/publicación privilegiada | OIDC Authorization Code + PKCE, allowlist issuer/audience, sesión server-side rotada, RBAC admin/editor/reviewer, reautenticación sensible. |
| Forms | spam, CSRF, inyección, PII | Zod server-side, Origin/CSRF, honeypot, rate limit distribuido en PostgreSQL/proxy, límites, sanitización, mensajes genéricos. |
| Uploads | malware, polyglots, exposición | MIME real + extensión allowlist, tamaño, nombre aleatorio, bucket privado, cuarentena, AV, descarga autorizada, `Content-Disposition: attachment`. |
| Denuncias | datos especialmente sensibles | Tabla/bucket/política separados, acceso mínimo, auditoría de lectura, cifrado, legal hold y borrado aprobados por DPO. |
| Jobs/cron | ejecución no autorizada/replay | secreto rotatorio o identidad workload, firma/timestamp, claim transaccional, logs sin prompts/PII. |
| Logs | fuga de secretos/PII | redacción estructurada; no cuerpo, CV, denuncia, token, cookie ni URL firmada. |
| Dependencies | supply chain | lockfile, CI audit, actualización controlada, imagen mínima no-root, SBOM/scan. |

Cookies `Secure`, `HttpOnly`, `SameSite=Lax/Strict`, expiración/revocación; protección contra session fixation. S3 usa mínimo privilegio y URLs cortas. SMTP notifica identificador y enlace admin, nunca adjunto ni texto sensible. Backups cifrados y restauración probada.

Retención no puede inventarse: confirmar plazos por formulario, base legal, responsables, exportación/borrado, incidente y proveedores. Hasta aprobación, producción de denuncias queda bloqueada. Pruebas: CSRF/origin, rate limit, XSS, SQLi, upload EICAR/polyglot, IDOR, RBAC, sesión expirada/revocada, cabeceras y logs sin PII.

