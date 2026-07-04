# Preparación al parto

Web estática privada/familiar para organizar apuntes de preparación al parto como curso multipágina.

> Contenido educativo: la web debe revisarse con criterio sanitario antes de publicarse con apuntes reales. No sustituye
> el seguimiento de matrona, ginecología, pediatría, urgencias ni del equipo sanitario.

## Estructura

- `src/pages/index.astro`: portada, checklist, recursos, LLM y contacto.
- `src/pages/curso/index.astro`: índice/entrada del curso.
- `src/pages/curso/[lessonId].astro`: página estática de cada lección.
- `src/layouts/`: layouts compartidos.
- `src/components/` y `src/sections/`: UI Astro.
- `src/scripts/site.js`: JavaScript vanilla para navegación, drawer móvil y checklist.
- `src/styles/main.css`: estilos globales.
- `src/infrastructure/content/data/course.json`: índice de módulos y lecciones.
- `src/infrastructure/content/modules/*.md`: apuntes editables.
- `public/content/course-full.md`: versión agregada generada para lectores sin JavaScript y LLMs.
- `public/llms.txt`: resumen estructurado para LLMs.
- `public/assets/`: fuentes, imágenes, favicons y assets públicos.
- `AGENTS.md`, `PROJECT_CONTEXT.md` y `docs/agent-memory/*`: instrucciones y memoria estable para agentes.
- `vercel.json`: cabeceras de seguridad y caché.

## Desarrollo local

Usa pnpm vía Corepack:

```bash
corepack pnpm install
corepack pnpm run dev
```

Después abre:

```text
http://localhost:4321
```

## Comprobaciones

```bash
corepack pnpm run lint
corepack pnpm run build
git diff --check
```

El build ejecuta `node scripts/build-course-full.mjs` antes de Astro, así que `public/content/course-full.md` queda alineado con el curso.

## Añadir o editar apuntes

1. Edita o crea un archivo Markdown en `src/infrastructure/content/modules/`.
2. Añade la lección a `src/infrastructure/content/data/course.json` con `id`, título visible y ruta.
3. Ejecuta `corepack pnpm run build`.
4. Revisa la ruta generada `/curso/<id>/`.

Ejemplo:

```json
{
  "id": "nueva-leccion",
  "title": "Nueva lección",
  "file": "./modules/11-nueva-leccion.md"
}
```

## Arquitectura

La web es Astro con salida estática. El curso no depende de `fetch` en el navegador: Astro lee el índice y los Markdown en build, renderiza una página por lección y mantiene el drawer móvil como navegación progresiva.

El renderizador Markdown propio está en `src/shared/markdown.ts` y soporta encabezados, listas básicas, negrita, cursiva, código inline y enlaces HTTP/HTTPS.

## LLMs

Para compartir la web con ChatGPT u otro LLM:

- `public/llms.txt`: mapa breve del sitio.
- `public/content/course-full.md`: curso completo concatenado desde los módulos Markdown.

No edites `public/content/course-full.md` a mano; cambia los módulos o el generador.

## Despliegue

Vercel sirve el sitio estático generado por Astro. `vercel.json` mantiene:

- CSP y cabeceras de seguridad.
- `X-Robots-Tag: noindex, nofollow`.
- Caché larga para `/assets/(.*)`.
- Revalidación inmediata para páginas y `/content/(.*)`.
