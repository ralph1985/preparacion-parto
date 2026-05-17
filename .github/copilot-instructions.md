# Copilot Instructions

This repository is a static Spanish childbirth-preparation notes site. Follow `AGENTS.md` for full project guidance.

- No framework, bundler, or package manager is used.
- Main files: `index.html`, `assets/css/style.css`, `assets/js/script.js`, `content/course.json`, `content/modules/*.md`.
- The site must be served over HTTP locally because lessons are loaded with `fetch`.
- Regenerate `content/course-full.md` with `node scripts/build-course-full.mjs` whenever course modules or the course index change.
- Do not confuse the top site navigation with the course lesson navigation. The course navigation should remain mobile-friendly and not push lesson content down.
- Preserve privacy and `noindex` behavior unless explicitly told otherwise.
