// src/store/cart.store.js
const CART_KEY = 'zg_cart_v1';

let cart = loadInitial();
let subs = [];

function loadInitial() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}
function save() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch(err) {
    console.log("Save failed: ", err)
  }
}
function emit() { subs.forEach((fn) => fn(cart)); }

export function subscribe(fn) {
  subs.push(fn);
  return () => { subs = subs.filter((s) => s !== fn); };
}
export function getState() { return cart; }

function findIndex(id) { return cart.items.findIndex((i) => i.id === id); }

export function addItem(item, qty = 1) {
  const i = findIndex(item.id);
  if (i >= 0) cart.items[i].quantity += qty;
  else cart.items.push({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: qty });
  save(); emit();
}

export function setQuantity(id, qty) {
  const i = findIndex(id);
  if (i >= 0) {
    cart.items[i].quantity = Math.max(1, Number(qty));
    save(); emit();
  }
}

export function removeItem(id) {
  cart.items = cart.items.filter((i) => i.id !== id);
  save(); emit();
}

export function clearCart() {
  cart.items = [];
  save(); emit();
}

export function cartCount() {
  return cart.items.reduce((acc, i) => acc + i.quantity, 0);
}
export function cartTotal() {
  return cart.items.reduce((acc, i) => acc + Number(i.price || 0) * i.quantity, 0);
}