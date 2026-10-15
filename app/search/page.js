"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductGrid, { EmptyState, ErrorState, ProductSkeletons } from "@/components/ProductGrid";
import { searchProducts } from "@/lib/api";

function SearchInner() {
  const q = (useSearchParams().get("q") || "").trim();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async () => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setResults(await searchProducts(q, 60));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    run();
  }, [run]);

  return (
    <div className="container py-8 md:py-12">
      <h1 className="page-title">{q ? `Search results for "${q}"` : "Search"}</h1>
      {q && !loading && !error && (
        <p className="mt-1 font-inter text-sm text-gray">
          {results.length} product{results.length === 1 ? "" : "s"} found
        </p>
      )}

      <div className="mt-6">
        {!q && (
          <EmptyState title="Type something to search" text="Use the search bar at the top of the page." />
        )}
        {q && loading && <ProductSkeletons count={8} />}
        {error && <ErrorState message={error} onRetry={run} />}
        {q && !loading && !error && results.length === 0 && (
          <EmptyState title="No products found" text="Check the spelling or try a more general word.">
            <Link href="/products" className="btn-primary">Browse all products</Link>
          </EmptyState>
        )}
        {!loading && !error && results.length > 0 && <ProductGrid products={results} />}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-12"><div className="skeleton h-96" /></div>}>
      <SearchInner />
    </Suspense>
  );
}
