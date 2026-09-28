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

  // ── HERO SCENE: sketch → design → build ──────────────
  // One onboarding screen evolves with hero scroll progress (0–1).
  // Everything is derived from progress, so scrolling back reverses it.
  const ramp = (v, a, b) => clamp((v - a) / (b - a), 0, 1);
  const heroScene = frame && frame.querySelector('.hs-scene') ? createHeroScene(frame) : null;

  function createHeroScene(frameEl) {
    const svg = frameEl.querySelector('.hs-scene');
    const q = sel => svg.querySelector(sel);
    const qa = sel => [...svg.querySelectorAll(sel)];
    const g = { sketch: q('.hs-sketch'), editor: q('.hs-editor'), ui: q('.hs-ui'), overlay: q('.hs-overlay'), ide: q('.hs-ide') };
    const draws = qa('.hs-draw');
    const notes = qa('.hs-note');
    const layerHl = qa('.hs-layer-hl');
    const selGroup = q('.hs-sel');
    const selBox = q('.hs-sel-box');
    const handles = qa('.hs-handle');
    const sizeRect = q('.hs-size rect');
    const sizeText = q('.hs-size text');
    const cursor = q('.hs-cursor');
    const redlines = [null, q('.hs-red-1'), q('.hs-red-2')];
    const code = qa('.hs-code');
    const codeFull = code.map(t => t.textContent);
    const codeTotal = codeFull.reduce((n, str) => n + str.length, 0);
    const term = qa('.hs-term');
    const live = q('.hs-live');
    const frameLabel = q('.hs-frame-label');
    const shipped = q('.hs-shipped');
    const stagesEl = frameEl.querySelector('.rd-hero-stages');
    const stageItems = stagesEl ? [...stagesEl.querySelectorAll('li')] : [];

    // Selection walks image → headline → button; layer index maps to the Layers panel.
    const targets = [
      { x: 474, y: 160, w: 252, h: 200, layer: 0 },
      { x: 474, y: 382, w: 232, h: 78, layer: 1 },
      { x: 474, y: 624, w: 252, h: 48, layer: 4 },
    ];
    const keys = [0.1, 0.42, 0.72];
    let cur = { x: 600, y: 420 };
    let typed = -1;

    function selectionAt(dp) {
      let box = { ...targets[0] };
      let active = 0;
      for (let k = 1; k < targets.length; k++) {
        const t = ramp(dp, keys[k] - 0.08, keys[k]);
        const e = 1 - Math.pow(1 - t, 3);
        box = { x: lerp(box.x, targets[k].x, e), y: lerp(box.y, targets[k].y, e), w: lerp(box.w, targets[k].w, e), h: lerp(box.h, targets[k].h, e) };
        if (t > 0.5) active = k;
      }
      return { box, active };
    }

    return {
      update(p, frameT) {
        // Always show the full scene height: crop the sides when the frame is
        // narrower than 16:10, reveal extra background when it is wider.
        const fit = frameEl.clientWidth / frameEl.clientHeight > 1.6 ? 'xMidYMid meet' : 'xMidYMid slice';
        if (svg.getAttribute('preserveAspectRatio') !== fit) svg.setAttribute('preserveAspectRatio', fit);

        // Stage crossfades
        const toDesign = ramp(p, 0.29, 0.37);
        const toBuild = ramp(p, 0.62, 0.7);
        g.sketch.style.opacity = 1 - toDesign;
        g.editor.style.opacity = toDesign * (1 - toBuild);
        g.ui.style.opacity = toDesign;
        g.overlay.style.opacity = ramp(p, 0.36, 0.42) * (1 - ramp(p, 0.6, 0.65));
        g.ide.style.opacity = toBuild;
        live.style.opacity = toBuild;
        frameLabel.style.opacity = 1 - toBuild;

        const stage = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
        stageItems.forEach((li, i) => li.classList.toggle('is-active', i === stage));
        if (stagesEl) stagesEl.style.opacity = ramp(frameT, 0.2, 0.45);

        // 01 Sketch: strokes draw in order, notes appear as their strokes land.
        const sp = 0.18 + 0.82 * ramp(p, 0, 0.27);
        const n = draws.length;
        draws.forEach((d, i) => {
          const start = (i / n) * 0.75;
          d.style.strokeDashoffset = String(1 - ramp(sp, start, start + 0.25));
        });
        notes.forEach(el => {
          const at = parseFloat(el.dataset.at);
          el.style.opacity = ramp(sp, at, at + 0.06);
        });

        // 02 Design: selection, layers, redlines, cursor, fill colour.
        const dp = ramp(p, 0.36, 0.62);
        const { box, active } = selectionAt(dp);
        selGroup.style.opacity = ramp(dp, 0.02, keys[0]);
        selBox.setAttribute('x', box.x); selBox.setAttribute('y', box.y);
        selBox.setAttribute('width', box.w); selBox.setAttribute('height', box.h);
        [[box.x, box.y], [box.x + box.w, box.y], [box.x, box.y + box.h], [box.x + box.w, box.y + box.h]].forEach(([hx, hy], i) => {
          handles[i].setAttribute('x', hx - 4); handles[i].setAttribute('y', hy - 4);
        });
        const label = `${Math.round(box.w)} × ${Math.round(box.h)}`;
        if (sizeText.textContent !== label) sizeText.textContent = label;
        sizeRect.setAttribute('width', 62); sizeRect.setAttribute('x', box.x + box.w / 2 - 31); sizeRect.setAttribute('y', box.y + box.h + 8);
        sizeText.setAttribute('x', box.x + box.w / 2); sizeText.setAttribute('y', box.y + box.h + 20.5);
        layerHl.forEach((el, i) => el.classList.toggle('is-on', dp > 0.02 && i === targets[active].layer));
        redlines.forEach((el, i) => el && el.classList.toggle('is-on', dp > 0.02 && i === active));
        svg.classList.toggle('is-colored', dp > 0.84 || p >= 0.66);
        const tx = box.x + box.w * 0.72, ty = box.y + box.h * 0.62;
        cur.x = lerp(cur.x, tx, reduceMotion ? 1 : 0.12);
        cur.y = lerp(cur.y, ty, reduceMotion ? 1 : 0.12);
        cursor.setAttribute('transform', `translate(${cur.x.toFixed(1)} ${cur.y.toFixed(1)})`);

        // 03 Build: code types in, terminal lines follow, then "Shipped".
        const bp = ramp(p, 0.68, 0.97);
        const chars = Math.round(ramp(bp, 0, 0.62) * codeTotal);
        if (chars !== typed) {
          typed = chars;
          let left = chars;
          let caretPlaced = false;
          code.forEach((t, i) => {
            const full = codeFull[i];
            const shown = full.slice(0, Math.max(0, left));
            left -= full.length;
            const caret = !caretPlaced && chars < codeTotal && left < 0 ? '▍' : '';
            if (caret) caretPlaced = true;
            t.textContent = shown + caret;
          });
        }
        term.forEach((t, i) => { t.style.opacity = ramp(bp, 0.62 + i * 0.06, 0.66 + i * 0.06); });
        const sh = ramp(bp, 0.9, 1);
        shipped.style.opacity = sh;
        shipped.style.transform = `scale(${0.85 + 0.15 * sh})`;
      },
    };
  }

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
      if (heroScene) heroScene.update(reduceMotion ? 1 : p, frameT);
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
