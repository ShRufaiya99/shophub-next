"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductGrid, { EmptyState, ErrorState, ProductSkeletons } from "@/components/ProductGrid";
import { prettyCategory, salePrice } from "@/lib/format";

const PAGE_SIZE = 12;

const SORTS = {
  featured: { label: "Featured", fn: null },
  "price-asc": { label: "Price: Low to High", fn: (a, b) => salePrice(a) - salePrice(b) },
  "price-desc": { label: "Price: High to Low", fn: (a, b) => salePrice(b) - salePrice(a) },
  rating: { label: "Top Rated", fn: (a, b) => b.rating - a.rating },
  discount: { label: "Biggest Discount", fn: (a, b) => b.discountPercentage - a.discountPercentage },
  name: { label: "Name: A to Z", fn: (a, b) => a.title.localeCompare(b.title) },
};

/**
 * Generic product listing: loads products, then filter / sort / "load more".
 * Used by /products, /category/[slug] and /deals.
 */
export default function ProductBrowser({
  title,
  titleColor, // optional, e.g. "#2F6EA8" (used by /deals)
  description,
  loader,
  crumbs = [],
  defaultSort = "featured",
  initialCategory = "all",
  syncUrlPath, // e.g. "/products" -> keeps ?category= in the URL
  emptyText = "Try a different category or sort option.",
}) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState(defaultSort);
  const [category, setCategory] = useState(initialCategory);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await loader());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  }, [products]);

  const filtered = useMemo(() => {
    let list = category === "all" ? products : products.filter((p) => p.category === category);
    const fn = SORTS[sort]?.fn;
    if (fn) list = [...list].sort(fn);
    return list;
  }, [products, category, sort]);

  function changeCategory(value) {
    setCategory(value);
    setVisible(PAGE_SIZE);
    if (syncUrlPath) {
      router.replace(value === "all" ? syncUrlPath : `${syncUrlPath}?category=${value}`, {
        scroll: false,
      });
    }
  }

  return (
    <div className="container py-8 md:py-12">
      {crumbs.length > 0 && (
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 font-inter text-sm text-gray" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <span>/</span>
              {c.href ? (
                <Link href={c.href} className="hover:text-blue">{c.label}</Link>
              ) : (
                <span className="text-black">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <h1 className="page-title" style={titleColor ? { color: titleColor } : undefined}>
        {title}
      </h1>
      {description && <p className="mt-1 font-inter text-gray">{description}</p>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-inter text-sm text-gray">
          {loading ? "Loading..." : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {categories.length > 1 && (
            <select
              value={category}
              onChange={(e) => changeCategory(e.target.value)}
              className="field sm:w-56"
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {categories.map(([slug, count]) => (
                <option key={slug} value={slug}>
                  {prettyCategory(slug)} ({count})
                </option>
              ))}
            </select>
          )}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            className="field sm:w-52"
            aria-label="Sort products"
          >
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        {loading && <ProductSkeletons count={8} />}
        {error && <ErrorState message={error} onRetry={load} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState title="No products found" text={emptyText}>
            <Link href="/products" className="btn-primary">Browse all products</Link>
          </EmptyState>
        )}
        {!loading && !error && filtered.length > 0 && (
          <>
            <ProductGrid products={filtered.slice(0, visible)} />
            {visible < filtered.length && (
              <div className="mt-8 text-center">
                <button className="btn-outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load more ({filtered.length - visible} left)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}