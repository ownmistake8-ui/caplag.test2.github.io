/**
 * script.js — общий скрипт сайта (particles + reveal + contact form -> Telegram Worker)
 * ВАЖНО: вставь URL воркера в ENDPOINT ниже.
 */

// =====================
// НАСТРОЙКИ
// =====================
const ENDPOINT = "https://hidden-brook-c1ca.ownmistake8.workers.dev/"; // <-- сюда URL Cloudflare Worker

// =====================
// Частицы (particles.js)
// =====================
function initParticles() {
  if (typeof particlesJS === "undefined") return;

  const container = document.getElementById("particles-js");
  if (!container) return;

  particlesJS("particles-js", {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 1000 } },
      color: { value: "#76ff03" },
      shape: { type: "circle" },
      opacity: { value: 0.3 },
      size: { value: 1.5 },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#76ff03",
        opacity: 0.1,
        width: 1,
      },
      move: { enable: true, speed: 1, out_mode: "out" },
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: false }, onclick: { enable: false } },
    },
    retina_detect: false,
  });
}

// =====================================
// Reveal-анимации при прокрутке (safe)
// =====================================
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  // Фоллбек для старых браузеров
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// =====================
// Контактная форма -> Worker -> Telegram
// =====================
function initContactForm() {
  // На всякий случай поддержим оба варианта:
  // 1) <form aria-label="Форма обратной связи" id="contact-form">
  // 2) просто <form id="contact-form">
  let form =
    document.querySelector('form#contact-form[aria-label]') ||
    document.querySelector("form#contact-form");

  // Если в HTML по ошибке вложены формы, querySelector может взять внешнюю.
  // Тогда попробуем найти "внутреннюю" форму с полями.
  if (form) {
    const hasFields =
      form.querySelector("#contact-name") &&
      form.querySelector("#contact-email") &&
      form.querySelector("#contact-message");

    if (!hasFields) {
      const inner = form.querySelector("form#contact-form");
      if (inner) form = inner;
    }
  }

  if (!form) return;

  const nameEl = document.getElementById("contact-name");
  const emailEl = document.getElementById("contact-email");
  const msgEl = document.getElementById("contact-message");
  const hpEl = document.getElementById("contact-website"); // honeypot (скрытое поле)

  const submitBtn = form.querySelector('button[type="submit"]');

  // Статус под формой (создаём, если нет)
  let statusEl = form.querySelector(".form-status");
  if (!statusEl) {
    statusEl = document.createElement("div");
    statusEl.className = "form-status";
    statusEl.style.marginTop = "10px";
    statusEl.style.fontSize = "0.95rem";
    form.appendChild(statusEl);
  }

  function setStatus(text, ok) {
    statusEl.textContent = text;
    statusEl.style.color = ok ? "#76ff03" : "#ff4d4d";
  }

  function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!ENDPOINT || ENDPOINT.includes("YOUR_WORKER")) {
      setStatus("Не задан ENDPOINT (URL воркера) в script.js", false);
      return;
    }

    const name = (nameEl?.value || "").trim();
    const email = (emailEl?.value || "").trim();
    const message = (msgEl?.value || "").trim();
    const website = (hpEl?.value || "").trim(); // honeypot

    // Клиентская валидация
    if (name.length < 2) return setStatus("Введите имя (минимум 2 символа).", false);
    if (!isEmail(email)) return setStatus("Введите корректный email.", false);
    if (message.length > 1500) return setStatus("Сообщение слишком длинное.", false);

    try {
      if (submitBtn) submitBtn.disabled = true;
      setStatus("Отправляем...", true);

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("Отправлено ✅", true);
        form.reset();
      } else if (res.status === 429) {
        setStatus("Слишком часто. Подождите минуту и попробуйте снова.", false);
      } else if (data && data.error) {
        setStatus("Ошибка: " + data.error, false);
      } else {
        setStatus("Не удалось отправить. Попробуйте позже.", false);
      }
    } catch (err) {
      setStatus("Ошибка сети. Попробуйте ещё раз.", false);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// =====================
// Инициализация
// =====================
document.addEventListener("DOMContentLoaded", function () {
  initParticles();
  initRevealAnimations();
  initContactForm();
});
