"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { EmptyState } from "@/components/ProductGrid";
import { SHIPPING_FREE_OVER, money } from "@/lib/format";

export default function CartPage() {
  const {
    hydrated,
    cart,
    cartCount,
    cartSubtotal,
    shipping,
    cartTotal,
    setQuantity,
    removeFromCart,
    clearCart,
  } = useApp();

  if (!hydrated) {
    return (
      <div className="container py-12">
        <div className="skeleton h-64" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState title="Your cart is empty" text="Looks like you haven't added anything yet.">
          <Link href="/products" className="btn-primary">
            <ShoppingBag size={18} /> Start shopping
          </Link>
        </EmptyState>
      </div>
    );
  }

  const remainingForFree = Math.max(0, SHIPPING_FREE_OVER - cartSubtotal);

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Shopping Cart ({cartCount})</h1>
        <button onClick={clearCart} className="font-inter text-sm text-red hover:underline cursor-pointer">
          Clear cart
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {cart.map((item) => (
            <li key={item.id} className="flex gap-4 rounded-lg border border-border-btn p-4">
              <Link href={`/product/${item.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-g">
                <img src={item.thumbnail} alt={item.title} className="h-full w-full object-contain" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/product/${item.id}`} className="block truncate font-inter font-semibold text-black hover:text-blue">
                      {item.title}
                    </Link>
                    {item.brand && <p className="font-inter text-sm text-gray">{item.brand}</p>}
                  </div>
                  <p className="font-inter font-bold text-black">{money(item.price * item.quantity)}</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-border-btn">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-primary hover:bg-g cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-inter text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 text-primary hover:bg-g disabled:opacity-40 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="hidden font-inter text-sm text-gray sm:block">{money(item.price)} each</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-1 font-inter text-sm text-red hover:underline cursor-pointer"
                  >
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-lg border border-border-btn bg-g p-5">
          <h3 className="font-inter text-lg font-bold text-black">Order Summary</h3>
          <dl className="mt-4 space-y-3 font-inter text-sm">
            <div className="flex justify-between">
              <dt className="text-gray">Subtotal</dt>
              <dd className="font-medium text-black">{money(cartSubtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray">Shipping</dt>
              <dd className="font-medium text-black">{shipping === 0 ? "Free" : money(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border-btn pt-3 text-base">
              <dt className="font-semibold text-black">Total</dt>
              <dd className="font-bold text-black">{money(cartTotal)}</dd>
            </div>
          </dl>
          {remainingForFree > 0 && (
            <p className="mt-3 font-inter text-xs text-blue">
              Add {money(remainingForFree)} more to get free shipping!
            </p>
          )}
          <Link href="/checkout" className="btn-primary mt-5 w-full">
            Proceed to Checkout
          </Link>
          <Link href="/products" className="mt-3 block text-center font-inter text-sm text-blue hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
