# Colecciones de recursos

Esta estructura organiza los recursos por uso visual sin romper rutas existentes.

- `brand/`: logos y favicons i3e.
- `home/`: hero y segmentos de audiencia.
- `partners/`, `clients/`, `cases/`: prueba social y casos.
- `services/`: recursos por familia de servicio e iconos.
- `shared/`: recursos reutilizables sin familia específica.

Los archivos de estas colecciones son **hardlinks** hacia el inventario canónico plano `public/assets/i3e/`. No ocupan espacio extra; esa raíz y `manifest.json` deben conservarse para compatibilidad con el sincronizador y rutas actuales.

`services/icons/legacy-wordpress/` contiene los cinco iconos que el HTML original referenciaba mediante el dominio obsoleto `i3e.seakting.com`. Se recuperaron desde `www.i3einformatica.com`; no se usan por la nueva UI, que emplea los SVG accesibles del mismo grupo.

La miniatura `https://i.ytimg.com/vi/ID/hqdefault.jpg` se excluye: usa el identificador literal `ID` y no representa un vídeo publicable.
