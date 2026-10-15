export const SHIPPING_FREE_OVER = 50;
export const SHIPPING_FEE = 5.99;

export function money(n) {
  const v = Number(n) || 0;
  return `$${v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// DummyJSON price is the list price; discountPercentage is applied on top.
export function salePrice(p) {
  const d = Number(p?.discountPercentage) || 0;
  return Math.round(Number(p.price) * (1 - d / 100) * 100) / 100;
}

export function prettyCategory(slug = "") {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
