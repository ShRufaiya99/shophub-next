// Home e shudhu CATEGORY_GROUPS (6 ta) dekhabe.
// Shop page e tab/sidebar e Others o thakbe.
export const CATEGORY_GROUPS = [
  {
    slug: "electronics",
    name: "Electronics",
    img: "/img/pc.png",
    sources: ["smartphones", "laptops", "tablets", "mobile-accessories"],
  },
  {
    slug: "fashion",
    name: "Fashion",
    img: "/img/dress.png",
    sources: [
      "mens-shirts",
      "mens-shoes",
      "mens-watches",
      "womens-bags",
      "womens-dresses",
      "womens-jewellery",
      "womens-shoes",
      "womens-watches",
      "tops",
      "sunglasses",
    ],
  },
  {
    slug: "home",
    name: "Home",
    img: "/img/home.png",
    sources: ["furniture", "home-decoration", "kitchen-accessories"],
  },
  {
    slug: "sports",
    name: "Sports",
    img: "/img/sport.png",
    sources: ["sports-accessories"],
  },
  {
    slug: "books",
    name: "Books",
    img: "/img/book.png",
    sources: ["books"],
  },
  {
    slug: "gaming",
    name: "Gaming",
    img: "/img/game.png",
    sources: ["laptops", "mobile-accessories", "tablets"],
  },
];

// Main 6 group e nei emn shob category ekhane jabe (automatic)
export const OTHERS_GROUP = {
  slug: "others",
  name: "Others",
  sources: [],
};

export const SHOP_GROUPS = [...CATEGORY_GROUPS, OTHERS_GROUP];

export const MAIN_SOURCES = new Set(CATEGORY_GROUPS.flatMap((g) => g.sources));

export function findGroup(slug) {
  return SHOP_GROUPS.find((g) => g.slug === slug);
}