"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, LayoutDashboard, LogOut, Package, ShoppingCart, User, Wallet } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import ProductGrid, { EmptyState } from "@/components/ProductGrid";
import { formatDate, money } from "@/lib/format";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "profile", label: "Profile", icon: User },
];

function OrderCard({ order }) {
  return (
    <div className="rounded-lg border border-border-btn p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-inter font-semibold text-black">{order.id}</p>
          <p className="font-inter text-xs text-gray">{formatDate(order.createdAt)} · {order.payment}</p>
        </div>
        <div className="text-right">
          <span className="rounded-full bg-sky px-3 py-1 font-inter text-xs font-semibold text-blue">{order.status}</span>
          <p className="mt-1 font-inter font-bold">{money(order.total)}</p>
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-3 border-t border-border-btn pt-3">
        {order.items.map((i) => (
          <li key={i.id}>
            <Link href={`/product/${i.id}`} className="flex items-center gap-2 font-inter text-sm hover:text-blue">
              <img src={i.thumbnail} alt="" className="h-10 w-10 rounded bg-g object-contain" />
              <span className="max-w-40 truncate">{i.title} × {i.quantity}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProfileForm({ user }) {
  const { updateProfile } = useApp();
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
  });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateProfile(form);
      }}
      className="max-w-xl space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="p-first">First name</label>
          <input id="p-first" className="field" required value={form.firstName} onChange={set("firstName")} />
        </div>
        <div>
          <label className="label" htmlFor="p-last">Last name</label>
          <input id="p-last" className="field" value={form.lastName} onChange={set("lastName")} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="p-email">Email</label>
        <input id="p-email" type="email" className="field" required value={form.email} onChange={set("email")} />
      </div>
      <div>
        <label className="label" htmlFor="p-phone">Phone</label>
        <input id="p-phone" type="tel" className="field" value={form.phone} onChange={set("phone")} />
      </div>
      <div>
        <label className="label" htmlFor="p-address">Address</label>
        <input id="p-address" className="field" value={form.address} onChange={set("address")} />
      </div>
      <button type="submit" className="btn-primary">Save changes</button>
    </form>
  );
}

function DashboardInner() {
  const router = useRouter();
  const tab = useSearchParams().get("tab") || "overview";
  const { hydrated, user, logout, orders, wishlist, cartCount } = useApp();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login?next=/dashboard");
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="container py-12">
        <div className="skeleton h-96" />
      </div>
    );
  }

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const stats = [
    { label: "Orders", value: orders.length, icon: Package },
    { label: "Wishlist", value: wishlist.length, icon: Heart },
    { label: "Items in cart", value: cartCount, icon: ShoppingCart },
    { label: "Total spent", value: money(totalSpent), icon: Wallet },
  ];

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-wrap items-center gap-4">
        {user.image ? (
          <img src={user.image} alt="" className="h-14 w-14 rounded-full bg-sky object-cover" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue font-inter text-xl font-semibold text-white">
            {(user.firstName || user.username || "U").charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="page-title">Hello, {user.firstName || user.username}</h1>
          <p className="truncate font-inter text-sm text-gray">{user.email}</p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="btn-outline"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-border-btn">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/dashboard?tab=${t.id}`}
            replace
            scroll={false}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 font-inter text-sm font-semibold ${
              tab === t.id ? "border-blue text-blue" : "border-transparent text-gray hover:text-black"
            }`}
          >
            <t.icon size={16} /> {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-lg border border-border-btn bg-g p-4">
                  <s.icon size={20} className="text-blue" />
                  <p className="mt-2 font-inter text-2xl font-bold text-black">{s.value}</p>
                  <p className="font-inter text-sm text-gray">{s.label}</p>
                </div>
              ))}
            </div>
            <h3 className="mt-8 mb-3 font-inter text-lg font-bold">Recent orders</h3>
            {orders.length === 0 ? (
              <EmptyState title="No orders yet" text="Your orders will show up here.">
                <Link href="/products" className="btn-primary">Start shopping</Link>
              </EmptyState>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((o) => <OrderCard key={o.id} order={o} />)}
              </div>
            )}
          </>
        )}

        {tab === "orders" &&
          (orders.length === 0 ? (
            <EmptyState title="No orders yet" text="Your orders will show up here.">
              <Link href="/products" className="btn-primary">Start shopping</Link>
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => <OrderCard key={o.id} order={o} />)}
            </div>
          ))}

        {tab === "wishlist" &&
          (wishlist.length === 0 ? (
            <EmptyState title="Your wishlist is empty" text="Tap the heart on any product to save it here.">
              <Link href="/products" className="btn-primary">Browse products</Link>
            </EmptyState>
          ) : (
            <ProductGrid products={wishlist} />
          ))}

        {tab === "profile" && <ProfileForm key={user.id} user={user} />}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="container py-12"><div className="skeleton h-96" /></div>}>
      <DashboardInner />
    </Suspense>
  );
}
