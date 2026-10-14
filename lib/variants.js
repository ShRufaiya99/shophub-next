// DEMO DATA: DummyJSON has no colors or sizes, so the Color / Size filters in the
// shop page use values generated from the product id (always the same for the same
// product). Replace getVariants() with real fields when you have a real API.

export const COLORS = [
  { name: "Navy", hex: "#1E2A6B" },
  { name: "Gold", hex: "#D8B04A" },
  { name: "Black", hex: "#222222" },
  { name: "Sky", hex: "#B7C9E2" },
  { name: "Brown", hex: "#A56B3C" },
  { name: "Tan", hex: "#C9A24D" },
  { name: "Peach", hex: "#E8B4A0" },
  { name: "Grey", hex: "#B5B0B0" },
  { name: "Rose", hex: "#D46A6A" },
  { name: "Sage", hex: "#CFD3C0" },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const APPAREL = new Set([
  "mens-shirts",
  "womens-dresses",
  "tops",
  "mens-shoes",
  "womens-shoes",
]);

export function getVariants(product) {
  const id = Number(product.id) || 0;
  const count = 2 + (id % 3);
  const colors = [];
  for (let k = 0; k < count; k++) {
    colors.push(COLORS[(id + k * 3) % COLORS.length].name);
  }
  const sizes = APPAREL.has(product.category)
    ? SIZES.filter((_, i) => (id + i) % 4 !== 0)
    : [];
  return { colors: [...new Set(colors)], sizes };
}
