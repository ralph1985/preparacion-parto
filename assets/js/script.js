const HEADER_SCROLL_OFFSET = 120;
const SECTION_ACTIVE_OFFSET = 90;

const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav__link");
const sections = document.querySelectorAll("section[id]");
const header = document.getElementById("header");
const courseNav = document.getElementById("course-nav");
const courseDrawerNav = document.getElementById("course-drawer-nav");
const lessonPanel = document.getElementById("lesson-panel");
const courseDrawer = document.getElementById("course-drawer");
const courseDrawerOpen = document.getElementById("course-drawer-open");
const courseDrawerClose = document.getElementById("course-drawer-close");
const checklistGrid = document.getElementById("checklist-grid");
const checklistTotal = document.getElementById("checklist-total");
const checklistResetAll = document.getElementById("checklist-reset-all");

let course = null;
let flatLessons = [];

const CHECKLIST_STORAGE_KEY = "preparacion-parto-checklist-v1";

const checklistSections = [
  {
    id: "antes-parto",
    title: "Antes del parto",
    lessonId: "final-embarazo",
    items: [
      { id: "dudas-equipo", text: "Anotar dudas para matrona, ginecologia o equipo sanitario.", review: true },
      { id: "descanso-hidratacion", text: "Revisar descanso, hidratacion, movimiento suave y comidas faciles." },
      { id: "acompanante", text: "Acordar el papel del acompanante durante espera, traslado y hospital." },
      { id: "perine", text: "Confirmar medidas seguras de cuidado del perine con profesionales.", review: true },
    ],
  },
  {
    id: "salida-hospital",
    title: "Senales y salida al hospital",
    lessonId: "senales-parto",
    items: [
      { id: "regla-contracciones", text: "Tener clara la regla orientativa de contracciones indicada por el centro.", review: true },
      { id: "alarma-embarazo", text: "Revisar senales de alarma: sangrado, fiebre, dolor continuo, bolsa no clara o menos movimientos.", review: true },
      { id: "telefono-matronas", text: "Guardar el telefono de asistencia o urgencias del centro de referencia." },
      { id: "ruta-urgencias", text: "Confirmar por donde entrar el dia del parto y como llegar." },
    ],
  },
  {
    id: "bolsa-hospital",
    title: "Bolsa hospital",
    lessonId: "bolsa-hospital",
    items: [
      { id: "documentacion", text: "Preparar DNI, tarjeta sanitaria, historia del embarazo y documentacion familiar si aplica." },
      { id: "madre", text: "Preparar bolsa de la madre: ropa de salida, aseo, zapatillas, bragas, agua/snacks permitidos y apoyo para el dolor." },
      { id: "acompanante", text: "Preparar bolsa del acompanante: comida, bebida, abrigo o sudadera, cargador y ropa comoda." },
      { id: "bebe", text: "Preparar bolsa del bebe: ropa de alta, gorrito, manta, panales, muselinas y basicos de higiene." },
      { id: "tecnologia", text: "Cargar moviles, preparar cargadores, powerbank, cascos y musica offline." },
      { id: "coche", text: "Dejar coche listo con gasolina y sillita instalada." },
    ],
  },
  {
    id: "plan-parto",
    title: "Plan de parto",
    lessonId: "plan-parto",
    items: [
      { id: "preferencias", text: "Revisar preferencias de acompanamiento, movilidad, ambiente y alivio del dolor." },
      { id: "cesarea", text: "Anotar preferencias si hay cesarea o separacion madre-bebe." },
      { id: "piel-cordon", text: "Confirmar piel con piel, clampaje del cordon y lactancia inicial segun situacion clinica.", review: true },
      { id: "documento", text: "Imprimir o guardar el plan de parto en el movil." },
    ],
  },
  {
    id: "primeras-horas",
    title: "Primeras horas",
    lessonId: "primeras-horas",
    items: [
      { id: "piel-piel", text: "Priorizar piel con piel si madre y bebe estan bien.", review: true },
      { id: "primera-toma", text: "Pedir ayuda para primera toma o agarre si se desea lactancia." },
      { id: "revisiones", text: "Preguntar que revisiones o pruebas se haran al bebe y cuando." },
      { id: "recuperacion", text: "Avisar si hay mareo, dolor importante, sangrado llamativo o inseguridad al levantarse.", review: true },
    ],
  },
  {
    id: "postparto-casa",
    title: "Postparto en casa",
    lessonId: "organizacion-casa",
    items: [
      { id: "comida", text: "Dejar compra inicial o comidas sencillas preparadas." },
      { id: "visitas", text: "Acordar limites de visitas y quien comunica esos limites." },
      { id: "tareas", text: "Repartir tareas domesticas, compra, descanso y cuidado del bebe." },
      { id: "zona-descanso", text: "Preparar zona de descanso, lactancia o alimentacion, compresas y ropa comoda." },
      { id: "alarma-postparto", text: "Revisar senales de alarma fisicas y emocionales para consultar pronto.", review: true },
    ],
  },
  {
    id: "lactancia",
    title: "Lactancia y alimentacion",
    lessonId: "lactancia",
    items: [
      { id: "agarre", text: "Pedir ayuda temprana si hay dolor, grietas, mal agarre o dudas con tomas." },
      { id: "demanda", text: "Tener presentes libre demanda, piel con piel y senales de hambre/saciedad." },
      { id: "sin-agua", text: "Recordar que el recien nacido no debe tomar agua salvo indicacion profesional.", review: true },
      { id: "formula", text: "Si se usa formula, seguir instrucciones del envase y pediatria/matrona.", review: true },
      { id: "apoyos", text: "Guardar recursos de lactancia, grupo de apoyo o telefono del centro." },
    ],
  },
  {
    id: "cuidados-bebe",
    title: "Cuidados del bebe",
    lessonId: "cuidados-bebe",
    items: [
      { id: "cordon", text: "Revisar cuidados del cordon y signos de infeccion con pediatria/matrona.", review: true },
      { id: "sueno", text: "Preparar un entorno de sueno seguro segun recomendaciones actuales.", review: true },
      { id: "temperatura", text: "Tener termometro y criterios claros para consultar por fiebre o mal estado.", review: true },
      { id: "panales", text: "Observar panales, alimentacion y comportamiento general del bebe." },
    ],
  },
  {
    id: "tramites-contactos",
    title: "Tramites y contactos",
    lessonId: "tramites-postparto",
    items: [
      { id: "alta-bebe", text: "Revisar alta del bebe, tarjeta sanitaria, pediatra y beneficiario en Seguridad Social." },
      { id: "permisos", text: "Revisar permisos, prestaciones y posibles ayudas con sus plazos." },
      { id: "contactos", text: "Guardar telefonos utiles: urgencias, matronas, pediatria y apoyo familiar." },
      { id: "citas", text: "Anotar revisiones de madre y bebe tras el alta." },
    ],
  },
];

