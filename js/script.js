/* ════════════ CURSOR ════════════ */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function animTrail() {
  tx += (mx - tx) * .12;
  ty += (my - ty) * .12;
  trail.style.left = tx + 'px';
  trail.style.top  = ty + 'px';
  requestAnimationFrame(animTrail);
})();

document.querySelectorAll('a,button,.project-row,.chip').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    cursor.style.opacity = '.5';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.opacity = '1';
  });
});

/* ════════════ ORB PARTICLES ════════════ */
const orbWrap = document.getElementById('orbParticles');
if (orbWrap) {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    const angle = Math.random() * 360;
    const dist  = 80 + Math.random() * 100;
    const size  = 1.5 + Math.random() * 3;
    const dur   = 3 + Math.random() * 4;
    const delay = Math.random() * -6;
    p.style.cssText = `
      position:absolute; border-radius:50%;
      width:${size}px; height:${size}px;
      background:rgba(245,166,35,${.2 + Math.random()*.4});
      top:50%; left:50%;
      animation: orbP${i} ${dur}s ${delay}s ease-in-out infinite;
      box-shadow:0 0 ${size*2}px rgba(245,166,35,.5);
    `;
    const rad = angle * Math.PI / 180;
    const x = Math.cos(rad) * dist;
    const y = Math.sin(rad) * dist;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes orbP${i} {
        0%,100%{transform:translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1); opacity:.6;}
        50%{transform:translate(calc(-50% + ${x * 1.15}px), calc(-50% + ${y * 1.15}px)) scale(1.4); opacity:1;}
      }
    `;
    document.head.appendChild(style);
    orbWrap.appendChild(p);
  }
}

/* ════════════ PAGE NAVIGATION ════════════ */
const pages = document.querySelectorAll('.page');

function goTo(pageId) {
  const current = document.querySelector('.page.active');
  const next    = document.getElementById('page-' + pageId);
  if (!next || current === next) return;

  current.classList.add('exit');
  setTimeout(() => {
    current.classList.remove('active', 'exit');
    next.classList.add('active');
    triggerPageEffects(pageId);
  }, 300);

  // Sync all pill navs
  document.querySelectorAll('.pill-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === pageId);
  });
}

document.querySelectorAll('.pill-btn').forEach(btn => {
  btn.addEventListener('click', () => goTo(btn.dataset.page));
});

/* ════════════ PAGE EFFECTS ON ENTER ════════════ */
function triggerPageEffects(pageId) {
  if (pageId === 'skills') animateBars();
  if (pageId === 'summary') animateCounters();
}

/* ════════════ SKILL BARS ════════════ */
function animateBars() {
  document.querySelectorAll('.sbl-fill').forEach(bar => {
    bar.style.width = bar.dataset.w + '%';
  });
}

/* ════════════ COUNTERS ════════════ */
function animateCounters() {
  document.querySelectorAll('.stat-val[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let start = null;
    const dur = 1600;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ════════════ PROJECT DETAIL ════════════ */
const projects = {
  stockbot: {
    icon: '<i class="fas fa-chart-bar"></i>',
    title: 'StockBot',
    type: 'Multi-Agent RAG · Web Application',
    about: 'Multi-agent stock research assistant built with LangChain and Gemini API. Fetches live financial data, runs multi-step reasoning across agents, and delivers structured investment insights via a conversational Flask interface.',
    achieve: 'Reduced manual research time by automating data fetching, summarization, and comparative analysis across multiple stocks in a single query.',
    tags: ['LangChain', 'Multi-Agent', 'RAG', 'Gemini API', 'Flask', 'Python']
  },
  signtalk: {
    icon: '<i class="fas fa-hands"></i>',
    title: 'SignTalkAI',
    type: 'Computer Vision · Real-time Inference',
    about: 'Real-time sign language translation system using CNN and MediaPipe. Processes live webcam feed via threaded frame acquisition, decoupled preprocessing from inference, and streams results via MJPEG in under 100ms.',
    achieve: 'Achieved sub-100ms end-to-end inference on consumer hardware (RTX 3050 6GB) with a threaded pipeline that eliminated frame drop artifacts.',
    tags: ['CNN', 'MediaPipe', 'OpenCV', 'TensorFlow', 'Flask', 'MJPEG']
  },
  medllm: {
    icon: '<i class="fas fa-heartbeat"></i>',
    title: 'MedLLM',
    type: 'LLM Fine-tuning · Medical Domain',
    about: 'Fine-tuned LLaMA 3.2 3B on a curated medical Q&A dataset using PEFT and QLoRA (4-bit quantization, LoRA R=8 A=16, gradient accumulation=16). Deployed via Gradio interface. Runs entirely on 4GB VRAM consumer hardware.',
    achieve: 'Demonstrated that domain-specific fine-tuning on a 3B parameter model with QLoRA can match much larger general-purpose LLMs on targeted medical Q&A tasks.',
    tags: ['LLaMA 3.2', 'PEFT', 'QLoRA', 'BitsAndBytes', 'Gradio', 'HuggingFace']
  },
  spam: {
    icon: '<i class="fas fa-shield-alt"></i>',
    title: 'Spam Email Classifier',
    type: 'NLP · Classification Pipeline',
    about: 'End-to-end NLP pipeline for email classification using TF-IDF vectorization and ensemble ML models. Optimized specifically for precision to minimize false positives on legitimate email.',
    achieve: 'Achieved high precision rate on the test set, ensuring critical emails are never incorrectly flagged as spam.',
    tags: ['NLP', 'TF-IDF', 'Scikit-learn', 'Ensemble ML', 'Python']
  },
  marks: {
    icon: '<i class="fas fa-graduation-cap"></i>',
    title: 'Student Marks Predictor',
    type: 'Regression · ML · Flask',
    about: 'Regression model predicting student academic performance from behavioral and academic input features. Includes full EDA, feature engineering pipeline, and a Flask-based prediction interface.',
    achieve: 'Built a complete ML pipeline from raw data to deployed prediction interface, demonstrating end-to-end ML project execution.',
    tags: ['Regression', 'EDA', 'Feature Engineering', 'Pandas', 'Flask', 'Scikit-learn']
  }
};

const overlay   = document.getElementById('detailOverlay');
const detailBack = document.getElementById('detailBack');

document.querySelectorAll('.project-row[data-detail]').forEach(row => {
  row.addEventListener('click', () => {
    const d = projects[row.dataset.detail];
    if (!d) return;
    document.getElementById('detailIcon').innerHTML   = d.icon;
    document.getElementById('detailTitle').textContent = d.title;
    document.getElementById('detailType').textContent  = d.type;
    document.getElementById('detailAbout').textContent = d.about;
    document.getElementById('detailAchieve').textContent = d.achieve;
    document.getElementById('detailTags').innerHTML =
      d.tags.map(t => `<span>${t}</span>`).join('');
    overlay.classList.add('open');
  });
});

detailBack.addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

/* ════════════ CONTACT FORM ════════════ */
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg   = document.getElementById('fmsg').value.trim();
    if (!name || !email || !msg) {
      note.style.color = '#f87171';
      note.textContent = 'Fill in all fields.';
      return;
    }
    const mailto = `mailto:aryanpatil2903@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`)}`;
    window.location.href = mailto;
    note.style.color = 'var(--amber)';
    note.textContent = '✓ Opening mail client...';
    form.reset();
    setTimeout(() => note.textContent = '', 4000);
  });
}

/* ════════════ DOWNLOAD CV ════════════ */
function downloadCV() {
  window.open('AryanPatil_Resume.pdf');
}