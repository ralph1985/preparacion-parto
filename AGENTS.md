# Coding Agent Guide

## Project Snapshot

This is a static, framework-free Spanish website for private/family childbirth preparation notes.

- Entry point: `index.html`
- Styles: `assets/css/style.css`
- Client logic: `assets/js/script.js`
- Course index: `content/course.json`
- Lesson source files: `content/modules/*.md`
- Full static course export for LLMs/no-JS readers: `content/course-full.md`
- LLM content summary: `llms.txt`
- Static hosting config: `vercel.json`

The site has no package manager, build step, framework, or bundler. Keep it that way unless explicitly asked.

## Run And Verify

Serve locally because the course uses `fetch`; opening `index.html` through `file://` will not load lessons.

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

Useful checks:

```bash
node --check assets/js/script.js
node scripts/build-course-full.mjs
git diff --check
```

If lesson Markdown changes, always regenerate `content/course-full.md`:

```bash
node scripts/build-course-full.mjs
```

If CSS, JS, images, or favicons change before a real deploy, update asset cache-busting versions:

```bash
./scripts/bump-asset-version.sh
```

## Architecture Notes

- `assets/js/script.js` loads `content/course.json`, flattens lessons, renders course navigation, fetches Markdown, and renders a deliberately small Markdown subset.
- Desktop course navigation is the sidebar inside the course section.
- Mobile course navigation is a separate `<dialog>` bottom sheet populated from the same course data. Do not confuse this with the top site navigation.
- `content/course-full.md` is generated from `content/course.json` and `content/modules/*.md`; do not hand-edit it unless the generator is also updated.
- `llms.txt` is for understanding the website content. This `AGENTS.md` is for coding agents.

## Content And Safety Rules

- The content is educational and private/family oriented. Do not present it as medical advice.
- Keep privacy in mind: avoid adding real names, personal identifiers, addresses, or unnecessary direct contact details.
- Clinical statements should be cautious and source-aware. Prefer wording such as "consultar con matrona/ginecologia/pediatria" or "segun protocolo del centro" for variable guidance.
- Preserve `noindex, nofollow` behavior unless the user explicitly asks to make the site public.

## UI Rules

- Optimize primarily for mobile reading.
- The course index must not push lesson content down on mobile. Keep it as an on-demand bottom sheet/drawer or a better equivalent.
- Keep the top navigation and the course lesson navigation as separate concerns.
- Avoid adding large dependencies for UI. Use native HTML/CSS/JS first.
- Test long lessons, especially postparto and lactancia, because they are the main stress cases.

## Markdown Renderer Constraints

The in-browser renderer supports:

- Headings `#` through `######`
- Ordered and unordered lists, including basic nesting
- Bold, italic, inline code
- Basic Markdown links with `http` or `https`

It does not fully support tables, blockquotes, fenced code blocks, HTML passthrough, footnotes, or complex Markdown. If those are needed, either extend the renderer carefully or replace it with a proven parser and keep CSP/static constraints in mind.

## Deployment Notes

Vercel serves the static files. `vercel.json` defines security headers, asset caching, content revalidation, and `X-Robots-Tag: noindex, nofollow`.

When adding new static files that should be consumed by LLMs or crawlers, consider whether they need explicit cache or content-type headers in `vercel.json`.