function openCourseDrawer() {
  if (!courseDrawer || courseDrawer.open) return;

  courseDrawer.showModal();
  const activeLesson = courseDrawer.querySelector(".course__lesson.is-active");
  if (activeLesson) activeLesson.scrollIntoView({ block: "center" });
}

function closeCourseDrawer() {
  if (!courseDrawer || !courseDrawer.open) return;
  courseDrawer.close();
}

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
    if (event.key === "Escape") {
      setMenuOpen(false);
      closeCourseDrawer();
    }
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

if (courseDrawerOpen) {
  courseDrawerOpen.addEventListener("click", openCourseDrawer);
}

if (courseDrawerClose) {
  courseDrawerClose.addEventListener("click", closeCourseDrawer);
}

if (courseDrawer) {
  courseDrawer.addEventListener("click", (event) => {
    if (event.target === courseDrawer) closeCourseDrawer();
  });
}

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
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function getChecklistProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(CHECKLIST_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveChecklistProgress(progress) {
  try {
    window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // The checklist remains usable even if storage is disabled.
  }
}

function getChecklistItemKey(sectionId, itemId) {
  return `${sectionId}:${itemId}`;
}

function updateChecklistSummary() {
  if (!checklistGrid || !checklistTotal) return;

  const checkboxes = checklistGrid.querySelectorAll(".checklist__input");
  const completed = checklistGrid.querySelectorAll(".checklist__input:checked").length;
  checklistTotal.textContent = `${completed} de ${checkboxes.length}`;

  checklistSections.forEach((section) => {
    const sectionCard = checklistGrid.querySelector(`[data-checklist-section="${section.id}"]`);
    if (!sectionCard) return;

    const sectionInputs = sectionCard.querySelectorAll(".checklist__input");
    const sectionCompleted = sectionCard.querySelectorAll(".checklist__input:checked").length;
    const sectionCount = sectionCard.querySelector(".checklist__count");
    if (sectionCount) sectionCount.textContent = `${sectionCompleted}/${sectionInputs.length}`;
  });
}

function renderChecklist() {
  if (!checklistGrid) return;

  const progress = getChecklistProgress();
  checklistGrid.innerHTML = checklistSections
    .map((section) => {
      const items = section.items
        .map((item) => {
          const inputId = `checklist-${section.id}-${item.id}`;
          const key = getChecklistItemKey(section.id, item.id);
          const checked = progress[key] ? " checked" : "";
          const reviewLabel = item.review
            ? '<span class="checklist__tag">Revisar con profesional</span>'
            : "";

          return `
            <li class="checklist__item">
              <input class="checklist__input" type="checkbox" id="${escapeHtml(inputId)}" data-key="${escapeHtml(key)}"${checked}>
              <label class="checklist__label" for="${escapeHtml(inputId)}">
                <span>${escapeHtml(item.text)}</span>
                ${reviewLabel}
              </label>
            </li>
          `;
        })
        .join("");

      return `
        <article class="checklist__card" data-checklist-section="${escapeHtml(section.id)}">
          <div class="checklist__card-header">
            <div>
              <p class="checklist__eyebrow">Momento</p>
              <h3>${escapeHtml(section.title)}</h3>
            </div>
            <span class="checklist__count">0/${section.items.length}</span>
          </div>
          <ul class="checklist__items">
            ${items}
          </ul>
          <div class="checklist__actions">
            <a href="./curso.html#leccion=${escapeHtml(section.lessonId)}" data-checklist-lesson="${escapeHtml(section.lessonId)}">Ver apuntes</a>
            <button type="button" data-reset-section="${escapeHtml(section.id)}">Reiniciar</button>
          </div>
        </article>
      `;
    })
    .join("");

  checklistGrid.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.matches(".checklist__input")) return;

    const key = target.dataset.key;
    if (!key) return;

    const nextProgress = getChecklistProgress();
    if (target.checked) {
      nextProgress[key] = true;
    } else {
      delete nextProgress[key];
    }

    saveChecklistProgress(nextProgress);
    updateChecklistSummary();
  });

  checklistGrid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const lessonLink = target.closest("[data-checklist-lesson]");
    if (lessonLink instanceof HTMLElement) {
      const lessonId = lessonLink.dataset.checklistLesson;
      const courseSection = document.getElementById("curso");
      if (lessonId && courseSection) {
        event.preventDefault();
        setLessonHash(lessonId);
        courseSection.scrollIntoView({ block: "start" });
      }
      if (lessonId && !courseSection) {
        event.preventDefault();
        window.location.href = `./curso.html#${new URLSearchParams({ leccion: lessonId }).toString()}`;
      }
      return;
    }

    const resetButton = target.closest("[data-reset-section]");
    if (!(resetButton instanceof HTMLElement)) return;

    const sectionId = resetButton.dataset.resetSection;
    if (!sectionId) return;

    const nextProgress = getChecklistProgress();
    Object.keys(nextProgress).forEach((key) => {
      if (key.startsWith(`${sectionId}:`)) delete nextProgress[key];
    });

    saveChecklistProgress(nextProgress);
    checklistGrid
      .querySelectorAll(`[data-checklist-section="${sectionId}"] .checklist__input`)
      .forEach((input) => {
        if (input instanceof HTMLInputElement) input.checked = false;
      });
    updateChecklistSummary();
  });

  updateChecklistSummary();
}

