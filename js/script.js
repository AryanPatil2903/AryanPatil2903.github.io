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
  var specCards = document.querySelectorAll('.spec-card');
  if ('IntersectionObserver' in window) {
    var bo = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.sbr-fill').forEach(function(b) {
            b.style.width = (b.getAttribute('data-w') || 0) + '%';
          });
          bo.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    specCards.forEach(function(c) { bo.observe(c); });
  } else {
    document.querySelectorAll('.sbr-fill').forEach(function(b) {
      b.style.width = (b.getAttribute('data-w') || 0) + '%';
    });
  }

  /* ── RACING STAT COUNTERS ── */
  var statsBox = document.querySelector('.racing-stats');
  var counted  = false;
  if (statsBox && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting && !counted) {
          counted = true;

          /* Animate fill bars */
          statsBox.querySelectorAll('.rstat-fill').forEach(function(f) {
            f.style.width = (f.getAttribute('data-w') || 0) + '%';
          });

          /* Animate number counters */
          var defs = [
            { idx: 0, target: 5,   suffix: '+' },
            { idx: 1, target: 3,   suffix: 'B' },
            { idx: 2, target: 4,   suffix: 'GB' }
          ];
          var nums = statsBox.querySelectorAll('.rstat-num[data-count]');
          defs.forEach(function(d) {
            var el = nums[d.idx];
            if (!el) return;
            var start = null;
            var dur   = 1600;
            function step(ts) {
              if (!start) start = ts;
              var p    = Math.min((ts - start) / dur, 1);
              var ease = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.floor(ease * d.target) + d.suffix;
              if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          });

          so.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    so.observe(statsBox);
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
        note.style.color = '#e2001a';
        note.textContent = 'FILL IN ALL FIELDS.';
        return;
      }
      var subject = 'Job Opportunity from ' + encodeURIComponent(n);
      var body    = encodeURIComponent('Name: ' + n + '\nEmail: ' + em + '\n\nMessage:\n' + m);
      window.location.href = 'mailto:aryanpatil2903@gmail.com?subject=' + subject + '&body=' + body;
      note.style.color = '#1c69d4';
      note.textContent = '✓ OPENING MAIL CLIENT...';
      form.reset();
      setTimeout(function() { note.textContent = ''; }, 4000);
    });
  }

});
