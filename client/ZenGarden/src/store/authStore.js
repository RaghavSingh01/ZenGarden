// src/store/auth.store.js
const AUTH_KEY = 'zg_auth_v1';

let authState = loadInitial();
let listeners = [];

function loadInitial() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : { token: null, refreshToken: null, user: null };
  } catch {
    return { token: null, refreshToken: null, user: null };
  }
}
function persist() {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
  } catch (err){
    console.log("Persist failed: ",err);
  }
}
function notify() {
  listeners.forEach((l) => l(authState));
}

export function subscribeAuth(fn) {
  listeners.push(fn);
  return () => { listeners = listeners.filter((x) => x !== fn); };
}
export function getAuth() {
  return authState;
}

export function setAuth(next) {
  authState = { ...authState, ...next };
  persist(); notify();
}

export function logout() {
  authState = { token: null, refreshToken: null, user: null };
  persist(); notify();
}