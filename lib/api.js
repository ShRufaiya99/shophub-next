import extra from "@/data/extra-products.json";
import { findGroup, MAIN_SOURCES } from "@/lib/categories";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://dummyjson.com";

// Fields needed for product cards / lists (keeps the payload small)
const LIST_FIELDS =
  "id,title,description,category,price,discountPercentage,rating,stock,brand,thumbnail,tags";

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

/* ---------------- products ---------------- */

let allProductsPromise = null;

export function getAllProducts() {
  if (!allProductsPromise) {
    allProductsPromise = request(`/products?limit=0&select=${LIST_FIELDS}`)
      .then((d) => [...d.products, ...extra])
      .catch((err) => {
        allProductsPromise = null;
        throw err;
      });
  }
  return allProductsPromise;
}

export async function getProduct(id, options) {
  const numeric = Number(id);
  if (numeric >= 1000) {
    const found = extra.find((p) => p.id === numeric);
    if (!found) throw new Error("Product not found");
    return found;
  }
  return request(`/products/${id}`, options);
}

export async function searchProducts(q, limit = 40) {
  const query = q.trim();
  if (!query) return [];
  const data = await request(
    `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&select=${LIST_FIELDS}`
  );
  const lower = query.toLowerCase();
  const localMatches = extra.filter(
    (p) =>
      p.title.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.toLowerCase().includes(lower))
  );
  return [...data.products, ...localMatches];
}

export async function getProductsByCategory(slug) {
  const all = await getAllProducts();

  if (!slug || slug === "all") return all;

  // Others = main 6 group e nei emn shob category
  if (slug === "others") {
    return all.filter((p) => !MAIN_SOURCES.has(p.category));
  }

  const group = findGroup(slug);
  const sources = group ? group.sources : [slug];
  const seen = new Set();
  return all.filter((p) => {
    if (!sources.includes(p.category) || seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export async function getCategoryList() {
  const all = await getAllProducts();
  return [...new Set(all.map((p) => p.category))].sort();
}

/* ---------------- auth ---------------- */

export async function apiLogin(username, password) {
  const data = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
  let profile = {};
  try {
    profile = await request("/auth/me", {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });
  } catch {}
  return { ...profile, ...data };
}

export async function apiCreateCart(userId, items) {
  return request("/carts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      products: items.map((i) => ({ id: i.id, quantity: i.quantity })),
    }),
  });
}