"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/api";
import ProductGrid, { ErrorState, ProductSkeletons } from "@/components/ProductGrid";

const Featured = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const all = await getAllProducts();
      // featured = best rated products
      const top = [...all].sort((a, b) => b.rating - a.rating).slice(0, 8);
      setProducts(top);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="pt-5 mt-5 pb-8 md:pt-16 md:mt-16 md:pb-16 bg-g">
      <div className="container">
        <div className="flex items-end justify-between">
          <h2 className="text-left">Featured Products</h2>
          <Link
            href="/products"
            className="font-inter text-sm font-semibold text-blue hover:underline md:pt-16"
          >
            View All →
          </Link>
        </div>

        <div className="mt-6 md:mt-8">
          {loading && <ProductSkeletons count={8} />}
          {error && <ErrorState message={error} onRetry={load} />}
          {!loading && !error && <ProductGrid products={products} />}
        </div>

        {!loading && !error && (
          <div className="mt-8 text-center">
            <Link href="/products" className="btn-primary">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Featured;