if (checklistResetAll) {
  checklistResetAll.addEventListener("click", () => {
    saveChecklistProgress({});
    if (checklistGrid) {
      checklistGrid.querySelectorAll(".checklist__input").forEach((input) => {
        if (input instanceof HTMLInputElement) input.checked = false;
      });
    }
    updateChecklistSummary();
  });
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  const listStack = [];

  function closeLists(targetDepth = 0) {
    while (listStack.length > targetDepth) {
      const list = listStack.pop();
      if (list.hasOpenItem) html.push("</li>");
      html.push(`</${list.type}>`);
    }
  }

  function ensureList(type, depth) {
    while (listStack.length > depth) closeLists(depth);

    const current = listStack[depth];
    if (!current || current.type !== type) {
      closeLists(depth);
      html.push(`<${type}>`);
      listStack.push({ type, hasOpenItem: false });
    }
  }

  function addListItem(type, depth, content) {
    ensureList(type, depth);

    const current = listStack[depth];
    if (current.hasOpenItem) html.push("</li>");
    html.push(`<li>${inlineMarkdown(content)}`);
    current.hasOpenItem = true;
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      closeLists();
      return;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      closeLists();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    const unorderedItem = /^(\s*)[-*]\s+(.+)$/.exec(line);
    if (unorderedItem) {
      const depth = Math.floor(unorderedItem[1].replace(/\t/g, "  ").length / 2);
      addListItem("ul", depth, unorderedItem[2].trim());
      return;
    }

    const orderedItem = /^(\s*)\d+\.\s+(.+)$/.exec(line);
    if (orderedItem) {
      const depth = Math.floor(orderedItem[1].replace(/\t/g, "  ").length / 2);
      addListItem("ol", depth, orderedItem[2].trim());
      return;
    }

    closeLists();
    html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  });

  closeLists();
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
  if (!course) return;

  const navHtml = course.modules
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

  [courseNav, courseDrawerNav].forEach((nav) => {
    if (!nav) return;
    nav.innerHTML = navHtml;
    nav.querySelectorAll(".course__lesson").forEach((link) => {
      link.addEventListener("click", closeCourseDrawer);
    });
  });
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
  renderChecklist();
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
