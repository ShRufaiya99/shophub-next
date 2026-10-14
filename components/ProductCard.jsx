"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { money, salePrice } from "@/lib/format";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWished } = useApp();
  const wished = isWished(product.id);
  const sale = salePrice(product);
  const hasDiscount = Number(product.discountPercentage) >= 1;
  const href = `/product/${product.id}`;

  return (
    <div className="block-F relative">
      <button
        type="button"
        onClick={() => toggleWishlist(product)}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow cursor-pointer"
      >
        <Heart
          size={18}
          className={wished ? "fill-red text-red" : "text-gray"}
        />
      </button>
      {hasDiscount && (
        <span className="absolute left-6 top-6 z-10 rounded-full bg-red px-2 py-0.5 font-inter text-xs font-semibold text-white">
          -{Math.round(product.discountPercentage)}%
        </span>
      )}

      <Link href={href} className="block aspect-square overflow-hidden rounded-lg bg-g">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </Link>

      <Link href={href}>
        <h3 className="F-h3 hover:text-blue transition-colors">{product.title}</h3>
      </Link>
      <p className="F-p">{product.description}</p>

      <div className="mt-auto flex items-center justify-between pt-3">
        <div>
          <p className="F-p2">{money(sale)}</p>
          {hasDiscount && (
            <p className="font-inter text-xs text-lightgray line-through">
              {money(product.price)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          aria-label={`Add ${product.title} to cart`}
          className="cursor-pointer transition-transform hover:scale-105 disabled:opacity-40"
        >
          <img src="/img/shopbtn.png" alt="" className="h-10 w-10 object-contain" />
        </button>
      </div>
    </div>
  );
}
