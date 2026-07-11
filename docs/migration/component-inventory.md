# Inventario de componentes

| Patrón | Variantes/uso | Comportamiento requerido |
|---|---|---|
| Header | Logo, navegación multinivel, CTA, idioma, menú móvil | Teclado, foco visible, `aria-expanded`, cierre Escape, ruta equivalente por idioma. |
| Footer | Navegación, contacto, legal, redes/partners | Orden responsive, enlaces traducidos, datos corporativos centralizados. |
| Hero | Título, lead, CTA, imagen/fondo | H1 único, imagen optimizada, overlay con contraste, sin CLS. |
| Breadcrumbs | Interiores y legales | `nav` etiquetado + BreadcrumbList localizado. |
| Rich text | Empresa, legales, servicios | HTML sanitizado, jerarquía de headings, listas y enlaces accesibles. |
| Card/grid | Servicios, Microsoft 365, soluciones | Bloques reutilizables, 1/2/3 columnas, tarjetas completas clicables sin enlaces anidados. |
| Métricas | Contadores corporativos | Valor legible sin animación; motion opcional con reduced-motion. |
| Logos | Partners/clientes | Grid/carrusel; alt significativo o vacío si decorativo; pausa controlable. |
| Casos | Logos, resumen, CTA | Lista y detalle embebido según contenido auditado; no inventar clientes. |
| CTA band | Título, texto, botón | Tema claro/oscuro, CTA localizado. |
| Ubicaciones/contacto | Dirección, teléfono, email/mapa | Datos estructurados, enlaces tel/mail, mapa no bloqueante. |
| Formularios | Contacto, empleo, denuncias | Labels persistentes, errores asociados, resumen, consentimientos, estados envío. |
| Cookie banner | Preferencias, aceptar/rechazar | Igual prominencia, bloqueo previo de analítica, reabrible. |

Tokens a derivar visualmente: tipografía, escala, colores, espaciado, radios, sombras, contenedores y breakpoints. No copiar markup/clases Elementor. Componentes Server por defecto; cliente solo navegación, selector, forms, preferencias y edición. Validar móvil 360 px, tablet y escritorio; foco, contraste AA, zoom 200 %, reflow 320 px y reduced motion.

