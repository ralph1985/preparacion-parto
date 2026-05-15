const HEADER_SCROLL_OFFSET = 120;
const SECTION_ACTIVE_OFFSET = 90;

const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav__link");
const sections = document.querySelectorAll("section[id]");
const header = document.getElementById("header");
const courseNav = document.getElementById("course-nav");
const lessonPanel = document.getElementById("lesson-panel");

let course = null;
let flatLessons = [];

function setMenuOpen(isOpen) {
  if (!navMenu || !navToggle) return;

  navMenu.classList.toggle("show-menu", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    setMenuOpen(!navMenu.classList.contains("show-menu"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Node && !navMenu.contains(target) && !navToggle.contains(target)) {
      setMenuOpen(false);
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

function updateActiveSection() {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - SECTION_ACTIVE_OFFSET;
    const sectionId = section.getAttribute("id");
    const sectionLink = document.querySelector(`.nav__menu a[href="#${sectionId}"]`);

    if (!sectionLink) return;

    sectionLink.classList.toggle(
      "active-link",
      scrollY > sectionTop && scrollY <= sectionTop + sectionHeight
    );
  });
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle("scroll-header", window.scrollY >= HEADER_SCROLL_OFFSET);
}

let scrollTicking = false;

function requestScrollUpdate() {
  if (scrollTicking) return;

  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateActiveSection();
    updateHeader();
    scrollTicking = false;
  });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let listType = null;

  function closeList() {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      return;
    }

    if (trimmed.startsWith("# ")) {
      closeList();
      html.push(`<h1>${inlineMarkdown(trimmed.slice(2))}</h1>`);
      return;
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
      return;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${inlineMarkdown(trimmed.replace(/^[-*]\s+/, ""))}</li>`);
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${inlineMarkdown(trimmed.replace(/^\d+\.\s+/, ""))}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  });

  closeList();
  return html.join("");
}

function normalizeHash() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return params.get("leccion");
}

function setLessonHash(id) {
  window.location.hash = new URLSearchParams({ leccion: id }).toString();
}

function renderCourseNav(activeId) {
  if (!courseNav || !course) return;

  courseNav.innerHTML = course.modules
    .map((module) => {
      const lessons = module.lessons
        .map(
          (lesson) =>
            `<a class="course__lesson${lesson.id === activeId ? " is-active" : ""}" href="#leccion=${lesson.id}">${escapeHtml(lesson.title)}</a>`
        )
        .join("");

      return `
        <section class="course__module">
          <h3 class="course__module-title">${escapeHtml(module.title)}</h3>
          ${lessons}
        </section>
      `;
    })
    .join("");
}

async function loadLesson(id) {
  if (!lessonPanel || !course) return;

  const lesson = flatLessons.find((item) => item.id === id) || flatLessons[0];
  if (!lesson) return;

  renderCourseNav(lesson.id);
  lessonPanel.innerHTML = "<p>Cargando apuntes...</p>";

  try {
    const response = await fetch(lesson.file);
    if (!response.ok) throw new Error(`No se pudo cargar ${lesson.file}`);

    const markdown = await response.text();
    const lessonIndex = flatLessons.findIndex((item) => item.id === lesson.id);
    const previous = flatLessons[lessonIndex - 1];
    const next = flatLessons[lessonIndex + 1];

    lessonPanel.innerHTML = `
      <p class="lesson__meta">${escapeHtml(lesson.moduleTitle)}</p>
      ${renderMarkdown(markdown)}
      <nav class="lesson__pager" aria-label="Navegación entre lecciones">
        ${previous ? `<a class="button button--secondary" href="#leccion=${previous.id}">Anterior: ${escapeHtml(previous.title)}</a>` : "<span></span>"}
        ${next ? `<a class="button button--primary" href="#leccion=${next.id}">Siguiente: ${escapeHtml(next.title)}</a>` : ""}
      </nav>
    `;
  } catch (error) {
    lessonPanel.innerHTML = `
      <h3>No se pudo cargar la lección</h3>
      <p>Sirve la carpeta con un servidor local para que el navegador pueda leer los archivos Markdown.</p>
      <p><code>${escapeHtml(error.message)}</code></p>
    `;
  }
}

async function initCourse() {
  if (!courseNav || !lessonPanel) return;

  try {
    const response = await fetch("./content/course.json");
    if (!response.ok) throw new Error("No se pudo cargar el índice del curso");

    course = await response.json();
    flatLessons = course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        ...lesson,
        moduleTitle: module.title,
      }))
    );

    const requestedLesson = normalizeHash();
    await loadLesson(requestedLesson || flatLessons[0]?.id);
  } catch (error) {
    courseNav.innerHTML = "";
    lessonPanel.innerHTML = `
      <h3>No se pudo cargar el curso</h3>
      <p>Comprueba que existe <code>content/course.json</code> y que estás sirviendo la web con un servidor local.</p>
      <p><code>${escapeHtml(error.message)}</code></p>
    `;
  }
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("hashchange", () => loadLesson(normalizeHash()));
window.addEventListener("load", () => {
  requestScrollUpdate();
  initCourse();
});

if (window.AOS) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.AOS.init({
    once: true,
    delay: 0,
    duration: reduceMotion ? 0 : 420,
    disable: reduceMotion,
  });
}
