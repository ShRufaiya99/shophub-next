"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Heart, Package } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { searchProducts } from "@/lib/api";
import { money, salePrice } from "@/lib/format";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "About", href: "/about" },
];

function SearchBox({ onDone, className = "" }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  // live suggestions (debounced) from the DummyJSON search API
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const data = await searchProducts(term, 5);
        if (!cancelled) setResults(data.slice(0, 5));
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit(e) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    onDone?.();
  }

  function pick() {
    setOpen(false);
    setQ("");
    onDone?.();
  }

  return (
    <form onSubmit={submit} className={`relative ${className}`} ref={boxRef} role="search">
      <input
        type="text"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="search-input"
        placeholder="Search Products..."
        aria-label="Search products"
      />
      <img
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        src="/img/search.svg"
        alt=""
      />

      {open && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border-btn bg-white shadow-lg">
          {loading && (
            <p className="px-4 py-3 font-inter text-sm text-gray">Searching...</p>
          )}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 font-inter text-sm text-gray">No products found</p>
          )}
          {!loading &&
            results.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                onClick={pick}
                className="flex items-center gap-3 px-3 py-2 hover:bg-g"
              >
                <img src={p.thumbnail} alt="" className="h-10 w-10 rounded bg-g object-contain" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-inter text-sm font-medium text-black">{p.title}</span>
                  <span className="block font-inter text-xs text-gray">{money(salePrice(p))}</span>
                </span>
              </Link>
            ))}
          {!loading && results.length > 0 && (
            <button
              type="submit"
              className="w-full border-t border-border-btn px-4 py-2 text-left font-inter text-sm font-semibold text-blue hover:bg-g cursor-pointer"
            >
              See all results for &quot;{q.trim()}&quot;
            </button>
          )}
        </div>
      )}
    </form>
  );
}

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, cartCount, hydrated } = useApp();
  const [menu, setMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // close menus whenever the page changes
  useEffect(() => {
    setMenu(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  function handleLogout() {
    setProfileOpen(false);
    logout();
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container">
        <div className="flex items-center p-4">
          <Link href="/" aria-label="ShopHub home">
            <img src="/img/ShopHub.png" alt="ShopHub" />
          </Link>

          <ul className="ml-4 hidden gap-5 md:flex lg:ml-[31.52px] lg:gap-[31.19px]">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`list-item ${isActive(n.href) ? "text-blue! font-medium" : ""}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>

          <SearchBox className="ml-4 hidden w-44 md:block lg:w-72 xl:ml-20.25 xl:w-lg" />

          <div className="ml-auto flex items-center gap-3 md:gap-4">
            <Link href="/cart" className="relative p-1.5 text-primary hover:text-blue" aria-label="Cart">
              <ShoppingCart size={26} />
              {hydrated && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-border-btn bg-red px-1 font-inter text-xs font-semibold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={profileRef}>
              {user ? (
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center rounded-full p-1.5 text-primary hover:text-blue cursor-pointer"
                  aria-label="Account menu"
                  aria-expanded={profileOpen}
                >
                  {user.image ? (
                    <img src={user.image} alt="" className="h-7 w-7 rounded-full bg-sky object-cover" />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue font-inter text-xs font-semibold text-white">
                      {(user.firstName || user.username || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>
              ) : (
                <Link href="/login" className="block p-1.5 text-primary hover:text-blue" aria-label="Login">
                  <User size={26} />
                </Link>
              )}

              {user && profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border-btn bg-white shadow-lg">
                  <div className="border-b border-border-btn px-4 py-3">
                    <p className="truncate font-inter text-sm font-semibold text-black">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate font-inter text-xs text-gray">{user.email}</p>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 font-inter text-sm text-primary hover:bg-g">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link href="/dashboard?tab=orders" className="flex items-center gap-2 px-4 py-2.5 font-inter text-sm text-primary hover:bg-g">
                    <Package size={16} /> My Orders
                  </Link>
                  <Link href="/dashboard?tab=wishlist" className="flex items-center gap-2 px-4 py-2.5 font-inter text-sm text-primary hover:bg-g">
                    <Heart size={16} /> Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-border-btn px-4 py-2.5 text-left font-inter text-sm text-red hover:bg-g cursor-pointer"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              className="md:hidden cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={menu}
            >
              {menu ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {menu && (
          <div className="pb-4 md:hidden">
            <SearchBox className="mb-4 px-4" onDone={() => setMenu(false)} />
            <ul className="space-y-3 px-4">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={`list-item block ${isActive(n.href) ? "text-blue! font-medium" : ""}`}>
                    {n.label}
                  </Link>
                </li>
              ))}
              {!user && (
                <li>
                  <Link href="/login" className="list-item block">
                    Login / Register
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
