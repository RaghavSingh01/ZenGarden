// src/store/ui.store.js
const UI_KEY = 'zg_ui_v1';

let ui = load();
let watchers = [];

function load() {
  try {
    const raw = localStorage.getItem(UI_KEY);
    return raw ? JSON.parse(raw) : { theme: 'light', sidebarOpen: true, toasts: [] };
  } catch {
    return { theme: 'light', sidebarOpen: true, toasts: [] };
  }
}
function save() {
  try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch {}
}
function publish() { watchers.forEach((w) => w(ui)); }

export function subscribeUI(fn) {
  watchers.push(fn);
  return () => { watchers = watchers.filter((x) => x !== fn); };
}
export function getUI() { return ui; }

export function setTheme(next) {
  ui.theme = next;
  save(); publish();
}
export function toggleSidebar(next) {
  ui.sidebarOpen = typeof next === 'boolean' ? next : !ui.sidebarOpen;
  save(); publish();
}
export function pushToast({ type = 'info', message }) {
  const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  ui.toasts = [...ui.toasts, { id, type, message }];
  publish();
  return id;
}
export function removeToast(id) {
  ui.toasts = ui.toasts.filter((t) => t.id !== id);
  publish();
}