# Preparación al parto

Web estática pública para organizar apuntes de clases de preparación al parto como un curso navegable.

El proyecto no usa framework ni proceso de build: el navegador carga `index.html`, los estilos y scripts locales,
el índice del curso desde `content/course.json` y cada lección desde archivos Markdown en `content/modules/`.

> Contenido educativo: la web debe revisarse con criterio sanitario antes de publicarse con apuntes reales. No sustituye
> el seguimiento de matrona, ginecología, pediatría, urgencias ni del equipo sanitario.

## Estructura

- `index.html`: portada, lector del curso y secciones principales.
- `assets/css/style.css`: identidad visual y responsive.
- `assets/js/script.js`: navegación, carga del índice y renderizado Markdown.
- `assets/vendor/aos/`: librería local para animaciones al hacer scroll.
- `assets/fonts/`: fuentes autoalojadas usadas por la interfaz.
- `assets/img/favicons/`: favicon SVG y PNG.
- `assets/img/generated/`: imágenes principales de la web.
- `content/course.json`: índice de módulos y lecciones.
- `content/modules/*.md`: apuntes editables.
- `scripts/bump-asset-version.sh`: actualiza los parámetros `?v=` de los assets referenciados en `index.html`.
- `vercel.json`: cabeceras de seguridad y caché para el despliegue en Vercel.

## Desarrollo local

El lector usa `fetch`, así que abrir el HTML directamente con `file://` no es suficiente. Sirve la carpeta con un
servidor local:

```bash
cd preparacion-parto
python3 -m http.server 8080
```

Después abre:

```text
http://localhost:8080
```

## Funcionamiento

1. `assets/js/script.js` carga `./content/course.json`.
2. Aplana los módulos en una lista de lecciones.
3. Renderiza el índice lateral del curso.
4. Lee la lección indicada por el hash `#leccion=<id>` o abre la primera.
5. Convierte un subconjunto simple de Markdown a HTML.

El parser Markdown integrado soporta títulos `#`, `##`, `###`, listas ordenadas, listas sin ordenar, negrita, cursiva y
texto en código. Si necesitas tablas, enlaces complejos, citas o bloques de código, conviene sustituirlo por un parser
Markdown probado o ampliar el renderizador con tests manuales claros.

## Añadir o editar apuntes

1. Edita o crea un archivo Markdown en `content/modules/`.
2. Añade la lección a `content/course.json` con un `id` único, título visible y ruta del archivo.
3. Revisa la web servida localmente.

Ejemplo:

```json
{
  "id": "nueva-leccion",
  "title": "Nueva lección",
  "file": "./content/modules/11-nueva-leccion.md"
}
```

El contenido actual es una base placeholder para sustituir por apuntes reales.

## Assets y caché

Los assets se enlazan con un parámetro de versión (`?v=...`) para evitar cachés antiguas tras publicar cambios. Antes de
desplegar una versión con cambios en CSS, JS o imágenes, ejecuta:

```bash
./scripts/bump-asset-version.sh
```

El script actualiza las referencias de `index.html`.

## Despliegue

Está preparado para Vercel como sitio estático. `vercel.json` define:

- Cabeceras de seguridad: CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`.
- Caché larga e inmutable para `/assets/(.*)`.
- Revalidación inmediata para `/`, `/index.html` y `/content/(.*)`, de forma que los apuntes Markdown puedan cambiar sin
  depender de una caché prolongada.

## Comprobación manual antes de publicar

1. Arranca el servidor local.
2. Abre la portada y comprueba que cargan las imágenes.
3. Recorre el menú de navegación en móvil y escritorio.
4. Abre varias lecciones desde el índice y con enlaces anterior/siguiente.
5. Revisa que las señales de alarma y cualquier recomendación clínica estén validadas por fuentes profesionales.
