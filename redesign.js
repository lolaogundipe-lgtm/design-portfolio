// Redesign motion layer — homepage + work page.
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  // ── TEXT SCRAMBLE ────────────────────────────────────
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/+.-_';
  function scramble(el) {
    if (reduceMotion || el._scrambling) return;
    const final = el.dataset.text || el.textContent;
    el.dataset.text = final;
    el._scrambling = true;
    let frame = 0;
    const total = 18;
    (function tick() {
      const settled = Math.floor((frame / total) * final.length);
      el.textContent = final.split('').map((ch, i) => {
        if (ch === ' ' || i < settled) return ch;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join('');
      if (frame++ < total) requestAnimationFrame(tick);
      else { el.textContent = final; el._scrambling = false; }
    })();
  }
  const scrambleEls = document.querySelectorAll('[data-scramble]');
  scrambleEls.forEach(el => el.addEventListener('mouseenter', () => scramble(el)));
  const scrambleObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) scramble(e.target); });
  }, { threshold: 1 });
  scrambleEls.forEach(el => scrambleObs.observe(el));

  // ── NYC CLOCK ────────────────────────────────────────
  const clock = document.getElementById('rdClock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });
    const tick = () => { clock.textContent = fmt.format(new Date()) + ' NYC'; clock.dataset.text = clock.textContent; };
    tick();
    setInterval(tick, 15000);
  }

  // ── HEADER: hide on scroll down, show on scroll up ───
  const header = document.querySelector('.rd-header');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) {
      const goingDown = y > lastY && y > 120;
      if (goingDown !== header.classList.contains('is-hidden')) {
        header.classList.toggle('is-hidden', goingDown);
        if (!goingDown) header.querySelectorAll('[data-scramble]').forEach(scramble);
      }
    }
    lastY = y;
  }, { passive: true });

  // ── MENU OVERLAY ─────────────────────────────────────
  const menu = document.getElementById('rdMenu');
  const burger = document.getElementById('rdBurger');
  const siteContent = document.getElementById('siteContent');
  if (menu && burger) {
    const closeBtn = menu.querySelector('.rd-menu-close');
    const open = () => {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      if (siteContent) siteContent.setAttribute('inert', '');
      setTimeout(() => closeBtn.focus(), 50);
    };
    const close = () => {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      if (siteContent) siteContent.removeAttribute('inert');
      burger.focus();
    };
    burger.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) close(); });
    // Same-page anchors: close first so the scroll lands.
    menu.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(a => {
      a.addEventListener('click', () => {
        const samePage = a.getAttribute('href').startsWith('#') || /index\.html$|\/$/.test(location.pathname);
        if (samePage) close();
      });
    });
  }

  // ── REVEALS ──────────────────────────────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rd-rise, .rd-lines').forEach(el => revealObs.observe(el));

  // ── STATEMENT: split into words, light them as you scroll
  const statement = document.querySelector('[data-words]');
  let words = [];
  if (statement) {
    const text = statement.textContent.trim().replace(/\s+/g, ' ');
    statement.innerHTML = text.split(' ').map(w => `<span class="rd-word">${w}</span>`).join(' ');
    words = [...statement.querySelectorAll('.rd-word')];
    // The last N words (the tagline) light up in the red accent.
    const accent = parseInt(statement.dataset.accentWords || '0', 10);
    if (accent) words.slice(-accent).forEach(w => w.classList.add('is-accent'));
  }

  // ── HERO + FILMSTRIP + MARQUEE (one rAF loop) ───────
  const hero = document.querySelector('.rd-hero');
  const frame = document.querySelector('.rd-hero-frame');
  const track = document.querySelector('.rd-marquee-track');
  const stripWrap = document.querySelector('.rd-strip-wrap');
  const strip = document.querySelector('.rd-strip');

  let marqueeX = 0;
  let velocity = 0;
  let prevScroll = window.scrollY;
  let frameT = 0;

  function loop() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const delta = y - prevScroll;
    prevScroll = y;
    velocity = lerp(velocity, delta, 0.1);

    // Marquee drifts left on its own; scrolling pushes it faster.
    if (track) {
      const half = track.scrollWidth / 2;
      marqueeX -= (reduceMotion ? 0 : 0.6) + velocity * 0.35;
      if (half > 0) {
        if (marqueeX <= -half) marqueeX += half;
        if (marqueeX > 0) marqueeX -= half;
      }
      track.style.transform = `translate3d(${marqueeX}px,0,0)`;
    }

    // Hero frame grows from a small square to (nearly) full bleed.
    if (hero && frame) {
      const r = hero.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - vh), 0, 1);
      const eased = 1 - Math.pow(1 - clamp(p / 0.75, 0, 1), 3);
      frameT = lerp(frameT, eased, reduceMotion ? 1 : 0.14);
      const startW = vw < 900 ? vw * 0.34 : Math.min(vw * 0.16, 180);
      const endW = vw - 2 * Math.max(16, Math.min(vw * 0.03, 32));
      const startH = startW;
      const endH = vh - 2 * 16;
      frame.style.width = lerp(startW, endW, frameT) + 'px';
      frame.style.height = lerp(startH, endH, frameT) + 'px';
      frame.style.aspectRatio = 'auto';
      frame.style.translate = `-50% ${lerp(-55, -50, frameT)}%`;
      const marquee = track && track.parentElement;
      if (marquee) marquee.style.opacity = String(1 - clamp((p - 0.05) / 0.3, 0, 1));
    }

    // Filmstrip slides horizontally while its frame crosses the viewport.
    if (stripWrap && strip) {
      const r = stripWrap.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      const travel = strip.scrollWidth - r.width * 0.55;
      strip.style.transform = `translate3d(${lerp(r.width * 0.45, -travel, p)}px,0,0)`;
    }

    // Statement words light up in reading order.
    if (words.length) {
      const r = statement.getBoundingClientRect();
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      const lit = reduceMotion ? words.length : Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    }

    requestAnimationFrame(loop);
  }
  if (track || frame || strip || words.length) requestAnimationFrame(loop);

  // Hero frame cycles through project stills.
  if (frame) {
    const imgs = [...frame.querySelectorAll('img')];
    let i = 0;
    if (imgs.length) imgs[0].classList.add('is-on');
    if (imgs.length > 1 && !reduceMotion) {
      setInterval(() => {
        imgs[i].classList.remove('is-on');
        i = (i + 1) % imgs.length;
        imgs[i].classList.add('is-on');
      }, 1600);
    }
  }

  // ── SERVICES: draw-in rows, current index link, flow progress
  const svcRows = [...document.querySelectorAll('.rd-svc')];
  if (svcRows.length) {
    const indexLinks = [...document.querySelectorAll('.rd-svc-index a')];
    const rowObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        indexLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-35% 0px -45% 0px' });
    svcRows.forEach(r => rowObs.observe(r));
  }
  const flow = document.querySelector('[data-progress]');
  if (flow && !reduceMotion) {
    const setProgress = () => {
      const r = flow.getBoundingClientRect();
      const vh = window.innerHeight;
      flow.style.setProperty('--progress', clamp((vh * 0.85 - r.top) / (r.height + vh * 0.2), 0, 1).toFixed(3));
    };
    window.addEventListener('scroll', setProgress, { passive: true });
    setProgress();
  }

  // ── WORK LIST: cursor-following preview ──────────────
  const list = document.querySelector('.rd-list');
  const preview = document.querySelector('.rd-preview');
  if (list && preview && window.matchMedia('(pointer: fine)').matches) {
    const previewImgs = [...preview.querySelectorAll('img')];
    const OFFSET = 260; // keep the preview clear of the hovered title
    let px = 0, py = 0, tx = 0, ty = 0, running = false;
    const follow = () => {
      px = lerp(px, tx, 0.14);
      py = lerp(py, ty, 0.14);
      preview.style.transform = `translate3d(${px}px,${py}px,0) translate(-50%,-50%) rotate(${clamp((tx - px) * 0.04, -6, 6)}deg)`;
      if (running) requestAnimationFrame(follow);
    };
    list.querySelectorAll('.rd-list-link').forEach(link => {
      link.addEventListener('mouseenter', e => {
        const key = link.dataset.preview;
        previewImgs.forEach(img => img.classList.toggle('is-on', img.dataset.key === key));
        if (!running) { px = tx = e.clientX + OFFSET; py = ty = e.clientY; running = true; follow(); }
        preview.classList.add('is-on');
      });
      link.addEventListener('focus', () => {
        const key = link.dataset.preview;
        previewImgs.forEach(img => img.classList.toggle('is-on', img.dataset.key === key));
      });
    });
    list.addEventListener('mousemove', e => { tx = e.clientX + OFFSET; ty = e.clientY; });
    list.addEventListener('mouseleave', () => {
      preview.classList.remove('is-on');
      setTimeout(() => { if (!preview.classList.contains('is-on')) running = false; }, 400);
    });
  }
})();
