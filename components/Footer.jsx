"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/components/SocialIcons";

const Footer = () => {
  const { subscribe, showToast } = useApp();
  const [email, setEmail] = useState("");

  function onSubscribe(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast("Please enter a valid email", "info");
      return;
    }
    subscribe(email);
    setEmail("");
  }

  return (
    <footer className="bg-black">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-x-8 pt-12 pb-14 border-b border-[#1F2937]">
          <div className="col-span-2 md:col-span-1 max-w-70">
            <img src="/img/ShopHublogo.png" alt="ShopHub" />
            <p className="text-lightgray font-inter font-normal text-base leading-6 pt-4 pb-4">
              Your one-stop shop for everything
              <br /> you need.
            </p>
            <ul className="flex gap-4">
              <li>
                <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              </li>
              <li>
                <a href="#" aria-label="Twitter"><TwitterIcon /></a>
              </li>
              <li>
                <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              </li>
            </ul>
          </div>

          <div className="max-w-70 font-inter text-base leading-6">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <ul className="text-lightgray font-normal pt-4">
              <li className="pb-1.5"><Link href="/" className="hover:text-white">Home</Link></li>
              <li className="pb-1.5"><Link href="/categories" className="hover:text-white">Categories</Link></li>
              <li className="pb-1.5"><Link href="/deals" className="hover:text-white">Deals</Link></li>
              <li className="pb-1.5"><Link href="/about" className="hover:text-white">About Us</Link></li>
            </ul>
          </div>

          <div className="max-w-70 font-inter text-base leading-6">
            <h3 className="text-white font-semibold">Customer Service</h3>
            <ul className="text-lightgray font-normal pt-4">
              <li className="pb-1.5"><Link href="/about#contact" className="hover:text-white">Contact Us</Link></li>
              <li className="pb-1.5"><Link href="/about#shipping" className="hover:text-white">Shipping Info</Link></li>
              <li className="pb-1.5"><Link href="/about#returns" className="hover:text-white">Returns</Link></li>
              <li className="pb-1.5"><Link href="/about#faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 max-w-70 font-inter text-base leading-6">
            <h3 className="text-white font-semibold">Newsletter</h3>
            <p className="text-lightgray font-inter font-normal text-base leading-6 pt-4 pb-4">
              Subscribe for updates and deals
            </p>
            <form onSubmit={onSubscribe} className="mt-4 flex">
              <input
                className="h-10 min-w-0 flex-1 pl-4 text-base font-normal bg-white border border-border-btn rounded-tl-lg rounded-bl-lg placeholder:text-secondary outline-none"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-[#3B82F6] text-white font-inter px-3 rounded-br-lg rounded-tr-lg hover:bg-blue transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <p className="text-lightgray text-center text-base font-inter font-normal mt-8.25 pb-8">
          © {new Date().getFullYear()} ShopHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
