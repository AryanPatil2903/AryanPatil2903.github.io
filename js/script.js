document.addEventListener('DOMContentLoaded', () => {

/* ══ NOISE CANVAS ══ */
const nc = document.getElementById('noise-canvas');
if (nc) {
  const nctx = nc.getContext('2d');
  function resizeNoise() {
    nc.width = window.innerWidth;
    nc.height = window.innerHeight;
  }
  resizeNoise();
  window.addEventListener('resize', resizeNoise);
  let noiseFrame;
  function drawNoise() {
    const id = nctx.createImageData(nc.width, nc.height);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      id.data[i] = id.data[i+1] = id.data[i+2] = v;
      id.data[i+3] = 255;
    }
    nctx.putImageData(id, 0, 0);
    noiseFrame = setTimeout(() => requestAnimationFrame(drawNoise), 120);
  }
  drawNoise();
}

/* ══ CURSOR (desktop only) ══ */
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');

if (!isTouchDevice && cursor && trail) {
  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function animT() {
    tx += (mx - tx) * .1;
    ty += (my - ty) * .1;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animT);
  })();
  document.querySelectorAll('a, button, .glow-card, .chips-wrap span').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
      cursor.style.opacity = '.4';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.opacity = '1';
    });
  });
} else {
  // Touch device — hide cursor elements, restore pointer
  if (cursor) cursor.style.display = 'none';
  if (trail)  trail.style.display  = 'none';
  document.body.style.cursor = 'auto';
}

/* ══ NAVBAR SCROLL ══ */
const navbar     = document.getElementById('navbar');
const navAnchors = document.querySelectorAll('.nav-links a');
const sections   = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 160) cur = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });

/* ══ HAMBURGER ══ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ══ SCROLL REVEAL ══ */
const revealTargets = document.querySelectorAll(
  '.bento-card, .skill-hero-card, .skill-card-sm, .all-chips, ' +
  '.step-card, .edu-card, .hero-meta-strip, .trust-strip'
);

if ('IntersectionObserver' in window) {
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });

  revealTargets.forEach(el => {
    el.classList.add('reveal');
    ro.observe(el);
  });
} else {
  // Fallback: just show everything
  revealTargets.forEach(el => el.classList.add('visible'));
}

/* ══ SKILL BARS ══ */
const barTargets = document.querySelectorAll('.skill-hero-card, .skill-card-sm');

if ('IntersectionObserver' in window) {
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sb-fill').forEach(b => {
          b.style.width = (b.dataset.w || '0') + '%';
        });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  barTargets.forEach(c => barObs.observe(c));
} else {
  document.querySelectorAll('.sb-fill').forEach(b => {
    b.style.width = (b.dataset.w || '0') + '%';
  });
}

/* ══ HERO STAT COUNTERS ══ */
function animCount(el, target, prefix, suffix, dur) {
  dur = dur || 1600;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(ease * target);
    el.innerHTML = prefix + val + '<span class="rust-text">' + suffix + '</span>';
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Manually define each counter — no regex parsing
const counterDefs = [
  { selector: '.hms-item:nth-child(1) .hms-val', prefix: '',   target: 5,   suffix: '+' },
  { selector: '.hms-item:nth-child(3) .hms-val', prefix: '',   target: 3,   suffix: 'B' },
  { selector: '.hms-item:nth-child(5) .hms-val', prefix: '',   target: 4,   suffix: 'GB' },
  { selector: '.hms-item:nth-child(7) .hms-val', prefix: '<',  target: 100, suffix: 'ms' },
];

const strip = document.querySelector('.hero-meta-strip');
if (strip && 'IntersectionObserver' in window) {
  let counted = false;
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !counted) {
        counted = true;
        counterDefs.forEach(def => {
          const el = document.querySelector(def.selector);
          if (el) animCount(el, def.target, def.prefix, def.suffix);
        });
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  statsObs.observe(strip);
}

/* ══ CONTACT FORM ══ */
const form = document.getElementById('ctaForm');
const note = document.getElementById('formNote');

if (form && note) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n  = (document.getElementById('cname')  || {}).value || '';
    const em = (document.getElementById('cemail') || {}).value || '';
    const m  = (document.getElementById('cmsg')   || {}).value || '';

    if (!n.trim() || !em.trim() || !m.trim()) {
      note.style.color = '#f87171';
      note.textContent = 'Please fill in all fields.';
      return;
    }

    const subject = 'Job Opportunity from ' + encodeURIComponent(n.trim());
    const body    = encodeURIComponent(
      'Name: ' + n.trim() + '\nEmail: ' + em.trim() + '\n\nMessage:\n' + m.trim()
    );
    window.location.href = 'mailto:aryanpatil2903@gmail.com?subject=' + subject + '&body=' + body;

    note.style.color = 'var(--rust3)';
    note.textContent = '✓ Opening mail client...';
    form.reset();
    setTimeout(() => { note.textContent = ''; }, 4000);
  });
}

}); // end DOMContentLoaded
