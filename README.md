# ShopHub (Next.js + Tailwind CSS v4)

## Run
1. Copy your old Vite `public/img` folder into this project's `public/img` (same file names).
   Also copy `public/favicon.svg` if you want your favicon.
2. `npm install`
3. `npm run dev` -> http://localhost:3000

## Demo login
username: `emilys`  password: `emilyspass` (DummyJSON). You can also register a new account
(stored in this browser's localStorage only).

## Data
- Products, search, categories, login: https://dummyjson.com
- "Books" products: `data/extra-products.json` (DummyJSON has no books)
- localStorage keys: `shophub:auth`, `shophub:cart`, `shophub:wishlist`, `shophub:orders`,
  `shophub:users`, `shophub:newsletter`

## Structure
- `app/` pages: home, products, category/[slug], product/[id], search, cart, checkout, login, dashboard, deals, categories, about
- `components/` Header, Hero, Category, Featured, Deals, Footer, ProductCard ...
- `lib/api.js` all API calls, `components/AppProvider.jsx` cart/auth/wishlist/orders state
