# Coding Agent Guide

## Project Snapshot

This is a private/family Spanish childbirth preparation notes site built with Astro as a static multipage website.

- Home page: `src/pages/index.astro`
- Course index: `src/pages/curso/index.astro`
- Lesson pages: `src/pages/curso/[lessonId].astro`
- Layouts: `src/layouts/*.astro`
- UI components/sections: `src/components/**`, `src/sections/**`
- Styles: `src/styles/main.css`
- Client logic: `src/scripts/site.js`
- Course index: `src/infrastructure/content/data/course.json`
- Lesson source files: `src/infrastructure/content/modules/*.md`
- Full static course export for LLMs/no-JS readers: `public/content/course-full.md`
- LLM content summary: `public/llms.txt`
- Static hosting config: `vercel.json`

Keep the project static. Do not add a CMS, database, analytics, external widgets or large UI dependencies unless explicitly asked.

## Run And Verify

Use pnpm through Corepack:

```bash
corepack pnpm install
corepack pnpm run dev
```

Then open:

```text
http://localhost:4321
```

Useful checks:

```bash
corepack pnpm run lint
corepack pnpm run build
git diff --check
```

If lesson Markdown or `course.json` changes, always regenerate the LLM export:

```bash
node scripts/build-course-full.mjs
```

`corepack pnpm run build` already runs that generator before `astro build`.

If public assets change and references include `?v=...`, update asset cache-busting versions:

```bash
./scripts/bump-asset-version.sh
```

## Architecture Notes

- Astro renders `/`, `/curso/` and one static page per lesson at `/curso/<lesson-id>/`.
- `src/infrastructure/content/local-course-repository.ts` reads local JSON and Markdown at build time.
- `src/shared/markdown.ts` renders a deliberately small Markdown subset during build.
- `src/scripts/site.js` is browser-only JavaScript for top navigation, the course drawer and checklist persistence.
- Desktop course navigation is the sidebar inside course pages.
- Mobile course navigation is a separate `<dialog>` bottom sheet populated by Astro from the same course data. Do not confuse this with the top site navigation.
- `public/content/course-full.md` is generated from the course JSON and modules; do not hand-edit it unless the generator is also updated.
- `public/llms.txt` is for understanding the website content. This `AGENTS.md` is for coding agents.

## Content And Safety Rules

- The content is educational and private/family oriented. Do not present it as medical advice.
- Keep privacy in mind: avoid adding real names, personal identifiers, addresses or unnecessary direct contact details.
- Clinical statements should be cautious and source-aware. Prefer wording such as "consultar con matrona/ginecología/pediatría" or "según protocolo del centro" for variable guidance.
- Preserve `noindex, nofollow` behavior unless the user explicitly asks to make the site public.

## UI Rules

- Optimize primarily for mobile reading.
- The course index must not push lesson content down on mobile. Keep it as an on-demand bottom sheet/drawer or a better equivalent.
- Keep the top navigation and the course lesson navigation as separate concerns.
- Avoid adding large dependencies for UI. Use native HTML/CSS/JS first.
- Test long lessons, especially postparto and lactancia, because they are the main stress cases.

## Markdown Renderer Constraints

The build-time renderer supports:

- Headings `#` through `######`
- Ordered and unordered lists, including basic nesting
- Bold, italic, inline code
- Basic Markdown links with `http` or `https`

It does not fully support tables, blockquotes, fenced code blocks, HTML passthrough, footnotes or complex Markdown. If those are needed, either extend the renderer carefully or replace it with a proven parser and keep CSP/static constraints in mind.

## Deployment Notes

Vercel serves the Astro static output. `vercel.json` defines security headers, asset caching, content revalidation and `X-Robots-Tag: noindex, nofollow`.

When adding new static files that should be consumed by LLMs or crawlers, consider whether they need explicit cache or content-type headers in `vercel.json`.

## Agent Configuration

- Repo-level stable context lives in `PROJECT_CONTEXT.md`.
- Durable project decisions live in `docs/agent-memory/decisions.md`.
- Known operational caveats live in `docs/agent-memory/known-issues.md`.
- Local Codex agents and skills, when present, live in `.codex/` and `.agents/`.

Keep agent instructions in Spanish where they are user-facing, and keep technical constraints in this file current when the architecture changes.
