# Decisiones

## Astro multipágina

- El curso se sirve como páginas estáticas, no como una sola vista que carga Markdown con `fetch`.
- La ruta canónica de una lección es `/curso/<lesson-id>/`.
- `src/infrastructure/content/data/course.json` mantiene el orden y los metadatos de módulos/lecciones.
- `src/infrastructure/content/modules/*.md` mantiene el contenido fuente editable.
- `public/content/course-full.md` es generado y no debe editarse a mano.

## Cliente ligero

- `src/scripts/site.js` conserva solo interacción de navegador: menú superior, drawer móvil del curso y checklist local.
- El renderizado Markdown ocurre en build con `src/shared/markdown.ts`.
- No añadir un parser Markdown externo salvo que el subconjunto actual deje de ser suficiente.
