
// Año dinámico + scroll suave + scroll reveal + glow dinámico
document.addEventListener('DOMContentLoaded', function () {
  // Año dinámico
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Scroll suave para anclas internas
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Scroll reveal suave
  const revealSelector = '.hero-section, .hero-card, .local-card, .step-card, .contact-strip';
  const revealElements = document.querySelectorAll(revealSelector);

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target); // solo una vez
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -10% 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // Glow dinámico que sigue al mouse / dedo
  const root = document.documentElement;
  let cursorTimeout;

  function setGlowPosition(xPx, yPx) {
    const x = (xPx / window.innerWidth) * 100;
    const y = (yPx / window.innerHeight) * 100;
    root.style.setProperty('--cursor-x', `${x}%`);
    root.style.setProperty('--cursor-y', `${y}%`);
  }

  function activateGlow() {
    root.style.setProperty('--cursor-active', '1');
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(() => {
      root.style.setProperty('--cursor-active', '0');
    }, 1500);
  }

  // Desktop: mousemove
  window.addEventListener('mousemove', (e) => {
    setGlowPosition(e.clientX, e.clientY);
    activateGlow();
  });

  // Móvil / táctil: touchstart + touchmove
  function handleTouch(e) {
    const touch = e.touches[0];
    if (!touch) return;
    setGlowPosition(touch.clientX, touch.clientY);
    activateGlow();
  }

  window.addEventListener('touchstart', handleTouch, { passive: true });
  window.addEventListener('touchmove', handleTouch, { passive: true });
});
