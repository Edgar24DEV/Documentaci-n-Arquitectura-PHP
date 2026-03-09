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

// ════ TAB SWITCHER ════
function tab(btn, targetId) {
  // Encuentra el contenedor padre de tabs
  const container = btn.closest('.tabs') || btn.parentElement;
  
  // Desactiva todos los botones del grupo
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('on'));
  
  // Activa el botón pulsado
  btn.classList.add('on');
  
  // Oculta todos los paneles hermanos del target
  const panel = document.getElementById(targetId);
  if (!panel) return;
  
  // Busca el contenedor de paneles (hermano del contenedor de botones)
  const allPanels = panel.parentElement.querySelectorAll(':scope > [id]');
  allPanels.forEach(p => p.style.display = 'none');
  
  // Muestra el panel seleccionado
  panel.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {

  // Inicializa todos los tab groups: oculta paneles no activos
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const targetId = btn.getAttribute('onclick').match(/tab\(this,'(.+?)'\)/)?.[1];
    if (targetId) {
      const panel = document.getElementById(targetId);
      if (panel && !btn.classList.contains('on')) {
        panel.style.display = 'none';
      }
    }
  });
  renderScore();
  setActiveNav();
  // sync toggle icon with current theme
  const _t = document.documentElement.getAttribute('data-theme') || 'dark';
  const _btn = document.getElementById('themeToggle');
  if (_btn) _btn.textContent = _t === 'light' ? '🌙' : '☀️';
});
