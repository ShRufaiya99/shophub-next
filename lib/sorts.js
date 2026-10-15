import { salePrice } from "@/lib/format";

export const SORTS = {
  featured: { label: "Default sorting", fn: null },
  "price-asc": { label: "Price: Low to High", fn: (a, b) => salePrice(a) - salePrice(b) },
  "price-desc": { label: "Price: High to Low", fn: (a, b) => salePrice(b) - salePrice(a) },
  rating: { label: "Top rated", fn: (a, b) => b.rating - a.rating },
  discount: { label: "Biggest discount", fn: (a, b) => b.discountPercentage - a.discountPercentage },
  name: { label: "Name: A to Z", fn: (a, b) => a.title.localeCompare(b.title) },
};
