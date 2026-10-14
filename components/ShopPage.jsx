"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Heart, Search, SlidersHorizontal } from "lucide-react";
import { getAllProducts } from "@/lib/api";
import { CATEGORY_GROUPS, MAIN_SOURCES } from "@/lib/categories";
import { useApp } from "@/components/AppProvider";
import { ErrorState } from "@/components/ProductGrid";
import { money, prettyCategory, salePrice } from "@/lib/format";
import { SORTS } from "@/lib/sorts";
import { COLORS, SIZES, getVariants } from "@/lib/variants";

const PAGE_SIZE = 12;

// "All" e Electronics age, Others (Beauty etc.) shobar shesh e
function groupRank(p) {
  const i = CATEGORY_GROUPS.findIndex((g) => g.sources.includes(p.category));
  return i === -1 ? CATEGORY_GROUPS.length : i;
}

const GRID_COLS = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

/* ---------------- small pieces ---------------- */

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="pb-8">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left font-inter text-[13px] font-semibold uppercase tracking-wide text-black cursor-pointer"
        aria-expanded={open}
      >
        {title}
        <ChevronUp size={14} className={`transition-transform ${open ? "" : "rotate-180"}`} />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </section>
  );
}

function PriceRange({ min, max, value, onChange }) {
  const [lo, hi] = value;
  const span = Math.max(1, max - min);
  const left = ((lo - min) / span) * 100;
  const right = ((hi - min) / span) * 100;
  return (
    <div>
      <div className="dual-range">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-border-btn" />
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-black"
          style={{ left: `${left}%`, width: `${Math.max(0, right - left)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          aria-label="Minimum price"
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - 1), hi])}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          aria-label="Maximum price"
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + 1)])}
        />
      </div>
      <div className="mt-3 flex justify-between font-inter text-[11px] text-gray">
        <span>Min Price: ${lo}</span>
        <span>Max Price: ${hi}</span>
      </div>
    </div>
  );
}

function ShopCard({ product, activeColor }) {
  const { addToCart, toggleWishlist, isWished } = useApp();
  const wished = isWished(product.id);
  const sale = salePrice(product);
  const hasDiscount = Number(product.discountPercentage) >= 1;
  const href = `/product/${product.id}`;

  const variantColors = getVariants(product).colors;
  const [picked, setPicked] = useState(null);

  // sidebar color change hole card er nijer pick reset hobe
  useEffect(() => {
    setPicked(null);
  }, [activeColor]);

  const current =
    picked || (activeColor && variantColors.includes(activeColor) ? activeColor : null);
  const hex = COLORS.find((c) => c.name === current)?.hex;

  return (
    <div className="group">
      <div
        className="relative aspect-15/16 overflow-hidden bg-[#F3EEEE] transition-colors duration-300"
        style={hex ? { backgroundColor: `${hex}33` } : undefined}
      >
        <Link href={href} className="block h-full w-full">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {hasDiscount && (
          <span className="absolute left-3 top-3 bg-black px-2 py-0.5 font-inter text-[11px] font-medium uppercase tracking-wide text-white">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="absolute inset-x-0 bottom-0 bg-white/95 py-3 text-center font-inter text-[12px] font-semibold uppercase tracking-wider text-black transition-transform hover:bg-black hover:text-white disabled:opacity-50 md:translate-y-full md:group-hover:translate-y-0 cursor-pointer"
        >
          {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-inter text-[11px] text-lightgray">{prettyCategory(product.category)}</p>
          <Link href={href}>
            <h3 className="mt-0.5 line-clamp-1 font-inter text-sm font-medium text-black hover:text-blue">
              {product.title}
            </h3>
          </Link>
          <p className="mt-0.5 font-inter text-sm text-black">
            {money(sale)}
            {hasDiscount && (
              <span className="ml-2 text-xs text-lightgray line-through">{money(product.price)}</span>
            )}
          </p>

          {/* color swatches */}
          <div className="mt-2 flex gap-2">
            {variantColors.map((name) => {
              const c = COLORS.find((x) => x.name === name);
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  aria-label={name}
                  aria-pressed={current === name}
                  onClick={() => setPicked(name)}
                  className={`h-3 w-3 rounded-full cursor-pointer ${
                    current === name ? "ring-1 ring-black ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: c?.hex }}
                />
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="mt-1 shrink-0 cursor-pointer"
        >
          <Heart size={16} className={wished ? "fill-red text-red" : "text-gray"} />
        </button>
      </div>
    </div>
  );
}

function pageList(total, current) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("…a");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…b");
  out.push(total);
  return out;
}

function Pagination({ page, total, onChange }) {
  if (total <= 1) return null;
  return (
    <nav
      className="mt-12 flex items-center justify-between font-inter text-[13px] uppercase tracking-wide"
      aria-label="Pagination"
    >
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="text-black disabled:text-lightgray cursor-pointer disabled:cursor-default"
      >
        ‹ Prev
      </button>
      <ul className="flex items-center gap-4 sm:gap-6">
        {pageList(total, page).map((p) =>
          typeof p === "string" ? (
            <li key={p} className="text-lightgray">…</li>
          ) : (
            <li key={p}>
              <button
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`cursor-pointer border-b pb-0.5 ${
                  p === page ? "border-black text-black" : "border-transparent text-gray hover:text-black"
                }`}
              >
                {p}
              </button>
            </li>
          )
        )}
      </ul>
      <button
        disabled={page === total}
        onClick={() => onChange(page + 1)}
        className="text-black disabled:text-lightgray cursor-pointer disabled:cursor-default"
      >
        Next ›
      </button>
    </nav>
  );
}

/* ---------------- main page ---------------- */

/**
 * "Shop" layout: filter sidebar (categories live here), product grid, pagination.
 * slug: "all" | one of the 6 main categories | "others" | any DummyJSON category slug
 */
export default function ShopPage({ slug = "all" }) {
  let cleanSlug = slug;
  try {
    cleanSlug = decodeURIComponent(slug);
  } catch {}

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // sub = "all" | group slug (electronics...) | "others" | raw category (beauty...)
  const [sub, setSub] = useState(cleanSlug);
  const [othersOpen, setOthersOpen] = useState(
    cleanSlug === "others" ||
      (cleanSlug !== "all" &&
        !CATEGORY_GROUPS.some((g) => g.slug === cleanSlug) &&
        !MAIN_SOURCES.has(cleanSlug))
  );
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandQuery, setBrandQuery] = useState("");
  const [price, setPrice] = useState(null);
  const [sort, setSort] = useState("featured");
  const [cols, setCols] = useState(2);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const title =
    sub === "all"
      ? "Shop"
      : sub === "others"
      ? "Others"
      : CATEGORY_GROUPS.find((g) => g.slug === sub)?.name || prettyCategory(sub);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await getAllProducts();
      setProducts(list);
      const prices = list.map(salePrice);
      if (prices.length) {
        setPrice([Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bounds = useMemo(() => {
    if (!products.length) return [0, 0];
    const prices = products.map(salePrice);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  // products of the selected category
  const base = useMemo(() => {
    if (sub === "all") return [...products].sort((a, b) => groupRank(a) - groupRank(b));
    if (sub === "others") return products.filter((p) => !MAIN_SOURCES.has(p.category));
    const g = CATEGORY_GROUPS.find((g) => g.slug === sub);
    if (g) return products.filter((p) => g.sources.includes(p.category));
    return products.filter((p) => p.category === sub);
  }, [products, sub]);

  // sidebar: the 6 home categories with counts
  const groupList = useMemo(
    () =>
      CATEGORY_GROUPS.map((g) => ({
        ...g,
        count: products.filter((p) => g.sources.includes(p.category)).length,
      })),
    [products]
  );

  // sidebar: "Others" dropdown items (everything not in the 6 groups)
  const otherCats = useMemo(() => {
    const m = {};
    products.forEach((p) => {
      if (!MAIN_SOURCES.has(p.category)) m[p.category] = (m[p.category] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => a[0].localeCompare(b[0]));
  }, [products]);

  const othersTotal = otherCats.reduce((n, [, c]) => n + c, 0);

  const brandCounts = useMemo(() => {
    const m = {};
    base.forEach((p) => {
      if (p.brand) m[p.brand] = (m[p.brand] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => a[0].localeCompare(b[0]));
  }, [base]);

  const availableColors = useMemo(() => {
    const set = new Set();
    base.forEach((p) => getVariants(p).colors.forEach((c) => set.add(c)));
    return COLORS.filter((c) => set.has(c.name));
  }, [base]);

  const availableSizes = useMemo(() => {
    const set = new Set();
    base.forEach((p) => getVariants(p).sizes.forEach((s) => set.add(s)));
    return SIZES.filter((s) => set.has(s));
  }, [base]);

  const filtered = useMemo(() => {
    let list = base;
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    if (colors.length) list = list.filter((p) => getVariants(p).colors.some((c) => colors.includes(c)));
    if (sizes.length) list = list.filter((p) => getVariants(p).sizes.some((s) => sizes.includes(s)));
    if (price) {
      list = list.filter((p) => {
        const s = salePrice(p);
        return s >= price[0] && s <= price[1];
      });
    }
    const fn = SORTS[sort]?.fn;
    if (fn) list = [...list].sort(fn);
    return list;
  }, [base, brands, colors, sizes, price, sort]);

  // back to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [sub, brands, colors, sizes, price, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const items = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const priceChanged = price && (price[0] !== bounds[0] || price[1] !== bounds[1]);
  const anyFilter =
    sub !== "all" || brands.length > 0 || colors.length > 0 || sizes.length > 0 || priceChanged;

  const toggle = (setter, value) =>
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  function pickCategory(value) {
    setSub(value);
    setBrands([]);
    setColors([]);
    setSizes([]);
  }

  function clearAll() {
    setSub("all");
    setBrands([]);
    setColors([]);
    setSizes([]);
    setBrandQuery("");
    setPrice(bounds[1] > 0 ? [...bounds] : null);
  }

  function changePage(p) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const visibleBrands = brandCounts.filter(([b]) =>
    b.toLowerCase().includes(brandQuery.trim().toLowerCase())
  );

  const catBtn = (active) =>
    `cursor-pointer text-left ${active ? "font-semibold text-black" : "text-gray hover:text-black"}`;

  return (
    <div className="container py-8 md:py-12">
      <h1 className="font-inter text-2xl font-semibold uppercase tracking-wide text-black md:text-[32px]">
        {title}
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr] lg:gap-12">
        {/* ---------- sidebar ---------- */}
        <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          {anyFilter && (
            <button
              onClick={clearAll}
              className="mb-6 font-inter text-xs font-semibold uppercase tracking-wide text-red hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          )}

          <FilterSection title="Product Categories">
            <ul className="space-y-2.5 font-inter text-xs">
              <li>
                <button onClick={() => pickCategory("all")} className={catBtn(sub === "all")}>
                  All products <span className="text-lightgray">({products.length})</span>
                </button>
              </li>

              {groupList.map((g) => (
                <li key={g.slug}>
                  <button onClick={() => pickCategory(g.slug)} className={catBtn(sub === g.slug)}>
                    {g.name} <span className="text-lightgray">({g.count})</span>
                  </button>
                </li>
              ))}

              {otherCats.length > 0 && (
                <li>
                  <button
                    onClick={() => {
                      pickCategory("others");
                      setOthersOpen((o) => !o);
                    }}
                    className={`flex items-center gap-1 ${catBtn(sub === "others")}`}
                  >
                    Others <span className="text-lightgray">({othersTotal})</span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform ${othersOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {othersOpen && (
                    <ul className="mt-2.5 ml-1 max-h-52 space-y-2 overflow-y-auto border-l border-border-btn pl-3">
                      {otherCats.map(([name, count]) => (
                        <li key={name}>
                          <button onClick={() => pickCategory(name)} className={catBtn(sub === name)}>
                            {prettyCategory(name)} <span className="text-lightgray">({count})</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )}
            </ul>
          </FilterSection>

          {availableColors.length > 0 && (
            <FilterSection title="Color">
              <div className="flex flex-wrap gap-3">
                {availableColors.map((c) => {
                  const on = colors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      title={c.name}
                      aria-label={c.name}
                      aria-pressed={on}
                      onClick={() => toggle(setColors, c.name)}
                      className={`h-3.5 w-3.5 rounded-full cursor-pointer ${
                        on ? "ring-1 ring-black ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
              </div>
            </FilterSection>
          )}

          {availableSizes.length > 0 && (
            <FilterSection title="Sizes">
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((s) => {
                  const on = sizes.includes(s);
                  return (
                    <button
                      key={s}
                      aria-pressed={on}
                      onClick={() => toggle(setSizes, s)}
                      className={`min-w-10 border px-3 py-1.5 font-inter text-[11px] uppercase cursor-pointer ${
                        on
                          ? "border-black bg-black text-white"
                          : "border-border-btn text-primary hover:border-black"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          )}

          {brandCounts.length > 0 && (
            <FilterSection title="Brands">
              <div className="relative">
                <input
                  value={brandQuery}
                  onChange={(e) => setBrandQuery(e.target.value)}
                  placeholder="Search"
                  aria-label="Search brands"
                  className="h-10 w-full border border-border-btn px-3 pr-9 font-inter text-xs outline-none placeholder:text-secondary focus:border-black"
                />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray" />
              </div>
              <ul className="mt-3 max-h-56 space-y-2.5 overflow-y-auto pr-1">
                {visibleBrands.length === 0 && (
                  <li className="font-inter text-xs text-gray">No brands found</li>
                )}
                {visibleBrands.map(([b, count]) => (
                  <li key={b}>
                    <label className="flex cursor-pointer items-center justify-between gap-2 font-inter text-xs text-primary">
                      <span className="flex min-w-0 items-center gap-2">
                        <input
                          type="checkbox"
                          checked={brands.includes(b)}
                          onChange={() => toggle(setBrands, b)}
                          className="h-3 w-3 accent-black"
                        />
                        <span className="truncate">{b}</span>
                      </span>
                      <span className="text-lightgray">{count}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </FilterSection>
          )}

          {price && bounds[1] > bounds[0] && (
            <FilterSection title="Price">
              <PriceRange min={bounds[0]} max={bounds[1]} value={price} onChange={setPrice} />
            </FilterSection>
          )}
        </aside>

        {/* ---------- products ---------- */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 font-inter text-[11px] uppercase tracking-wide">
            <nav className="text-black" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue">Home</Link>
              <span className="mx-1">/</span>
              <span className="text-gray">The Shop</span>
              {sub !== "all" && (
                <>
                  <span className="mx-1">/</span>
                  <span className="text-gray">{title}</span>
                </>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setFiltersOpen((o) => !o)}
                className="flex items-center gap-1 font-semibold lg:hidden cursor-pointer"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
                className="cursor-pointer bg-transparent font-medium uppercase tracking-wide outline-none"
              >
                {Object.entries(SORTS).map(([key, s]) => (
                  <option key={key} value={key}>
                    {s.label}
                  </option>
                ))}
              </select>

              <span className="hidden h-4 w-px bg-border-btn md:block" />

              <div className="hidden items-center gap-3 md:flex">
                <span className="text-gray">View</span>
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCols(n)}
                    aria-pressed={cols === n}
                    className={`cursor-pointer border-b pb-0.5 ${
                      cols === n ? "border-black text-black" : "border-transparent text-gray hover:text-black"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-2 font-inter text-xs text-gray">
            {loading ? "Loading..." : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
          </p>

          <div className="mt-5">
            {loading && (
              <div className={`grid grid-cols-2 gap-x-4 gap-y-8 ${GRID_COLS[cols]}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="skeleton aspect-15/16 w-full rounded-none" />
                    <div className="skeleton mt-3 h-3 w-1/3 rounded-none" />
                    <div className="skeleton mt-2 h-4 w-2/3 rounded-none" />
                  </div>
                ))}
              </div>
            )}

            {error && <ErrorState message={error} onRetry={load} />}

            {!loading && !error && filtered.length === 0 && (
              <div className="bg-g p-10 text-center">
                <p className="font-inter text-lg font-semibold text-black">No products match your filters</p>
                <p className="mt-1 font-inter text-sm text-gray">Try removing some filters.</p>
                <button onClick={clearAll} className="btn-primary mt-4">Clear all filters</button>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <>
                <div className={`grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 ${GRID_COLS[cols]}`}>
                  {items.map((p) => (
                    <ShopCard key={p.id} product={p} activeColor={colors[0]} />
                  ))}
                </div>
                <Pagination page={safePage} total={totalPages} onChange={changePage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
