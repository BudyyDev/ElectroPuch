/* ElectroPuch – comportamiento común */
const WA = "34619808471", MAIL = "electropuch@gmail.com";

/* menú móvil */
const nav = document.getElementById('nav'), bg = document.getElementById('bg');
if (nav && bg) {
  bg.addEventListener('click', () => {
    const o = nav.classList.toggle('open');
    bg.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); bg.setAttribute('aria-expanded', false); }
  });
}

/* formulario de contacto */
const f = document.getElementById('f'), err = document.getElementById('err');
if (f) {
  const msg = () => {
    const d = new FormData(f);
    return `Hola ElectroPuch, soy ${d.get('n')}.\nServicio: ${d.get('s')}\nTeléfono: ${d.get('t')}\n${d.get('m') || ''}`;
  };
  const valid = () => {
    if (!f.n.value.trim() || !f.t.value.trim()) {
      err.textContent = 'Indica tu nombre y teléfono para poder contactarte.';
      return false;
    }
    err.textContent = '';
    return true;
  };
  f.addEventListener('submit', e => {
    e.preventDefault();
    if (valid()) window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg())}`, '_blank');
  });
  document.getElementById('mail').addEventListener('click', () => {
    if (valid()) location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Solicitud de presupuesto')}&body=${encodeURIComponent(msg())}`;
  });
  /* si llegas desde una subpágina (contacto.html?servicio=...) preselecciona el servicio */
  const s = new URLSearchParams(location.search).get('servicio');
  if (s) [...f.s.options].forEach(o => { if (o.value === s) f.s.value = s; });
}

/* evita que el acceso flotante tape el formulario en móviles */
const floatingWa = document.querySelector('.wa');
if (floatingWa && f && 'IntersectionObserver' in window) {
  const formObserver = new IntersectionObserver(([entry]) => {
    floatingWa.classList.toggle('over-form', entry.isIntersecting);
  });
  formObserver.observe(f);
}

/* carrusel de opiniones */
const reviewTrack = document.getElementById('review-track');
if (reviewTrack) {
  const reviewSlides = [...reviewTrack.querySelectorAll('.review-slide')];
  let activeReview = 0;
  let reviewTimer;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const showReview = index => {
    activeReview = (index + reviewSlides.length) % reviewSlides.length;
    reviewSlides.forEach((slide, i) => { slide.hidden = i !== activeReview; });
  };
  const pauseReviews = () => {
    window.clearInterval(reviewTimer);
    reviewTimer = undefined;
  };
  const startReviews = () => {
    if (reduceMotion.matches || document.hidden || reviewTimer || reviewSlides.length < 2) return;
    reviewTimer = window.setInterval(() => showReview(activeReview + 1), 5500);
  };
  reviewTrack.addEventListener('mouseenter', pauseReviews);
  reviewTrack.addEventListener('mouseleave', startReviews);
  reviewTrack.addEventListener('focusin', pauseReviews);
  reviewTrack.addEventListener('focusout', startReviews);
  document.addEventListener('visibilitychange', () => document.hidden ? pauseReviews() : startReviews());
  reduceMotion.addEventListener('change', () => reduceMotion.matches ? pauseReviews() : startReviews());
  startReviews();
}

/* cookies */
const ck = document.getElementById('ck');
if (ck) {
  try { if (localStorage.getItem('ck')) ck.hidden = true; } catch (e) {}
  ['ok', 'no'].forEach(i => document.getElementById(i).addEventListener('click', () => {
    ck.hidden = true;
    try { localStorage.setItem('ck', '1'); } catch (e) {}
  }));
}
