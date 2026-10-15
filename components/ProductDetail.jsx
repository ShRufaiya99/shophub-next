"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import Stars from "@/components/Stars";
import ProductGrid from "@/components/ProductGrid";
import { getProductsByCategory } from "@/lib/api";
import { formatDate, money, prettyCategory, salePrice } from "@/lib/format";

export default function ProductDetail({ product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWished } = useApp();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);

  const images = product.images?.length ? product.images : [product.thumbnail];
  const sale = salePrice(product);
  const hasDiscount = Number(product.discountPercentage) >= 1;
  const outOfStock = product.stock === 0;
  const wished = isWished(product.id);

  useEffect(() => {
    setActiveImg(0);
    setQty(1);
    let cancelled = false;
    getProductsByCategory(product.category)
      .then((list) => {
        if (!cancelled) setRelated(list.filter((p) => p.id !== product.id).slice(0, 4));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [product.id, product.category]);

  function buyNow() {
    addToCart(product, qty);
    router.push("/checkout");
  }

  return (
    <div className="container py-8 md:py-12">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 font-inter text-sm text-gray" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.category}`} className="hover:text-blue">
          {prettyCategory(product.category)}
        </Link>
        <span>/</span>
        <span className="text-black">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-border-btn bg-g">
            <img src={images[activeImg]} alt={product.title} className="h-full w-full object-contain" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-g cursor-pointer ${
                    i === activeImg ? "border-blue" : "border-border-btn"
                  }`}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div>
          {product.brand && (
            <p className="font-inter text-sm font-medium uppercase tracking-wide text-blue">{product.brand}</p>
          )}
          <h1 className="page-title mt-1">{product.title}</h1>

          <div className="mt-2 flex items-center gap-3">
            <Stars rating={product.rating} size={16} />
            {product.reviews?.length > 0 && (
              <span className="font-inter text-sm text-gray">({product.reviews.length} reviews)</span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-inter text-3xl font-bold text-black">{money(sale)}</span>
            {hasDiscount && (
              <>
                <span className="font-inter text-lg text-lightgray line-through">{money(product.price)}</span>
                <span className="rounded-full bg-red px-2.5 py-0.5 font-inter text-xs font-semibold text-white">
                  -{Math.round(product.discountPercentage)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-4 font-inter leading-7 text-gray">{product.description}</p>

          <p className={`mt-4 font-inter text-sm font-medium ${outOfStock ? "text-red" : "text-green"}`}>
            {outOfStock
              ? "Out of stock"
              : product.stock <= 10
              ? `Only ${product.stock} left in stock`
              : "In stock"}
          </p>

          {/* quantity + actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-border-btn">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2.5 sm:p-3 text-primary hover:bg-g cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-inter font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                className="p-2.5 sm:p-3 text-primary hover:bg-g cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <button className="btn-primary flex-1 sm:flex-initial" disabled={outOfStock} onClick={() => addToCart(product, qty)}>
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="btn-outline flex-1 sm:flex-initial" disabled={outOfStock} onClick={buyNow}>
              Buy Now
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-lg border border-border-btn hover:bg-g cursor-pointer"
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={20} className={wished ? "fill-red text-red" : "text-gray"} />
            </button>
          </div>

          {/* perks */}
          <ul className="mt-8 space-y-3 font-inter text-sm text-gray">
            {product.shippingInformation && (
              <li className="flex items-center gap-2"><Truck size={18} className="text-blue" /> {product.shippingInformation}</li>
            )}
            {product.warrantyInformation && (
              <li className="flex items-center gap-2"><ShieldCheck size={18} className="text-blue" /> {product.warrantyInformation}</li>
            )}
            {product.returnPolicy && (
              <li className="flex items-center gap-2"><RotateCcw size={18} className="text-blue" /> {product.returnPolicy}</li>
            )}
          </ul>

          {/* details */}
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg bg-g p-4 font-inter text-sm">
            <dt className="text-gray">Category</dt>
            <dd className="text-black">{prettyCategory(product.category)}</dd>
            {product.sku && (<><dt className="text-gray">SKU</dt><dd className="text-black">{product.sku}</dd></>)}
            {product.weight != null && (<><dt className="text-gray">Weight</dt><dd className="text-black">{product.weight}</dd></>)}
            {product.dimensions && (
              <>
                <dt className="text-gray">Dimensions</dt>
                <dd className="text-black">
                  {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth}
                </dd>
              </>
            )}
            {product.minimumOrderQuantity > 1 && (
              <><dt className="text-gray">Minimum order</dt><dd className="text-black">{product.minimumOrderQuantity}</dd></>
            )}
          </dl>

          {product.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span key={t} className="rounded-full bg-sky px-3 py-1 font-inter text-xs text-blue">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* reviews */}
      {product.reviews?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-left! pt-0! md:pt-0!">Customer Reviews</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {product.reviews.map((r, i) => (
              <div key={i} className="rounded-lg border border-border-btn p-4">
                <Stars rating={r.rating} showValue={false} />
                <p className="mt-2 font-inter text-sm text-black">{r.comment}</p>
                <p className="mt-3 font-inter text-xs text-gray">
                  {r.reviewerName} · {formatDate(r.date)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-left! pt-0! md:pt-0! mb-4">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
