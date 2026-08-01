// ── CURSOR ────────────────────────────────────────────
(function initCursor(){
  const cursor = document.getElementById('cursor');
  const follow = document.getElementById('cursor-follow');
  const cursorLabel = document.getElementById('cursor-label');
  if (!cursor) return;

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer) {
    cursor.style.display = 'none';
    if (follow) follow.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let cx = 0, cy = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    if (cursorLabel) {
      cursorLabel.style.left = cx + 'px';
      cursorLabel.style.top = cy + 'px';
    }
  });

  function animateCursorFollow() {
    if (!follow) return;
    fx += (cx - fx) * 0.16;
    fy += (cy - fy) * 0.16;
    follow.style.left = fx + 'px';
    follow.style.top = fy + 'px';
    requestAnimationFrame(animateCursorFollow);
  }
  animateCursorFollow();

  document.querySelectorAll('.project-window, .project-card, .btn-solid, .btn-ghost, .contact-link, .nav-link, .nav-cta, .cs-back-link, .cs-next, .nav-logo').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover-state');
      if (cursorLabel) {
        cursorLabel.style.opacity = el.classList.contains('project-window') || el.classList.contains('project-card') ? '1' : '0';
        cursorLabel.textContent = 'OPEN';
      }
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover-state');
      if (cursorLabel) cursorLabel.style.opacity = '0';
    });
  });
})();

// ── TYPEWRITER ────────────────────────────────────────
(function initTypewriter(){
  const el = document.getElementById('typeTarget');
  if (!el) return;
  const full = 'PRODUCT DESIGN · UX RESEARCH';
  let i = 0;
  el.textContent = '';
  function tick() {
    if (i <= full.length) {
      el.textContent = full.slice(0, i) + (i % 2 === 0 ? '_' : '');
      i++;
      setTimeout(tick, 42 + Math.random() * 36);
    } else {
      el.textContent = full + '_';
      setInterval(() => {
        el.textContent = el.textContent.endsWith('_') ? full + ' ' : full + '_';
      }, 530);
    }
  }
  setTimeout(tick, 400);
})();

// ── NAV ACTIVE STATE ──────────────────────────────────
(function initNav(){
  const nav = document.getElementById('nav');
  if (!nav) return;

  const links = [...nav.querySelectorAll('.nav-link[data-nav]')];
  const map = {
    home: document.getElementById('hero'),
    work: document.getElementById('work'),
    about: document.getElementById('about'),
    skills: document.getElementById('skills')
  };

  function setActive(key) {
    links.forEach(link => {
      const label = link.dataset.label || 'Home';
      if (link.dataset.nav === key) {
        link.classList.add('is-active');
        link.textContent = `< ${label} >`;
      } else {
        link.classList.remove('is-active');
        link.textContent = label;
      }
    });
  }

  links.forEach(link => {
    link.dataset.label = link.textContent.replace(/[<>]/g, '').trim();
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const order = ['skills', 'about', 'work', 'home'];
    for (const key of order) {
      const el = map[key];
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= 90) {
        setActive(key === 'home' ? 'home' : key);
        return;
      }
    }
    setActive('home');
  }, { passive: true });
})();

// ── SCROLL REVEAL ─────────────────────────────────────
(function initReveal(){
  const revealEls = document.querySelectorAll('.reveal, .cs-section, .skill-block');
  if (!revealEls.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.skill-bar span').forEach(bar => {
          bar.style.width = getComputedStyle(bar).getPropertyValue('--w') || bar.style.getPropertyValue('--w');
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => obs.observe(el));
})();

// ── FUNNEL ANIMATION ──────────────────────────────────
(function initFunnel(){
  const funnelSection = document.getElementById('funnelSection');
  if (!funnelSection) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        funnelSection.querySelectorAll('.funnel-bar').forEach((bar, i) => {
          const pct = bar.dataset.pct;
          setTimeout(() => { bar.style.width = pct + '%'; }, i * 80);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(funnelSection);
})();

// ── PROCESS TABS ──────────────────────────────────────
function switchTab(btn, id) {
  const tabs = btn.closest('.process-tabs');
  tabs.querySelectorAll('.process-tab-btn').forEach(b => b.classList.remove('active'));
  tabs.querySelectorAll('.process-tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
}
