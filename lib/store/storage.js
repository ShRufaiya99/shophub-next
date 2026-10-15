// localStorage helpers (all wrapped in try/catch so private mode never crashes the app)

export const KEYS = {
  auth: "shophub:auth",
  cart: "shophub:cart",
  wishlist: "shophub:wishlist",
  orders: "shophub:orders",
  users: "shophub:users",
  newsletter: "shophub:newsletter",
};

export function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function hashPassword(text) {
  try {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return btoa(unescape(encodeURIComponent(text)));
  }
}
