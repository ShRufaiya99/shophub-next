"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ShopPage from "@/components/ShopPage";

function ProductsInner() {
  // /products?category=laptops pre-selects a category in the sidebar
  const category = useSearchParams().get("category") || "all";
  return <ShopPage key={category} slug="all" initialSub={category} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-12"><div className="skeleton h-96" /></div>}>
      <ProductsInner />
    </Suspense>
  );
}
