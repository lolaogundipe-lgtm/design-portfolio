// ── CASE STUDY PASSWORD GATE ─────────────────────────
(function initCaseAuth(){
  const STORAGE_KEY = 'uxwithlola_cs_auth';
  const PASSWORD = 'designcode';

  function unlocked() {
    try { return sessionStorage.getItem(STORAGE_KEY) === '1'; }
    catch (_) { return false; }
  }

  function unlock() {
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
    document.documentElement.classList.remove('cs-auth-pending');
    document.body.classList.remove('cs-locked');
    const gate = document.getElementById('cs-gate');
    if (gate) gate.remove();
  }

  if (unlocked()) {
    document.documentElement.classList.remove('cs-auth-pending');
    return;
  }

  document.documentElement.classList.add('cs-auth-pending');
  document.body.classList.add('cs-locked');

  const gate = document.createElement('div');
  gate.id = 'cs-gate';
  gate.className = 'cs-gate';
  gate.innerHTML = `
    <div class="cs-gate-panel">
      <div class="cs-gate-chrome">
        <span>&gt;_ /CASE_STUDY_ACCESS</span>
        <span class="cs-gate-controls">— □ ×</span>
      </div>
      <div class="cs-gate-body">
        <p class="cs-gate-label">This case study is password protected</p>
        <h2 class="cs-gate-title">Enter password</h2>
        <form class="cs-gate-form" id="csGateForm" autocomplete="off">
          <label class="visually-hidden" for="csGateInput">Password</label>
          <input id="csGateInput" class="cs-gate-input" type="password" name="password" placeholder="password" required autofocus>
          <button type="submit" class="cs-gate-submit">Unlock →</button>
        </form>
        <p class="cs-gate-error" id="csGateError" hidden>Incorrect password. Try again.</p>
        <a class="cs-gate-back" href="index.html">← Back to work</a>
      </div>
    </div>
  `;
  document.body.appendChild(gate);

  const form = document.getElementById('csGateForm');
  const input = document.getElementById('csGateInput');
  const error = document.getElementById('csGateError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = (input.value || '').trim();
    if (value === PASSWORD) {
      unlock();
      return;
    }
    error.hidden = false;
    input.value = '';
    input.focus();
    gate.classList.remove('cs-gate-shake');
    void gate.offsetWidth;
    gate.classList.add('cs-gate-shake');
  });
})();
