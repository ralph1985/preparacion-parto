const HEADER_SCROLL_OFFSET = 120;
const SECTION_ACTIVE_OFFSET = 90;

const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav__link");
const sections = document.querySelectorAll("section[id]");
const header = document.getElementById("header");
const courseDrawer = document.getElementById("course-drawer");
const courseDrawerOpenButtons = document.querySelectorAll(
  "[data-course-drawer-open]",
);
const courseDrawerClose = document.getElementById("course-drawer-close");
const searchOpenButtons = document.querySelectorAll("[data-search-open]");
const checklistGrid = document.getElementById("checklist-grid");
const checklistTotal = document.getElementById("checklist-total");
const checklistResetAll = document.getElementById("checklist-reset-all");

const CHECKLIST_STORAGE_KEY = "preparacion-parto-checklist-v1";

const checklistSections = [
  {
    id: "antes-parto",
    title: "Antes del parto",
    lessonId: "final-embarazo",
    items: [
      {
        id: "dudas-equipo",
        text: "Anotar dudas para matrona, ginecología o equipo sanitario.",
        review: true,
      },
      {
        id: "descanso-hidratacion",
        text: "Revisar descanso, hidratación, movimiento suave y comidas fáciles.",
      },
      {
        id: "acompanante",
        text: "Acordar el papel del acompañante durante espera, traslado y hospital.",
      },
      {
        id: "perine",
        text: "Confirmar medidas seguras de cuidado del periné con profesionales.",
        review: true,
      },
    ],
  },
  {
    id: "salida-hospital",
    title: "Señales y salida al hospital",
    lessonId: "senales-parto",
    items: [
      {
        id: "regla-contracciones",
        text: "Tener clara la regla orientativa de contracciones indicada por el centro.",
        review: true,
      },
      {
        id: "alarma-embarazo",
        text: "Revisar señales de alarma: sangrado, fiebre, dolor continuo, bolsa no clara o menos movimientos.",
        review: true,
      },
      {
        id: "telefono-matronas",
        text: "Guardar el teléfono de asistencia o urgencias del centro de referencia.",
      },
      {
        id: "ruta-urgencias",
        text: "Confirmar por dónde entrar el día del parto y cómo llegar.",
      },
    ],
  },
  {
    id: "bolsa-hospital",
    title: "Bolsa hospital",
    lessonId: "bolsa-hospital",
    items: [
      {
        id: "documentacion",
        text: "Preparar DNI, tarjeta sanitaria, historia del embarazo y documentación familiar si aplica.",
      },
      {
        id: "madre",
        text: "Preparar bolsa de la madre: ropa de salida, aseo, zapatillas, bragas, agua/snacks permitidos y apoyo para el dolor.",
      },
      {
        id: "acompanante",
        text: "Preparar bolsa del acompañante: comida, bebida, abrigo o sudadera, cargador y ropa cómoda.",
      },
      {
        id: "bebe",
        text: "Preparar bolsa del bebé: ropa de alta, gorrito, manta, pañales, muselinas y básicos de higiene.",
      },
      {
        id: "tecnologia",
        text: "Cargar móviles, preparar cargadores, powerbank, cascos y música offline.",
      },
      {
        id: "coche",
        text: "Dejar coche listo con gasolina y sillita instalada.",
      },
    ],
  },
  {
    id: "plan-parto",
    title: "Plan de parto",
    lessonId: "plan-parto",
    items: [
      {
        id: "preferencias",
        text: "Revisar preferencias de acompañamiento, movilidad, ambiente y alivio del dolor.",
      },
      {
        id: "cesarea",
        text: "Anotar preferencias si hay cesárea o separación madre-bebé.",
      },
      {
        id: "piel-cordon",
        text: "Confirmar piel con piel, clampaje del cordón y lactancia inicial según situación clínica.",
        review: true,
      },
      {
        id: "documento",
        text: "Imprimir o guardar el plan de parto en el móvil.",
      },
    ],
  },
  {
    id: "primeras-horas",
    title: "Primeras horas",
    lessonId: "primeras-horas",
    items: [
      {
        id: "piel-piel",
        text: "Priorizar piel con piel si madre y bebé están bien.",
        review: true,
      },
      {
        id: "primera-toma",
        text: "Pedir ayuda para primera toma o agarre si se desea lactancia.",
      },
      {
        id: "revisiones",
        text: "Preguntar qué revisiones o pruebas se harán al bebé y cuándo.",
      },
      {
        id: "recuperacion",
        text: "Avisar si hay mareo, dolor importante, sangrado llamativo o inseguridad al levantarse.",
        review: true,
      },
    ],
  },
  {
    id: "postparto-casa",
    title: "Postparto en casa",
    lessonId: "organizacion-casa",
    items: [
      {
        id: "comida",
        text: "Dejar compra inicial o comidas sencillas preparadas.",
      },
      {
        id: "visitas",
        text: "Acordar límites de visitas y quién comunica esos límites.",
      },
      {
        id: "tareas",
        text: "Repartir tareas domésticas, compra, descanso y cuidado del bebé.",
      },
      {
        id: "zona-descanso",
        text: "Preparar zona de descanso, lactancia o alimentación, compresas y ropa cómoda.",
      },
      {
        id: "alarma-postparto",
        text: "Revisar señales de alarma físicas y emocionales para consultar pronto.",
        review: true,
      },
    ],
  },
  {
    id: "lactancia",
    title: "Lactancia y alimentación",
    lessonId: "lactancia",
    items: [
      {
        id: "agarre",
        text: "Pedir ayuda temprana si hay dolor, grietas, mal agarre o dudas con tomas.",
      },
      {
        id: "demanda",
        text: "Tener presentes libre demanda, piel con piel y señales de hambre/saciedad.",
      },
      {
        id: "sin-agua",
        text: "Recordar que el recién nacido no debe tomar agua salvo indicación profesional.",
        review: true,
      },
      {
        id: "formula",
        text: "Si se usa fórmula, seguir instrucciones del envase y pediatría/matrona.",
        review: true,
      },
      {
        id: "apoyos",
        text: "Guardar recursos de lactancia, grupo de apoyo o teléfono del centro.",
      },
    ],
  },
  {
    id: "cuidados-bebe",
    title: "Cuidados del bebé",
    lessonId: "cuidados-bebe",
    items: [
      {
        id: "cordon",
        text: "Revisar cuidados del cordón y signos de infección con pediatría/matrona.",
        review: true,
      },
      {
        id: "sueno",
        text: "Preparar un entorno de sueño seguro según recomendaciones actuales.",
        review: true,
      },
      {
        id: "temperatura",
        text: "Tener termómetro y criterios claros para consultar por fiebre o mal estado.",
        review: true,
      },
      {
        id: "panales",
        text: "Observar pañales, alimentación y comportamiento general del bebé.",
      },
    ],
  },
  {
    id: "tramites-contactos",
    title: "Trámites y contactos",
    lessonId: "tramites-postparto",
    items: [
      {
        id: "alta-bebe",
        text: "Revisar alta del bebé, tarjeta sanitaria, pediatra y beneficiario en Seguridad Social.",
      },
      {
        id: "permisos",
        text: "Revisar permisos, prestaciones y posibles ayudas con sus plazos.",
      },
      {
        id: "contactos",
        text: "Guardar teléfonos útiles: urgencias, matronas, pediatría y apoyo familiar.",
      },
      { id: "citas", text: "Anotar revisiones de madre y bebé tras el alta." },
    ],
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

function openSearchModal() {
  const modal = document.getElementById("pagefind-search");
  if (!modal) return;

  if (typeof modal.showModal === "function") {
    modal.showModal();
    return;
  }

  if (typeof modal.show === "function") {
    modal.show();
    return;
  }

  modal.setAttribute("open", "");
}

function setMenuOpen(isOpen) {
  if (!navMenu || !navToggle) return;

  navMenu.classList.toggle("show-menu", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
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
    window.localStorage.setItem(
      CHECKLIST_STORAGE_KEY,
      JSON.stringify(progress),
    );
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
  const completed = checklistGrid.querySelectorAll(
    ".checklist__input:checked",
  ).length;
  checklistTotal.textContent = `${completed} de ${checkboxes.length}`;

  checklistSections.forEach((section) => {
    const sectionCard = checklistGrid.querySelector(
      `[data-checklist-section="${section.id}"]`,
    );
    if (!sectionCard) return;

    const sectionInputs = sectionCard.querySelectorAll(".checklist__input");
    const sectionCompleted = sectionCard.querySelectorAll(
      ".checklist__input:checked",
    ).length;
    const sectionCount = sectionCard.querySelector(".checklist__count");
    if (sectionCount)
      sectionCount.textContent = `${sectionCompleted}/${sectionInputs.length}`;
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
            <a href="/curso/${escapeHtml(section.lessonId)}/">Ver apuntes</a>
            <button type="button" data-reset-section="${escapeHtml(section.id)}">Reiniciar</button>
          </div>
        </article>
      `;
    })
    .join("");

  updateChecklistSummary();
}

function updateActiveSection() {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - SECTION_ACTIVE_OFFSET;
    const sectionId = section.getAttribute("id");
    const sectionLink = document.querySelector(
      `.nav__menu a[href="/#${sectionId}"]`,
    );

    if (!sectionLink) return;

    sectionLink.classList.toggle(
      "active-link",
      scrollY > sectionTop && scrollY <= sectionTop + sectionHeight,
    );
  });
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle(
    "scroll-header",
    window.scrollY >= HEADER_SCROLL_OFFSET,
  );
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
    if (
      target instanceof Node &&
      !navMenu.contains(target) &&
      !navToggle.contains(target)
    ) {
      setMenuOpen(false);
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

courseDrawerOpenButtons.forEach((button) => {
  button.addEventListener("click", openCourseDrawer);
});

searchOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMenuOpen(false);
    openSearchModal();
  });
});

if (courseDrawerClose) {
  courseDrawerClose.addEventListener("click", closeCourseDrawer);
}

if (courseDrawer) {
  courseDrawer.addEventListener("click", (event) => {
    if (event.target === courseDrawer) closeCourseDrawer();
  });
}

if (checklistGrid) {
  checklistGrid.addEventListener("change", (event) => {
    const target = event.target;
    if (
      !(target instanceof HTMLInputElement) ||
      !target.matches(".checklist__input")
    )
      return;

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
      .querySelectorAll(
        `[data-checklist-section="${sectionId}"] .checklist__input`,
      )
      .forEach((input) => {
        if (input instanceof HTMLInputElement) input.checked = false;
      });
    updateChecklistSummary();
  });
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

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("load", () => {
  requestScrollUpdate();
  renderChecklist();
});

if (window.AOS) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.AOS.init({
    once: true,
    delay: 0,
    duration: reduceMotion ? 0 : 420,
    disable: reduceMotion,
  });
}
