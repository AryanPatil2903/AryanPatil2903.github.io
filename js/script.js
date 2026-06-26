document.addEventListener('DOMContentLoaded', function() {

  /* ── NAVBAR ── */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    var cur = '';
    document.querySelectorAll('section[id]').forEach(function(s) {
      if (window.scrollY >= s.offsetTop - 160) cur = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(function(a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  }, { passive: true });

  /* ── HAMBURGER ── */
  var hb = document.getElementById('hamburger');
  var nl = document.getElementById('navLinks');
  if (hb && nl) {
    hb.addEventListener('click', function() {
      hb.classList.toggle('open');
      nl.classList.toggle('open');
    });
    nl.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        hb.classList.remove('open');
        nl.classList.remove('open');
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function(entries) {
      entries.forEach(function(e, i) {
        if (e.isIntersecting) {
          setTimeout(function() { e.target.classList.add('visible'); }, i * 70);
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.06 });
    reveals.forEach(function(el) { ro.observe(el); });
  } else {
    reveals.forEach(function(el) { el.classList.add('visible'); });
  }

  /* ── SKILL BARS ── */
  var skillSections = document.querySelectorAll('.skill-main, .sk-card');
  if ('IntersectionObserver' in window) {
    var bo = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.sk-fill').forEach(function(b) {
            b.style.width = (b.getAttribute('data-w') || 0) + '%';
          });
          bo.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    skillSections.forEach(function(c) { bo.observe(c); });
  } else {
    document.querySelectorAll('.sk-fill').forEach(function(b) {
      b.style.width = (b.getAttribute('data-w') || 0) + '%';
    });
  }

  /* ── CONTACT FORM ── */
  var form = document.getElementById('cform');
  var note = document.getElementById('fnote');
  if (form && note) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var n  = document.getElementById('cname').value.trim();
      var em = document.getElementById('cemail').value.trim();
      var m  = document.getElementById('cmsg').value.trim();
      if (!n || !em || !m) {
        note.style.color = '#e63329';
        note.textContent = 'Please fill in all fields.';
        return;
      }
      var subject = 'Job Opportunity from ' + encodeURIComponent(n);
      var body    = encodeURIComponent('Name: ' + n + '\nEmail: ' + em + '\n\nMessage:\n' + m);
      window.location.href = 'mailto:aryanpatil2903@gmail.com?subject=' + subject + '&body=' + body;
      note.style.color = '#0066FF';
      note.textContent = '✓ Opening mail client...';
      form.reset();
      setTimeout(function() { note.textContent = ''; }, 4000);
    });
  }

});
