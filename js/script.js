/* ══ NOISE CANVAS ══ */
const nc = document.getElementById('noise-canvas');
const nctx = nc.getContext('2d');
function resizeNoise() { nc.width = window.innerWidth; nc.height = window.innerHeight; }
resizeNoise();
window.addEventListener('resize', resizeNoise);
function drawNoise() {
  const id = nctx.createImageData(nc.width, nc.height);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = Math.random() * 255 | 0;
    id.data[i] = id.data[i+1] = id.data[i+2] = v;
    id.data[i+3] = 255;
  }
  nctx.putImageData(id, 0, 0);
  setTimeout(() => requestAnimationFrame(drawNoise), 80);
}
drawNoise();

/* ══ CURSOR ══ */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
(function animT() {
  tx += (mx - tx) * .1; ty += (my - ty) * .1;
  trail.style.left = tx + 'px'; trail.style.top = ty + 'px';
  requestAnimationFrame(animT);
})();
document.querySelectorAll('a,button,.glow-card,.chips-wrap span').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
    cursor.style.opacity = '.4';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.opacity = '1';
  });
});

/* ══ NAVBAR SCROLL ══ */
const navbar = document.getElementById('navbar');
const navAnchors = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 160) cur = s.id; });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

/* ══ HAMBURGER ══ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
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

/* ══ SCROLL REVEAL ══ */
const revealEls = document.querySelectorAll(
  '.bento-card,.skill-hero-card,.skill-card-sm,.all-chips,.step-card,.edu-card,.hero-meta-strip,.trust-strip'
);
const ro = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => { el.classList.add('reveal'); ro.observe(el); });

/* ══ SKILL BARS ══ */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sb-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-hero-card,.skill-card-sm').forEach(c => barObs.observe(c));

/* ══ COUNTER STATS ══ */
function animCount(el, target, suffix, dur = 1600) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.innerHTML = Math.floor(ease * target) + `<span class="rust-text">${suffix}</span>`;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.hms-val[data-target]').forEach(el => {
        animCount(el, +el.dataset.target, el.dataset.suffix || '');
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const strip = document.querySelector('.hero-meta-strip');
if (strip) statsObs.observe(strip);

// Set data attributes for counters
document.querySelectorAll('.hms-val').forEach(el => {
  const txt = el.textContent.trim();
  if (txt.startsWith('<')) { el.dataset.target = 100; el.dataset.suffix = 'ms'; el.innerHTML = '&lt;100<span class="rust-text">ms</span>'; return; }
  const num = parseFloat(txt);
  const suf = txt.replace(/[\d.<]/g,'').trim();
  if (!isNaN(num)) { el.dataset.target = num; el.dataset.suffix = suf; }
});

/* ══ CONTACT FORM ══ */
const form = document.getElementById('ctaForm');
const note = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = document.getElementById('cname').value.trim();
    const em = document.getElementById('cemail').value.trim();
    const m = document.getElementById('cmsg').value.trim();
    if (!n || !em || !m) { note.style.color='#f87171'; note.textContent='Fill in all fields.'; return; }
    window.location.href = `mailto:aryanpatil2903@gmail.com?subject=Job Opportunity from ${encodeURIComponent(n)}&body=${encodeURIComponent(`Name: ${n}\nEmail: ${em}\n\nMessage:\n${m}`)}`;
    note.style.color = 'var(--rust3)';
    note.textContent = '✓ Opening mail client...';
    form.reset();
    setTimeout(() => note.textContent = '', 4000);
  });
}
