# Claude Code Instructions

Read `AGENTS.md` first. It is the canonical coding-agent guide for this repository.

Key reminders:

- This is an Astro static multipage site.
- Main pages: `src/pages/index.astro`, `src/pages/curso/index.astro`, `src/pages/curso/[lessonId].astro`.
- Course content lives in `src/infrastructure/content/data/course.json` and `src/infrastructure/content/modules/*.md`.
- Browser JavaScript lives in `src/scripts/site.js`; keep it vanilla.
- After editing lesson Markdown or `course.json`, run `node scripts/build-course-full.mjs` or `corepack pnpm run build`.
- Keep the mobile course index as an on-demand bottom sheet/drawer; do not place the full course index above lesson content on mobile.
- Keep medical content cautious, private, and clearly educational.
