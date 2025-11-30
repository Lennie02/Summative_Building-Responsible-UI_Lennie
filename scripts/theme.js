// theme.js - Theme toggle functionality

const BUTTON_ID = 'theme-toggle';
const DATA_ATTR = 'data-theme';
const STORAGE_KEY = 'theme';

function getCurrentTheme() {
  return document.documentElement.getAttribute(DATA_ATTR) || 'light';
}

function applyTheme(name) {
  if (name === 'dark') {
    document.documentElement.setAttribute(DATA_ATTR, 'dark');
  } else {
    document.documentElement.removeAttribute(DATA_ATTR);
  }
}

function updateButton(btn, theme) {
  btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

function initTheme() {
  const btn = document.getElementById(BUTTON_ID);
  if (!btn) return;

  // Load saved preference
  const current = getCurrentTheme();
  updateButton(btn, current);

  // Adding click handler
  btn.addEventListener('click', () => {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { 
      localStorage.setItem(STORAGE_KEY, next === 'dark' ? 'dark' : ''); 
    } catch(e) {
      console.error('Failed to save theme preference:', e);
    }
    updateButton(btn, next);
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// Export for potential use in other modules
export { applyTheme, getCurrentTheme };