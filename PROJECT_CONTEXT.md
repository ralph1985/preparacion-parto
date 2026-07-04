# Preparación al parto - contexto del proyecto

Web privada/familiar en español para organizar apuntes educativos de preparación al parto.

## Estado actual

- La web pública está construida con Astro y salida estática.
- Es multipágina: `/`, `/curso/` y una página por lección en `/curso/<id>/`.
- El contenido del curso vive en `src/infrastructure/content/data/course.json` y `src/infrastructure/content/modules/*.md`.
- `public/content/course-full.md` se genera desde el índice y los módulos Markdown para LLMs y lectores sin JavaScript.
- Los assets públicos viven en `public/assets/**`.
- El JavaScript editable vive en `src/scripts/site.js` y debe seguir siendo vanilla.

## Límites

- El contenido es educativo y no sustituye el seguimiento de matrona, ginecología, pediatría, urgencias ni del equipo sanitario.
- Mantener privacidad y `noindex, nofollow` salvo petición explícita.
- No añadir CMS, base de datos, analytics, formularios externos ni dependencias grandes sin decisión explícita.
- En móvil, el índice del curso debe seguir como drawer/bottom sheet o equivalente, sin empujar la lección hacia abajo.

## Flujo local

- Instalar dependencias con pnpm/Corepack.
- Desarrollo: `corepack pnpm run dev`.
- Build: `corepack pnpm run build`.
- Validación general: `corepack pnpm run lint` y `git diff --check`.
- Si cambian módulos Markdown o `course.json`, `corepack pnpm run build` regenera `public/content/course-full.md`.
