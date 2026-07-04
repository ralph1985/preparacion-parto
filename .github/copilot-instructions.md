# Copilot Instructions

This repository is a private Spanish childbirth-preparation notes site built with Astro. Follow `AGENTS.md` for full project guidance.

- Static output only; no CMS or backend unless explicitly requested.
- Main files: `src/pages/index.astro`, `src/pages/curso/index.astro`, `src/pages/curso/[lessonId].astro`, `src/styles/main.css`, `src/scripts/site.js`.
- Course content lives in `src/infrastructure/content/data/course.json` and `src/infrastructure/content/modules/*.md`.
- Regenerate `public/content/course-full.md` with `node scripts/build-course-full.mjs` whenever course modules or the course index change.
- Do not confuse the top site navigation with the course lesson navigation. The course navigation should remain mobile-friendly and not push lesson content down.
- Preserve privacy and `noindex` behavior unless explicitly told otherwise.
