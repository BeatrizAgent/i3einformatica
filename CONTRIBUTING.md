# Guía de Contribución

Gracias por tu interés en contribuir a i3e Informática. Este documento explica cómo participar en el desarrollo del proyecto.

## Requisitos previos

- Node.js 22
- pnpm 10+
- Git

## Primeros pasos

1. **Bifurca el repositorio** en GitHub
2. **Clona tu bifurcación** en local:
   ```bash
   git clone https://github.com/TU-USUARIO/i3einformatica.git
   cd i3einformatica
   ```
3. **Instala las dependencias**:
   ```bash
   pnpm install
   ```
4. **Inicia el servidor de desarrollo**:
   ```bash
   pnpm dev
   ```

## Estructura del proyecto

```
i3einformatica/
├── src/
│   ├── app/              # Rutas Next.js (App Router)
│   ├── components/       # Componentes React
│   └── lib/              # Utilidades, contenido, assets
├── data/
│   └── content/
│       └── pages/        # Contenido editorial en JSON
├── public/
│   └── assets/i3e/       # Assets estáticos optimizados
├── scripts/              # CLI de auditoría y validación
└── docs/                 # Documentación del proyecto
```

## Flujo de trabajo

### 1. Crea una rama de features

```bash
git checkout -b feat/nombre-descriptivo
```

Convenciones de ramas:
- `feat/` — Nuevas funcionalidades
- `fix/` — Corrección de bugs
- `docs/` — Actualizaciones de documentación
- `refactor/` — Refactorizaciones sin cambio de funcionalidad

### 2. Realiza tus cambios

- **Contenido editorial**: Editar los JSON en `data/content/pages/`
- **Componentes**: Modificar archivos en `src/components/`
- **Estilos**: Actualizar `src/app/globals.css` y usar tokens de `DESIGN.md`
- **Nuevas páginas**: Seguir el patrón de `src/app/[[...segments]]/page.tsx`

### 3. Valida tus cambios

```bash
# Validar contenido JSON
pnpm content:validate

# Verificar codificación
pnpm encoding:check

# Linting
pnpm lint

# Verificación de tipos
pnpm typecheck

# Tests unitarios
pnpm test

# Build completo
pnpm build
```

### 4. Comprueba la exportación

```bash
pnpm export:validate
```

### 5. Envía tu pull request

- Asegúrate de que todos los checks pasan
- Escribe una descripción clara de los cambios
- Referencia issues relacionadas si las hay

## Convenciones de código

### TypeScript

- TypeScript estricto habilitado
- Prefiere Server Components; marca Client Components con `"use client"`
- Prefiere `interface` sobre `type` para objetos
- Usa `_` para parámetros no usados

### Componentes React

- Funciones con nombre (no anónimas)
- Un componente por archivo
- Props tipadas con `interface`
- Exportación nombrada (no default)

### Contenido JSON

- Mantén el contenido en `data/content/pages/*.json`
- Valida después de cada cambio con `pnpm content:validate`
- Usa `assetId` en lugar de rutas de assets dentro del copy
- Estados válidos: `in_review`, `approved`, `published`

### CSS

- Usa tokens de color definidos en `DESIGN.md`
- Utiliza variables CSS (`--font-title`, `--font-body`, etc.)
- Respeta el sistema de diseño Swiss Tech B2B
- Prueba en 390px, 768px, 1280px y 1440px

## Commits

Usa mensajes descriptivos en presente:

```
feat: añadir sección de estadísticas en home
fix: corregir layout en móvil para página de contacto
docs: actualizar guía de contribución
refactor: extraer componente de tarjeta de servicio
```

## Issues y bugs

Al reportar un bug, incluye:

1. **Descripción** clara del problema
2. **Pasos para reproducir**
3. **Comportamiento esperado**
4. **Comportamiento actual**
5. **Entorno** (navegador, SO, versión de Node)

## Preguntas

Si tienes dudas, abre un issue con la etiqueta `question`.

## Licencia

Al contribuir, aceptas que tus contribuciones se licencien bajo Apache 2.0.
