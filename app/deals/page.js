"use client";

import ProductBrowser from "@/components/ProductBrowser";
import { getAllProducts } from "@/lib/api";

const SKY = "#469BD6";

// Deals = every product with at least 10% off
const loadDeals = async () => {
  const all = await getAllProducts();
  return all.filter((p) => p.discountPercentage >= 10);
};

// Same blue clouds as the bottom of the About page
function Clouds({ className = "" }) {
  return (
    <svg
      viewBox="0 0 640 260"
      preserveAspectRatio="xMaxYMax meet"
      className={`pointer-events-none absolute bottom-0 right-0 ${className}`}
      aria-hidden="true"
    >
      <g fill="#9CC8EA">
        <circle cx="90" cy="225" r="60" />
        <circle cx="330" cy="150" r="80" />
        <circle cx="470" cy="85" r="85" />
      </g>
      <g fill={SKY}>
        <circle cx="130" cy="230" r="70" />
        <circle cx="260" cy="175" r="95" />
        <circle cx="405" cy="200" r="80" />
        <circle cx="525" cy="115" r="105" />
        <circle cx="610" cy="205" r="90" />
        <rect x="60" y="225" width="620" height="60" />
      </g>
    </svg>
  );
}

export default function DealsPage() {
  return (
    // pale About-page tint, with the blue clouds sitting at the bottom
    <div className="relative overflow-hidden bg-[#F2F8FD] pb-44 sm:pb-56">
      <div className="relative z-10">
        <ProductBrowser
          title="Today's Deals"
          titleColor="#2F6EA8"
          description="Products with 10% off or more. Prices already include the discount."
          loader={loadDeals}
          defaultSort="discount"
          crumbs={[{ label: "Deals" }]}
        />
      </div>

      <Clouds className="w-72 max-w-full sm:w-120 lg:w-160" />
    </div>
  );
}