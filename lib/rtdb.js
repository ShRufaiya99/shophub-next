import { rtdb } from "@/lib/firebase";
import { ref, set, get, update } from "firebase/database";

// Firebase RTDB keys cannot contain '.', '#', '$', '[', or ']'
export function sanitizeKey(key) {
  if (!key) return "guest";
  return String(key).replace(/[.#$\[\]]/g, "_");
}

/* ---------- Orders ---------- */

export async function rtdbSaveOrder(order) {
  try {
    if (!rtdb || !order?.id) return;
    const updates = {};
    if (order.userId) {
      const uKey = sanitizeKey(order.userId);
      updates[`users/${uKey}/orders/${order.id}`] = order;
    }
    updates[`orders/${order.id}`] = order;
    await update(ref(rtdb), updates);
  } catch (err) {
    console.warn("RTDB save order notice:", err?.message);
  }
}

export async function rtdbFetchUserOrders(userId) {
  try {
    if (!rtdb || !userId) return [];
    const uKey = sanitizeKey(userId);
    const snap = await get(ref(rtdb, `users/${uKey}/orders`));
    if (snap.exists()) {
      const val = snap.val();
      return Object.values(val).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
  } catch (err) {
    console.warn("RTDB fetch orders notice:", err?.message);
    return [];
  }
}

/* ---------- Cart ---------- */

export async function rtdbSaveCart(userId, cart) {
  try {
    if (!rtdb || !userId) return;
    const uKey = sanitizeKey(userId);
    await set(ref(rtdb, `users/${uKey}/cart`), cart || []);
  } catch (err) {
    console.warn("RTDB save cart notice:", err?.message);
  }
}

export async function rtdbFetchCart(userId) {
  try {
    if (!rtdb || !userId) return null;
    const uKey = sanitizeKey(userId);
    const snap = await get(ref(rtdb, `users/${uKey}/cart`));
    if (snap.exists()) return snap.val();
    return null;
  } catch (err) {
    console.warn("RTDB fetch cart notice:", err?.message);
    return null;
  }
}

/* ---------- Wishlist ---------- */

export async function rtdbSaveWishlist(userId, wishlist) {
  try {
    if (!rtdb || !userId) return;
    const uKey = sanitizeKey(userId);
    await set(ref(rtdb, `users/${uKey}/wishlist`), wishlist || []);
  } catch (err) {
    console.warn("RTDB save wishlist notice:", err?.message);
  }
}

export async function rtdbFetchWishlist(userId) {
  try {
    if (!rtdb || !userId) return null;
    const uKey = sanitizeKey(userId);
    const snap = await get(ref(rtdb, `users/${uKey}/wishlist`));
    if (snap.exists()) return snap.val();
    return null;
  } catch (err) {
    console.warn("RTDB fetch wishlist notice:", err?.message);
    return null;
  }
}

/* ---------- Profile ---------- */

export async function rtdbSaveProfile(userId, profile) {
  try {
    if (!rtdb || !userId) return;
    const uKey = sanitizeKey(userId);
    await set(ref(rtdb, `users/${uKey}/profile`), profile);
  } catch (err) {
    console.warn("RTDB save profile notice:", err?.message);
  }
}

export async function rtdbFetchProfile(userId) {
  try {
    if (!rtdb || !userId) return null;
    const uKey = sanitizeKey(userId);
    const snap = await get(ref(rtdb, `users/${uKey}/profile`));
    if (snap.exists()) return snap.val();
    return null;
  } catch (err) {
    console.warn("RTDB fetch profile notice:", err?.message);
    return null;
  }
}
