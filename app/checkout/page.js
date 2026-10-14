"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { EmptyState } from "@/components/ProductGrid";
import { money } from "@/lib/format";

export default function CheckoutPage() {
  const { hydrated, user, cart, cartSubtotal, shipping, cartTotal, placeOrder } = useApp();
  const [placed, setPlaced] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    payment: "Cash on delivery",
  });

  // prefill from the profile once the user is known
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      fullName: f.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      phone: f.phone || user.phone || "",
      address: f.address || user.address || "",
    }));
  }, [user]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      setPlaced(await placeOrder(form));
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="container py-12">
        <div className="skeleton h-64" />
      </div>
    );
  }

  if (placed) {
    return (
      <div className="container max-w-xl py-16 text-center">
        <CheckCircle2 size={56} className="mx-auto text-green" />
        <h1 className="page-title mt-4">Order placed!</h1>
        <p className="mt-2 font-inter text-gray">
          Thank you, your order <span className="font-semibold text-black">{placed.id}</span> is being processed.
          Total: {money(placed.total)}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard?tab=orders" className="btn-primary">View my orders</Link>
          <Link href="/products" className="btn-outline">Keep shopping</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container py-12">
        <EmptyState title="Your cart is empty" text="Add some products before checking out.">
          <Link href="/products" className="btn-primary">Browse products</Link>
        </EmptyState>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-12">
        <EmptyState title="Please log in to checkout" text="Your cart will be saved while you log in.">
          <Link href="/login?next=/checkout" className="btn-primary">Login / Register</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="page-title">Checkout</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-border-btn p-5">
          <h3 className="font-inter text-lg font-bold">Shipping details</h3>
          <div>
            <label className="label" htmlFor="fullName">Full name</label>
            <input id="fullName" className="field" required value={form.fullName} onChange={set("fullName")} />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" className="field" required type="tel" value={form.phone} onChange={set("phone")} />
          </div>
          <div>
            <label className="label" htmlFor="address">Address</label>
            <input id="address" className="field" required value={form.address} onChange={set("address")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="city">City</label>
              <input id="city" className="field" required value={form.city} onChange={set("city")} />
            </div>
            <div>
              <label className="label" htmlFor="postalCode">Postal code</label>
              <input id="postalCode" className="field" required value={form.postalCode} onChange={set("postalCode")} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="payment">Payment method</label>
            <select id="payment" className="field" value={form.payment} onChange={set("payment")}>
              <option>Cash on delivery</option>
              <option>Card (demo, no real payment)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Placing order..." : `Place order · ${money(cartTotal)}`}
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-border-btn bg-g p-5">
          <h3 className="font-inter text-lg font-bold">Your items</h3>
          <ul className="mt-3 space-y-3">
            {cart.map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                <img src={i.thumbnail} alt="" className="h-12 w-12 rounded bg-white object-contain" />
                <p className="min-w-0 flex-1 truncate font-inter text-sm">
                  {i.title} <span className="text-gray">× {i.quantity}</span>
                </p>
                <p className="font-inter text-sm font-medium">{money(i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border-btn pt-4 font-inter text-sm">
            <div className="flex justify-between"><dt className="text-gray">Subtotal</dt><dd>{money(cartSubtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray">Shipping</dt><dd>{shipping === 0 ? "Free" : money(shipping)}</dd></div>
            <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd>{money(cartTotal)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
