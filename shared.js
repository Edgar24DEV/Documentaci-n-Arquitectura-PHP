// ════ SHARED SCORE STATE (localStorage) ════
const SCORE_KEY = 'arq_php_score';
const DONE_KEY  = 'arq_php_done';

const S = {
  get score() { return parseInt(localStorage.getItem(SCORE_KEY) || '0'); },
  set score(v) { localStorage.setItem(SCORE_KEY, v); },
  get done()  { return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || '[]')); },
  addDone(id) {
    const d = this.done; d.add(id);
    localStorage.setItem(DONE_KEY, JSON.stringify([...d]));
  },
  has(id) { return this.done.has(id); },
  max: 120,
};

function award(pts, id) {
  if (S.has(id)) return;
  S.addDone(id);
  S.score = Math.min(S.max, S.score + pts);
  renderScore();
}

function renderScore() {
  const el = document.getElementById('scoreDisplay');
  const bar = document.getElementById('pFill');
  if (el) el.textContent = S.score;
  if (bar) bar.style.width = (S.score / S.max * 100) + '%';
}

function resetAll() {
  localStorage.removeItem(SCORE_KEY);
  localStorage.removeItem(DONE_KEY);
  renderScore();
  // reset all exercise UI if present
  if (typeof resetPageExercises === 'function') resetPageExercises();
}

// Mark current nav link active based on filename
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
}

// ════ TAB SWITCHING ════
function tab(btn, id) {
  btn.closest('.tab-bar').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  btn.closest('.tabs').querySelectorAll('.tab-pane').forEach(p => p.classList.remove('on'));
  document.getElementById(id).classList.add('on');
}

// ════ THEME TOGGLE ════
const THEME_KEY = 'arq_php_theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Apply saved theme immediately on load (before DOMContentLoaded to avoid flash)
(function() {
  const saved = localStorage.getItem(THEME_KEY) || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', () => {
  renderScore();
  setActiveNav();
  // sync toggle icon with current theme
  const _t = document.documentElement.getAttribute('data-theme') || 'dark';
  const _btn = document.getElementById('themeToggle');
  if (_btn) _btn.textContent = _t === 'light' ? '🌙' : '☀️';
});
