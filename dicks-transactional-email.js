(function () {
  'use strict';

  /* ── TIMING SYSTEM ──────────────────────────────────────────────
     Edit any value below (milliseconds) to retime a scene.
     Everything else — the rail, captions, image crossfades, tap/pulse
     cues — derives from this single source of truth. */
  var TIMING = {
    addToCart:          1700, // scene 0 — product card, tap Add to Cart
    addedToCart:         1400, // scene 1 — checkmark confirmation + cart badge
    checkingStore:       2300, // scene 2 — system checks store pickup → 0 available
    checkingShip:        2300, // scene 3 — system checks shipping → available
    notifyTriggered:     1800, // scene 4 — customer notification triggered
    gmailNotification:  2200, // scene 5 — pull back to the athlete's phone
    emailOpened:        1600, // scene 6 — tap notification → Gmail opens
    ctaInteraction:      2400, // scene 7 — read, spotlight + tap the CTA
    landingPage:         3000  // scene 8 — arrive at the landing page, hold
  };

  var SCENE_KEYS = ['addToCart', 'addedToCart', 'checkingStore', 'checkingShip', 'notifyTriggered', 'gmailNotification', 'emailOpened', 'ctaInteraction', 'landingPage'];
  var DURATIONS = SCENE_KEYS.map(function (k) { return TIMING[k]; });
  var OFFSETS = DURATIONS.reduce(function (acc, d) {
    acc.push((acc.length ? acc[acc.length - 1] : 0) + d);
    return acc;
  }, []);
  var TOTAL_DURATION = OFFSETS[OFFSETS.length - 1];
  var SCENE_COUNT = DURATIONS.length;

  var CAPTIONS = [
    'The athlete completes their purchase.',
    'Item added — one Cloudnova 2, size 9.',
    'Order fulfillment checks store pickup.',
    'None on hand there — it checks shipping instead.',
    'Available to ship, so it notifies the customer.',
    'A Gmail notification lands on their phone.',
    'They tap it open to see what happened.',
    'They review the fix and tap to continue.',
    'One tap later, they’re exactly where they need to be.'
  ];

  // Rail node state per scene, in order [cart, system, notify, email, landing]
  var RAIL_STATES = [
    ['current', 'upcoming', 'upcoming', 'upcoming', 'upcoming'],
    ['current', 'upcoming', 'upcoming', 'upcoming', 'upcoming'],
    ['passed', 'current', 'upcoming', 'upcoming', 'upcoming'],
    ['passed', 'current', 'upcoming', 'upcoming', 'upcoming'],
    ['passed', 'current', 'upcoming', 'upcoming', 'upcoming'],
    ['passed', 'passed', 'current', 'upcoming', 'upcoming'],
    ['passed', 'passed', 'passed', 'current', 'upcoming'],
    ['passed', 'passed', 'passed', 'current', 'upcoming'],
    ['passed', 'passed', 'passed', 'passed', 'current']
  ];

  var LAYER_BY_SCENE        = ['card', 'card', 'system', 'system', 'system', 'phone', 'phone', 'phone', 'phone'];
  var CARD_PHASE_BY_SCENE   = ['add', 'added', 'added', 'added', 'added', 'added', 'added', 'added', 'added'];
  var SYS_PHASE_BY_SCENE    = ['store', 'store', 'store', 'ship', 'notify', 'notify', 'notify', 'notify', 'notify'];
  var PHONE_STATE_BY_SCENE  = ['notify', 'notify', 'notify', 'notify', 'notify', 'notify', 'email', 'email', 'landing'];
  var NOTIF_TAPPED_BY_SCENE = [false, false, false, false, false, false, true, true, true];
  var CTA_ACTIVE_BY_SCENE   = [false, false, false, false, false, false, false, true, false];

  /* ── DOM ─────────────────────────────────────────────────────── */
  var shell = document.getElementById('storyShell');
  var stage = document.getElementById('storyStage');
  var caption = document.getElementById('storyCaption');
  var reducedNote = document.getElementById('reducedNote');
  var playPauseBtn = document.getElementById('playPauseBtn');
  var replayBtn = document.getElementById('replayBtn');
  var railNodes = Array.prototype.slice.call(stage.querySelectorAll('.rail-node'));
  var railConnectors = Array.prototype.slice.call(stage.querySelectorAll('.rail-connector'));
  var layers = Array.prototype.slice.call(stage.querySelectorAll('.layer'));

  if (!stage) return;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── CLOCK STATE ─────────────────────────────────────────────── */
  var elapsed = 0;          // ms progressed into the sequence
  var playing = false;
  var rafId = null;
  var lastTick = 0;
  var currentSceneIndex = -1;

  function sceneIndexForElapsed(ms) {
    for (var i = 0; i < OFFSETS.length; i++) {
      if (ms < OFFSETS[i]) return i;
    }
    return SCENE_COUNT - 1;
  }

  function applyScene(index, opts) {
    opts = opts || {};
    if (index === currentSceneIndex && !opts.force) return;
    currentSceneIndex = index;

    stage.setAttribute('data-scene', String(index));
    stage.setAttribute('data-card-phase', CARD_PHASE_BY_SCENE[index]);
    stage.setAttribute('data-sys-phase', SYS_PHASE_BY_SCENE[index]);
    stage.setAttribute('data-phone-state', PHONE_STATE_BY_SCENE[index]);
    stage.setAttribute('data-notif-tapped', String(NOTIF_TAPPED_BY_SCENE[index]));
    stage.setAttribute('data-cta-active', String(CTA_ACTIVE_BY_SCENE[index]));

    var activeLayer = LAYER_BY_SCENE[index];
    layers.forEach(function (layer) {
      layer.classList.toggle('is-active', layer.getAttribute('data-layer') === activeLayer);
    });

    var states = RAIL_STATES[index];
    railNodes.forEach(function (node, i) {
      node.setAttribute('data-state', states[i]);
    });
    railConnectors.forEach(function (connector, i) {
      var nextState = states[i + 1];
      connector.setAttribute('data-filled', String(nextState !== 'upcoming'));
    });

    caption.textContent = CAPTIONS[index];
  }

  function jumpTo(ms, sceneIndexOverride) {
    // Instantly place the sequence at a point with no transition flourish —
    // used for replay resets and the initial reduced-motion static frame.
    shell.classList.add('is-jumping');
    elapsed = ms;
    applyScene(sceneIndexOverride != null ? sceneIndexOverride : sceneIndexForElapsed(ms), { force: true });
    // Force a reflow, then release the transition-suppression class.
    void stage.offsetHeight;
    requestAnimationFrame(function () {
      shell.classList.remove('is-jumping');
    });
  }

  /* ── RAF LOOP ────────────────────────────────────────────────── */
  function tick(now) {
    if (!playing) return;
    var delta = now - lastTick;
    lastTick = now;
    elapsed += delta;

    if (elapsed >= TOTAL_DURATION) {
      elapsed = TOTAL_DURATION;
      applyScene(SCENE_COUNT - 1);
      stopPlaying();
      return;
    }

    applyScene(sceneIndexForElapsed(elapsed));
    rafId = requestAnimationFrame(tick);
  }

  function startPlaying() {
    if (playing) return;
    if (elapsed >= TOTAL_DURATION) elapsed = 0;
    playing = true;
    lastTick = performance.now();
    playPauseBtn.textContent = 'Pause';
    playPauseBtn.setAttribute('aria-pressed', 'true');
    rafId = requestAnimationFrame(tick);
  }

  function stopPlaying() {
    playing = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    playPauseBtn.textContent = 'Play';
    playPauseBtn.setAttribute('aria-pressed', 'false');
  }

  function replay() {
    stopPlaying();
    jumpTo(0, 0);
    startPlaying();
  }

  /* ── CONTROLS ────────────────────────────────────────────────── */
  playPauseBtn.addEventListener('click', function () {
    if (playing) {
      stopPlaying();
    } else {
      startPlaying();
    }
  });

  replayBtn.addEventListener('click', replay);

  /* ── REDUCED MOTION ──────────────────────────────────────────── */
  function setReducedMotion(isReduced) {
    shell.classList.toggle('is-reduced-motion', isReduced);
    if (isReduced) {
      stopPlaying();
      jumpTo(TOTAL_DURATION, SCENE_COUNT - 1);
      reducedNote.hidden = false;
      playPauseBtn.textContent = 'Play';
      playPauseBtn.setAttribute('aria-pressed', 'false');
    } else {
      reducedNote.hidden = true;
    }
  }

  reduceMotionQuery.addEventListener
    ? reduceMotionQuery.addEventListener('change', function (e) { setReducedMotion(e.matches); })
    : reduceMotionQuery.addListener(function (e) { setReducedMotion(e.matches); });

  /* ── INIT ────────────────────────────────────────────────────── */
  jumpTo(0, 0);
  if (reduceMotionQuery.matches) {
    setReducedMotion(true);
  } else {
    startPlaying();
  }

  // Exposed so a host page can embed this storyboard (e.g. inside an
  // overlay) and control it directly — replaying fresh each time it
  // becomes visible, and pausing it while hidden — without touching
  // the autoplay-on-load behavior this standalone page relies on.
  window.sttsStoryboard = {
    replay: replay,
    stop: stopPlaying
  };
})();
