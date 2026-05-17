# Claude Code Instructions

Read `AGENTS.md` first. It is the canonical coding-agent guide for this repository.

Key reminders:

- This is a no-build static site: `index.html`, `assets/css/style.css`, `assets/js/script.js`, `content/course.json`, and `content/modules/*.md`.
- Serve with `python3 -m http.server 8080`; do not rely on `file://`.
- After editing lesson Markdown or `content/course.json`, run `node scripts/build-course-full.mjs`.
- Keep the mobile course index as an on-demand bottom sheet/drawer; do not place the full course index above lesson content on mobile.
- Keep medical content cautious, private, and clearly educational.
