// ── VERCEL ANALYTICS ──────────────────────────────────
(function initAnalytics() {
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();

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

  document.querySelectorAll('.project-window, .project-card, .btn-solid, .btn-ghost, .contact-link, .nav-link, .nav-cta, .cs-back-link, .cs-next, .nav-logo, .cs-gate-submit, .cs-gate-back, .cs-process-cta, .svc-stage, .svc-engage, .svc-email, .svc-carousel-btn, .svc-dot').forEach(el => {
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

// ── DESIGN PROCESS REVEAL ─────────────────────────────
(function initProcessReveal(){
  const cta = document.getElementById('csProcessCta');
  const panel = document.getElementById('cs-process');
  if (!cta || !panel) return;

  const label = cta.querySelector('.cs-process-cta-label');
  const openText = label?.dataset.labelOpen || 'See detailed design process';
  const closeText = label?.dataset.labelClose || 'Hide detailed design process';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setOpen(open) {
    cta.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.hidden = !open;
    panel.classList.toggle('is-open', open);
    if (label) label.textContent = open ? closeText : openText;
    if (open && !reduceMotion) {
      requestAnimationFrame(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  cta.addEventListener('click', () => {
    setOpen(cta.getAttribute('aria-expanded') !== 'true');
  });
})();

// ── ONBOARDING AUTOPLAY PROTOTYPE ─────────────────────
(function initFlowProto(){
  const root = document.getElementById('csFlowProto');
  if (!root) return;

  const steps = [
    { src: 'images/relate-flow/step-01.webp', label: 'Welcome', x: 78, y: 87 },
    { src: 'images/relate-flow/step-02.webp', label: 'How it works', x: 78, y: 87 },
    { src: 'images/relate-flow/step-03.webp', label: 'Getting started', x: 78, y: 87 },
    { src: 'images/relate-flow/step-04.webp', label: 'Record · start', x: 50, y: 76 },
    { src: 'images/relate-flow/step-05.webp', label: 'Record · speak', x: 50, y: 76 },
    { src: 'images/relate-flow/step-06.webp', label: 'Check recording', x: 50, y: 68 },
    { src: 'images/relate-flow/step-07.webp', label: 'Review checklist', x: 72, y: 86 },
    { src: 'images/relate-flow/step-08.webp', label: 'Next phrase', x: 50, y: 76 },
    { src: 'images/relate-flow/step-09.webp', label: 'Model ready ping', x: 50, y: 46 },
    { src: 'images/relate-flow/step-10.webp', label: 'Splash', x: 50, y: 42 },
    { src: 'images/relate-flow/step-11.webp', label: 'Re-teach features', x: 78, y: 87 },
    { src: 'images/relate-flow/step-12.webp', label: 'Listen', x: 50, y: 70 },
    { src: 'images/relate-flow/step-13.webp', label: 'Repeat', x: 50, y: 70 },
    { src: 'images/relate-flow/step-14.webp', label: 'Assistant', x: 50, y: 70 }
  ];

  const phone = root.querySelector('.cs-proto-phone');
  const img = phone?.querySelector('img');
  const cursor = phone?.querySelector('.cs-proto-cursor');
  const stepEl = root.querySelector('.cs-proto-step');
  if (!phone || !img || !cursor || !stepEl) return;

  steps.forEach(s => { const pre = new Image(); pre.src = s.src; });

  let i = 0;
  let timer = 0;
  let playing = false;
  let gen = 0;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(index) {
    i = index;
    const step = steps[i];
    img.src = step.src;
    img.alt = step.label;
    stepEl.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(steps.length).padStart(2, '0') + ' · ' + step.label;
    cursor.style.setProperty('--x', step.x + '%');
    cursor.style.setProperty('--y', step.y + '%');
  }

  function wait(ms) {
    return new Promise(resolve => { timer = window.setTimeout(resolve, ms); });
  }

  async function cycle(myGen) {
    while (playing && myGen === gen) {
      const step = steps[i];
      cursor.classList.remove('is-tap');
      cursor.classList.add('is-in');
      cursor.style.setProperty('--x', step.x + '%');
      cursor.style.setProperty('--y', step.y + '%');
      await wait(900);
      if (!playing || myGen !== gen) break;
      cursor.classList.remove('is-tap');
      void cursor.offsetWidth;
      cursor.classList.add('is-tap');
      await wait(420);
      if (!playing || myGen !== gen) break;
      show((i + 1) % steps.length);
      await wait(180);
    }
  }

  function play() {
    if (playing || reduce) return;
    playing = true;
    cycle(++gen);
  }

  function pause() {
    playing = false;
    gen += 1;
    window.clearTimeout(timer);
    cursor.classList.remove('is-tap');
  }

  show(0);
  if (reduce) {
    cursor.style.display = 'none';
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { e.isIntersecting ? play() : pause(); });
  }, { threshold: 0.35 });
  obs.observe(root);
})();

// ── SERVICES CAROUSEL ─────────────────────────────────
(function initSvcCarousel(){
  const root = document.querySelector('.svc-carousel');
  if (!root) return;

  const track = root.querySelector('.svc-carousel-track');
  const slides = [...root.querySelectorAll('.svc-slide')];
  const dots = [...root.querySelectorAll('.svc-dot')];
  const status = root.querySelector('.svc-carousel-status');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0;
  let x0 = null;

  function slideWidth() {
    return root.querySelector('.svc-carousel-viewport').getBoundingClientRect().width;
  }

  function go(n) {
    i = (n + slides.length) % slides.length;
    const w = slideWidth();
    slides.forEach(slide => { slide.style.width = w + 'px'; });
    track.style.transition = reduce ? 'none' : '';
    track.style.transform = 'translate3d(' + (-i * w) + 'px,0,0)';
    slides.forEach((slide, idx) => {
      const on = idx === i;
      slide.classList.toggle('is-active', on);
      if (on) slide.removeAttribute('inert');
      else slide.setAttribute('inert', '');
      slide.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach((dot, idx) => {
      dot.setAttribute('aria-current', idx === i ? 'true' : 'false');
    });
    if (status) {
      const label = slides[i].getAttribute('data-name') || '';
      status.textContent = String(i + 1).padStart(2, '0') + ' / 05';
      status.setAttribute('aria-label', label + ', ' + (i + 1) + ' of ' + slides.length);
    }
  }

  root.querySelectorAll('.svc-carousel-btn').forEach(btn => {
    btn.addEventListener('click', () => go(i + Number(btn.dataset.dir)));
  });
  dots.forEach((dot, idx) => dot.addEventListener('click', () => go(idx)));

  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      go(i + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      go(i - 1);
    }
    if (e.key === 'Home') { e.preventDefault(); go(0); }
    if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); }
  });

  track.addEventListener('pointerdown', e => { x0 = e.clientX; });
  track.addEventListener('pointerup', e => {
    if (x0 == null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 48) go(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  track.addEventListener('pointercancel', () => { x0 = null; });

  window.addEventListener('resize', () => go(i));
  go(0);
})();

// ── COPY EMAIL ────────────────────────────────────────
(function initCopyEmail(){
  const email = 'lolaogundipe@gmail.com';
  document.querySelectorAll('[data-copy-email]').forEach(btn => {
    const idle = btn.textContent.trim();
    btn.addEventListener('click', async () => {
      let ok = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          ok = true;
        }
      } catch (err) { /* fall through to execCommand */ }
      if (!ok) {
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      }
      btn.setAttribute('aria-live', 'polite');
      btn.textContent = ok ? 'Copied' : 'Copy failed';
      window.clearTimeout(btn._copyTimer);
      btn._copyTimer = window.setTimeout(() => {
        btn.textContent = idle;
      }, 2000);
    });
  });
})();
