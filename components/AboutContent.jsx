// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { Raleway } from "next/font/google";

// const raleway = Raleway({
//   subsets: ["latin"],
//   weight: ["300", "400", "600", "800"],
// });

// const SKY = "#469BD6";
// const DEEP = "#2F6EA8";
// const BUTTON = "#3A74AE";
// const PALE = "#F2F8FD";
// const INK = "#1B3A57";

// /* ---------------- scroll reveal ---------------- */

// // from: "up" | "left" | "right". Slow fade + slide when the block enters the screen.
// function Reveal({ children, from = "up", delay = 0, className = "" }) {
//   const ref = useRef(null);
//   const [shown, setShown] = useState(false);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     if (typeof IntersectionObserver === "undefined") {
//       setShown(true);
//       return;
//     }
//     const io = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setShown(true);
//           io.disconnect();
//         }
//       },
//       { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
//     );
//     io.observe(el);
//     return () => io.disconnect();
//   }, []);

//   const hidden =
//     from === "left"
//       ? "-translate-x-12"
//       : from === "right"
//       ? "translate-x-12"
//       : "translate-y-12";

//   return (
//     <div
//       ref={ref}
//       style={{ transitionDelay: `${delay}ms` }}
//       className={`transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
//         shown
//           ? "translate-x-0 translate-y-0 opacity-100"
//           : `opacity-0 ${hidden}`
//       } ${className}`}
//     >
//       {children}
//     </div>
//   );
// }

// /* ---------------- decorations ---------------- */

// function Clouds({ className = "" }) {
//   return (
//     <svg
//       viewBox="0 0 640 260"
//       preserveAspectRatio="xMaxYMax meet"
//       className={`pointer-events-none absolute bottom-0 right-0 ${className}`}
//       aria-hidden="true"
//     >
//       <g fill="#9CC8EA">
//         <circle cx="90" cy="225" r="60" />
//         <circle cx="330" cy="150" r="80" />
//         <circle cx="470" cy="85" r="85" />
//       </g>
//       <g fill={SKY}>
//         <circle cx="130" cy="230" r="70" />
//         <circle cx="260" cy="175" r="95" />
//         <circle cx="405" cy="200" r="80" />
//         <circle cx="525" cy="115" r="105" />
//         <circle cx="610" cy="205" r="90" />
//         <rect x="60" y="225" width="620" height="60" />
//       </g>
//     </svg>
//   );
// }

// // Flat illustration of a happy shopper with beanie and shopping bags

// function ShopperArt() {
//   return (
//     <div className="flex h-full w-full items-end justify-center bg-transparent">
//       <img
//         src="/img/shopper.png"
//         alt="Woman shopping with shopping bags"
//         className="block h-full w-full object-cover object-bottom"
//         style={{
//           background: "transparent",
//           boxShadow: "none",
//           filter: "none",
//         }}
//       />
//     </div>
//   );
// }

// function Art({ children }) {
//   return (
//     <div className="flex aspect-5/4 w-full items-center justify-center rounded-4xl border-2 border-[#CFE4F5] bg-linear-to-br from-[#EAF4FC] to-white p-8">
//       {children}
//     </div>
//   );
// }

// // Lots of shopping bags: "we bought a lot"
// function BagsArt() {
//   const bag = (x, y, w, h, color, handle) => (
//     <g key={x}>
//       <path
//         d={`M${x + w * 0.3} ${y}Q${x + w / 2} ${y - h * 0.35} ${
//           x + w * 0.7
//         } ${y}`}
//         fill="none"
//         stroke={INK}
//         strokeWidth="4"
//         strokeLinecap="round"
//       />
//       <rect x={x} y={y} width={w} height={h} rx="6" fill={color} />
//       <rect
//         x={x}
//         y={y + h * 0.18}
//         width={w}
//         height="8"
//         fill="#fff"
//         opacity=".3"
//       />
//       {handle && (
//         <circle
//           cx={x + w / 2}
//           cy={y + h * 0.58}
//           r={w * 0.14}
//           fill="#fff"
//           opacity=".85"
//         />
//       )}
//     </g>
//   );
//   return (
//     <Art>
//       <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
//         <ellipse cx="200" cy="265" rx="170" ry="16" fill="#CFE4F5" />
//         {bag(34, 150, 84, 112, "#9CC8EA", true)}
//         {bag(104, 100, 96, 162, BUTTON, true)}
//         {bag(190, 130, 88, 132, "#F4B6C6", false)}
//         {bag(262, 80, 96, 182, SKY, true)}
//         {bag(332, 170, 54, 92, "#E9C98B", false)}
//         <g fill={SKY}>
//           <path d="M60 60l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" />
//           <path d="M350 40l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="#9CC8EA" />
//           <circle cx="215" cy="50" r="6" fill="#F4B6C6" />
//         </g>
//       </svg>
//     </Art>
//   );
// }

// // Open pink box, a 30-day badge and a return arrow
// function ReturnArt() {
//   return (
//     <Art>
//       <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
//         <ellipse cx="215" cy="265" rx="150" ry="14" fill="#CFE4F5" />
//         {/* box */}
//         <path d="M150 150L190 118H320L290 150Z" fill="#E8A7BB" />
//         <rect x="150" y="150" width="140" height="106" rx="6" fill="#F6C9D6" />
//         <rect
//           x="205"
//           y="150"
//           width="30"
//           height="106"
//           fill="#fff"
//           opacity=".6"
//         />
//         {/* open lid */}
//         <path
//           d="M280 120L350 60L376 98L306 150Z"
//           fill="#F8DCE5"
//           stroke="#E8A7BB"
//           strokeWidth="3"
//           strokeLinejoin="round"
//         />
//         {/* calendar badge */}
//         <rect
//           x="36"
//           y="56"
//           width="104"
//           height="104"
//           rx="16"
//           fill="#fff"
//           stroke={SKY}
//           strokeWidth="4"
//         />
//         <path
//           d="M36 72a16 16 0 0 1 16-16h72a16 16 0 0 1 16 16v14H36z"
//           fill={SKY}
//         />
//         <text
//           x="88"
//           y="132"
//           textAnchor="middle"
//           fontSize="44"
//           fontWeight="800"
//           fill={DEEP}
//         >
//           30
//         </text>
//         <text
//           x="88"
//           y="150"
//           textAnchor="middle"
//           fontSize="13"
//           fontWeight="600"
//           fill={SKY}
//         >
//           days
//         </text>
//         {/* return arrow */}
//         <path
//           d="M70 200C70 262 140 282 200 276"
//           fill="none"
//           stroke={BUTTON}
//           strokeWidth="8"
//           strokeLinecap="round"
//         />
//         <path d="M196 258l26 18-24 20z" fill={BUTTON} />
//       </svg>
//     </Art>
//   );
// }

// function ChatArt() {
//   return (
//     <Art>
//       <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
//         <circle cx="350" cy="50" r="24" fill="#CFE4F5" />
//         <rect x="40" y="40" width="230" height="120" rx="26" fill={SKY} />
//         <path d="M80 158l-14 44 54-44z" fill={SKY} />
//         <text
//           x="155"
//           y="130"
//           textAnchor="middle"
//           fontSize="84"
//           fontWeight="800"
//           fill="#fff"
//         >
//           ?
//         </text>
//         <rect
//           x="150"
//           y="150"
//           width="210"
//           height="100"
//           rx="26"
//           fill="#fff"
//           stroke="#9CC8EA"
//           strokeWidth="4"
//         />
//         <path
//           d="M322 248l14 38-50-38z"
//           fill="#fff"
//           stroke="#9CC8EA"
//           strokeWidth="4"
//           strokeLinejoin="round"
//         />
//         <rect x="152" y="200" width="206" height="44" fill="#fff" />
//         <rect x="180" y="184" width="120" height="10" rx="5" fill="#9CC8EA" />
//         <rect x="180" y="208" width="150" height="10" rx="5" fill="#CFE4F5" />
//       </svg>
//     </Art>
//   );
// }

// function MailArt() {
//   return (
//     <Art>
//       <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
//         <circle cx="60" cy="230" r="26" fill="#CFE4F5" />
//         <circle cx="345" cy="70" r="20" fill="#CFE4F5" />
//         <rect x="70" y="90" width="260" height="170" rx="18" fill={SKY} />
//         <path
//           d="M70 112l130 90 130-90"
//           fill="none"
//           stroke="#fff"
//           strokeWidth="10"
//           strokeLinejoin="round"
//           strokeLinecap="round"
//         />
//         <circle cx="320" cy="90" r="22" fill={DEEP} />
//         <path
//           d="M311 90l7 7 12-14"
//           fill="none"
//           stroke="#fff"
//           strokeWidth="4.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </Art>
//   );
// }

// /* ---------------- socials ---------------- */

// function Socials() {
//   const base =
//     "flex h-9 w-9 items-center justify-center rounded-full bg-white transition-transform hover:scale-110";
//   const svg = {
//     viewBox: "0 0 24 24",
//     width: 18,
//     height: 18,
//     "aria-hidden": true,
//   };
//   return (
//     <div className="flex gap-2">
//       <a href="#" aria-label="Instagram" className={base}>
//         <svg {...svg} fill="none" stroke={SKY} strokeWidth="2">
//           <rect x="3" y="3" width="18" height="18" rx="5" />
//           <circle cx="12" cy="12" r="4" />
//           <circle cx="17.5" cy="6.5" r="1" fill={SKY} />
//         </svg>
//       </a>
//       <a href="#" aria-label="Facebook" className={base}>
//         <svg {...svg} fill={SKY}>
//           <path d="M13.5 21v-8h2.7l.5-3.3h-3.2V7.6c0-.9.4-1.6 1.7-1.6h1.6V3.2C16.6 3.1 15.6 3 14.7 3c-2.6 0-4.2 1.5-4.2 4.3v2.4H7.8V13h2.7v8z" />
//         </svg>
//       </a>
//       <a href="#" aria-label="X" className={base}>
//         <svg
//           {...svg}
//           fill="none"
//           stroke={SKY}
//           strokeWidth="2.4"
//           strokeLinecap="round"
//         >
//           <path d="M5 4l14 16M19 4L5 20" />
//         </svg>
//       </a>
//       <a href="#" aria-label="WhatsApp" className={base}>
//         <svg
//           {...svg}
//           fill="none"
//           stroke={SKY}
//           strokeWidth="2"
//           strokeLinejoin="round"
//         >
//           <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8z" />
//           <path
//             d="M9.5 9c.3 2.6 2.2 4.5 4.8 4.8l1.1-1.1-1.7-.9-.8.7a4 4 0 0 1-1.8-1.8l.7-.8-.9-1.7z"
//             fill={SKY}
//             stroke="none"
//           />
//         </svg>
//       </a>
//     </div>
//   );
// }

// /* ---------------- content ---------------- */

// const FAQS = [
//   {
//     q: "How do I track my order?",
//     a: "Log in and open Dashboard → My Orders to see every order and its status.",
//   },
//   {
//     q: "Which payment methods do you accept?",
//     a: "Cash on delivery and card (demo checkout in this project).",
//   },
//   {
//     q: "Can I change my order after placing it?",
//     a: "Contact us within 24 hours and we will do our best to update it.",
//   },
// ];

// const FACTS = ["Free shipping over $50", "30-day returns", "Ships in 1-2 days"];

// function Section({
//   title,
//   subtitle,
//   children,
//   art,
//   flip = false,
//   tint = false,
// }) {
//   return (
//     <section className={`py-12 md:py-20 ${tint ? "bg-[#F2F8FD]" : "bg-white"}`}>
//       <div className="container grid items-center gap-10 md:grid-cols-2 md:gap-16">
//         <Reveal
//           from={flip ? "right" : "left"}
//           className={flip ? "md:order-2" : ""}
//         >
//           {art}
//         </Reveal>
//         <Reveal from="up" delay={150} className={flip ? "md:order-1" : ""}>
//           <h2 className="text-3xl font-extrabold uppercase tracking-wide text-[#2F6EA8] md:text-4xl">
//             {title}
//           </h2>
//           <p className="mt-2 text-2xl font-light text-[#469BD6]">{subtitle}</p>
//           <div className="mt-4 text-base leading-relaxed text-[#3D5A75] md:text-lg">
//             {children}
//           </div>
//         </Reveal>
//       </div>
//     </section>
//   );
// }

// const field =
//   "h-12 w-full rounded-2xl border-2 border-[#469BD6] bg-white px-5 text-xs tracking-widest text-[#1B3A57] outline-none placeholder:text-[#7FB6E0] focus:border-[#2F6EA8]";

// function ContactForm() {
//   const [sent, setSent] = useState(false);

//   function onSubmit(e) {
//     e.preventDefault();
//     const data = Object.fromEntries(new FormData(e.currentTarget));
//     try {
//       const list = JSON.parse(localStorage.getItem("shophub_contacts") || "[]");
//       list.push({ ...data, at: new Date().toISOString() });
//       localStorage.setItem("shophub_contacts", JSON.stringify(list));
//     } catch {}
//     setSent(true);
//     e.currentTarget.reset();
//   }

//   return (
//     <form onSubmit={onSubmit} className="mt-6 max-w-sm space-y-4">
//       <input name="name" required placeholder="NAME" className={field} />
//       <input
//         name="email"
//         type="email"
//         required
//         placeholder="EMAIL"
//         className={field}
//       />
//       <input name="phone" placeholder="PHONE" className={field} />
//       <button
//         type="submit"
//         className="h-12 rounded-2xl px-12 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-[#2F6EA8]"
//         style={{ backgroundColor: BUTTON }}
//       >
//         CONFIRM
//       </button>
//       {sent && (
//         <p role="status" className="text-sm text-[#2F6EA8]">
//           Thanks! We will get back to you soon.
//         </p>
//       )}
//     </form>
//   );
// }

// export default function AboutContent() {
//   return (
//     <div className={`${raleway.className} overflow-x-hidden text-[#1B3A57]`}>
//       {/* ---------- hero ---------- */}
//       <section className="relative bg-white pb-16 md:pb-24">
//         {/* the sky-blue band behind the headline */}
//         <div
//           className="absolute inset-x-0 top-16 hidden h-80 md:block"
//           style={{ backgroundColor: SKY }}
//         />

//         <div className="container relative grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:gap-x-10">
//           {/* shopper */}
//           <Reveal
//             from="left"
//             className="relative order-2 mx-auto h-[70%] w-full  md:order-0 md:col-start-1 md:row-span-2 md:row-start-1 md:h-155"
//           >
//             <ShopperArt />
//             {/* <Leaves className="absolute -bottom-3 -left-8 z-10 w-56 md:w-72" /> */}
//           </Reveal>

//           {/* headline */}
//           <Reveal
//             from="up"
//             delay={150}
//             className="order-1 flex flex-col justify-center rounded-3xl p-8 text-white max-md:bg-[#469BD6] md:order-0 md:col-start-2 md:row-start-1 md:mt-16 md:h-80 md:p-0"
//           >
//             <h1 className="text-4xl font-extrabold uppercase leading-tight tracking-wide md:text-6xl">
//               About ShopHub
//             </h1>
//             <p className="mt-3 text-2xl font-light md:text-3xl">
//               Everything you need
//             </p>
//             <p className="mt-2 max-w-md text-sm font-light leading-relaxed md:text-base">
//               ShopHub is your one-stop shop for everything you need:
//               electronics, fashion, home essentials, sports gear, books and
//               more, delivered fast with prices that make sense.
//             </p>
//           </Reveal>

//           {/* below the band */}
//           <Reveal
//             from="up"
//             delay={300}
//             className="order-3 md:col-start-2 md:row-start-2 md:mt-6"
//           >
//             <ul className="flex flex-wrap gap-3">
//               {FACTS.map((f) => (
//                 <li
//                   key={f}
//                   className="rounded-2xl border-2 border-[#469BD6] px-4 py-2 text-xs font-semibold tracking-wide text-[#2F6EA8]"
//                 >
//                   {f}
//                 </li>
//               ))}
//             </ul>
//             <Link
//               href="/categories"
//               className="mt-6 inline-flex h-12 items-center rounded-2xl px-10 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-[#2F6EA8]"
//               style={{ backgroundColor: BUTTON }}
//             >
//               START SHOPPING
//             </Link>
//           </Reveal>
//         </div>
//       </section>

//       {/* ---------- shipping ---------- */}
//       <Section
//         title="Shipping Info"
//         subtitle="Fast, and free over $50"
//         art={<BagsArt />}
//         tint
//       >
//         <p>
//           Free shipping on orders over $50. Smaller orders ship for a flat
//           $5.99. Most orders leave our warehouse within 1-2 business days.
//         </p>
//       </Section>

//       {/* ---------- returns ---------- */}
//       <Section
//         title="Returns"
//         subtitle="30 days, no stress"
//         art={<ReturnArt />}
//         flip
//       >
//         <p>
//           Not happy with your purchase? Return it within 30 days in its original
//           condition for a full refund.
//         </p>
//       </Section>

//       {/* ---------- faq ---------- */}
//       <Section title="FAQ" subtitle="Quick answers" art={<ChatArt />} tint>
//         <div className="space-y-3">
//           {FAQS.map((f, i) => (
//             <Reveal key={f.q} from="up" delay={i * 150}>
//               <div className="rounded-2xl border-2 border-[#469BD6] bg-white p-4 transition-shadow hover:shadow-md">
//                 <h3 className="text-base font-semibold text-[#2F6EA8]">
//                   {f.q}
//                 </h3>
//                 <p className="mt-1 text-sm text-[#3D5A75]">{f.a}</p>
//               </div>
//             </Reveal>
//           ))}
//         </div>
//       </Section>

//       {/* ---------- contact ---------- */}
//       <section className="relative bg-white pb-56 pt-12 md:pt-20">
//         <div className="container relative z-10 grid items-start gap-10 md:grid-cols-2 md:gap-16">
//           <Reveal from="left">
//             <h2 className="text-3xl font-extrabold uppercase tracking-wide text-[#2F6EA8] md:text-4xl">
//               Contact Us
//             </h2>
//             <p className="mt-2 text-2xl font-light text-[#469BD6]">
//               We reply fast
//             </p>
//             <div className="mt-4 text-base leading-relaxed text-[#3D5A75] md:text-lg">
//               <p>
//                 Email:{" "}
//                 <span className="font-semibold text-[#2F6EA8]">
//                   support@shophub.example
//                 </span>
//               </p>
//               <p>Phone: +1 (555) 010-2030</p>
//               <p>Mon-Fri, 9am-6pm.</p>
//             </div>
//             <ContactForm />
//           </Reveal>
//           <Reveal from="right" delay={150} className="hidden md:block">
//             <MailArt />
//           </Reveal>
//         </div>

//         <Clouds className="w-160 max-w-full" />
//         <div className="absolute bottom-5 right-5 z-10 flex flex-wrap items-center justify-end gap-4 text-white md:right-10">
//           <span className="text-sm font-light tracking-wide md:text-base">
//             www.shophub.example
//           </span>
//           <Socials />
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
});

const SKY = "#469BD6";
const DEEP = "#2F6EA8";
const BUTTON = "#3A74AE";
const PALE = "#F2F8FD";
const INK = "#1B3A57";

/* ---------------- layout helpers ---------------- */

// One shared wrapper so every section gets the same centered width and side padding
// on every screen size (phones get 16px, tablets 24px, desktops 32px).
const WRAP = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/* ---------------- scroll reveal ---------------- */
// Muted video that starts by itself and loops forever
// Muted video that starts by itself and loops forever
function LoopVideo({ src, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
    />
  );
}
// from: "up" | "left" | "right". Slow fade + slide when the block enters the screen.
// Slide distance is smaller on phones so nothing pushes past the screen edge.
function Reveal({ children, from = "up", delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden =
    from === "left"
      ? "-translate-x-6 md:-translate-x-12"
      : from === "right"
      ? "translate-x-6 md:translate-x-12"
      : "translate-y-8 md:translate-y-12";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        shown
          ? "translate-x-0 translate-y-0 opacity-100"
          : `opacity-0 ${hidden}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- decorations ---------------- */

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

// Flat illustration of a happy shopper with beanie and shopping bags
// Phones/tablets: the whole picture is shown (object-contain) so nobody gets cropped.
// Desktop: fills the column like the original design (object-cover).
function ShopperArt() {
  return (
    <div className="flex h-full w-full items-end justify-center bg-transparent">
      <img
        src="/img/shopper.png"
        alt="Woman shopping with shopping bags"
        className="block h-full w-full object-contain object-bottom lg:object-cover"
        style={{
          background: "transparent",
          boxShadow: "none",
          filter: "none",
        }}
      />
    </div>
  );
}

function Art({ children }) {
  return (
    <div className="flex aspect-5/4 w-full items-center justify-center rounded-3xl border-2 border-[#CFE4F5] bg-linear-to-br from-[#EAF4FC] to-white p-4 sm:rounded-4xl sm:p-8">
      {children}
    </div>
  );
}

// Lots of shopping bags: "we bought a lot"
function BagsArt() {
  const bag = (x, y, w, h, color, handle) => (
    <g key={x}>
      <path
        d={`M${x + w * 0.3} ${y}Q${x + w / 2} ${y - h * 0.35} ${
          x + w * 0.7
        } ${y}`}
        fill="none"
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x={x} y={y} width={w} height={h} rx="6" fill={color} />
      <rect
        x={x}
        y={y + h * 0.18}
        width={w}
        height="8"
        fill="#fff"
        opacity=".3"
      />
      {handle && (
        <circle
          cx={x + w / 2}
          cy={y + h * 0.58}
          r={w * 0.14}
          fill="#fff"
          opacity=".85"
        />
      )}
    </g>
  );
  return (
    <Art>
      <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
        <ellipse cx="200" cy="265" rx="170" ry="16" fill="#CFE4F5" />
        {bag(34, 150, 84, 112, "#9CC8EA", true)}
        {bag(104, 100, 96, 162, BUTTON, true)}
        {bag(190, 130, 88, 132, "#F4B6C6", false)}
        {bag(262, 80, 96, 182, SKY, true)}
        {bag(332, 170, 54, 92, "#E9C98B", false)}
        <g fill={SKY}>
          <path d="M60 60l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" />
          <path d="M350 40l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="#9CC8EA" />
          <circle cx="215" cy="50" r="6" fill="#F4B6C6" />
        </g>
      </svg>
    </Art>
  );
}

// Open pink box, a 30-day badge and a return arrow
function ReturnArt() {
  return (
    <Art>
      <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
        <ellipse cx="215" cy="265" rx="150" ry="14" fill="#CFE4F5" />
        {/* box */}
        <path d="M150 150L190 118H320L290 150Z" fill="#E8A7BB" />
        <rect x="150" y="150" width="140" height="106" rx="6" fill="#F6C9D6" />
        <rect
          x="205"
          y="150"
          width="30"
          height="106"
          fill="#fff"
          opacity=".6"
        />
        {/* open lid */}
        <path
          d="M280 120L350 60L376 98L306 150Z"
          fill="#F8DCE5"
          stroke="#E8A7BB"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* calendar badge */}
        <rect
          x="36"
          y="56"
          width="104"
          height="104"
          rx="16"
          fill="#fff"
          stroke={SKY}
          strokeWidth="4"
        />
        <path
          d="M36 72a16 16 0 0 1 16-16h72a16 16 0 0 1 16 16v14H36z"
          fill={SKY}
        />
        <text
          x="88"
          y="132"
          textAnchor="middle"
          fontSize="44"
          fontWeight="800"
          fill={DEEP}
        >
          30
        </text>
        <text
          x="88"
          y="150"
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill={SKY}
        >
          days
        </text>
        {/* return arrow */}
        <path
          d="M70 200C70 262 140 282 200 276"
          fill="none"
          stroke={BUTTON}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path d="M196 258l26 18-24 20z" fill={BUTTON} />
      </svg>
    </Art>
  );
}

function ChatArt() {
  return (
    <Art>
      <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
        <circle cx="350" cy="50" r="24" fill="#CFE4F5" />
        <rect x="40" y="40" width="230" height="120" rx="26" fill={SKY} />
        <path d="M80 158l-14 44 54-44z" fill={SKY} />
        <text
          x="155"
          y="130"
          textAnchor="middle"
          fontSize="84"
          fontWeight="800"
          fill="#fff"
        >
          ?
        </text>
        <rect
          x="150"
          y="150"
          width="210"
          height="100"
          rx="26"
          fill="#fff"
          stroke="#9CC8EA"
          strokeWidth="4"
        />
        <path
          d="M322 248l14 38-50-38z"
          fill="#fff"
          stroke="#9CC8EA"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <rect x="152" y="200" width="206" height="44" fill="#fff" />
        <rect x="180" y="184" width="120" height="10" rx="5" fill="#9CC8EA" />
        <rect x="180" y="208" width="150" height="10" rx="5" fill="#CFE4F5" />
      </svg>
    </Art>
  );
}

function MailArt() {
  return (
    <Art>
      <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
        <circle cx="60" cy="230" r="26" fill="#CFE4F5" />
        <circle cx="345" cy="70" r="20" fill="#CFE4F5" />
        <rect x="70" y="90" width="260" height="170" rx="18" fill={SKY} />
        <path
          d="M70 112l130 90 130-90"
          fill="none"
          stroke="#fff"
          strokeWidth="10"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx="320" cy="90" r="22" fill={DEEP} />
        <path
          d="M311 90l7 7 12-14"
          fill="none"
          stroke="#fff"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Art>
  );
}

/* ---------------- socials ---------------- */

function Socials() {
  // 40px tap targets on phones (comfortable for thumbs), same on desktop.
  const base =
    "flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
  const svg = {
    viewBox: "0 0 24 24",
    width: 18,
    height: 18,
    "aria-hidden": true,
  };
  return (
    <div className="flex gap-2">
      <a href="#" aria-label="Instagram" className={base}>
        <svg {...svg} fill="none" stroke={SKY} strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill={SKY} />
        </svg>
      </a>
      <a href="#" aria-label="Facebook" className={base}>
        <svg {...svg} fill={SKY}>
          <path d="M13.5 21v-8h2.7l.5-3.3h-3.2V7.6c0-.9.4-1.6 1.7-1.6h1.6V3.2C16.6 3.1 15.6 3 14.7 3c-2.6 0-4.2 1.5-4.2 4.3v2.4H7.8V13h2.7v8z" />
        </svg>
      </a>
      <a href="#" aria-label="X" className={base}>
        <svg
          {...svg}
          fill="none"
          stroke={SKY}
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M5 4l14 16M19 4L5 20" />
        </svg>
      </a>
      <a href="#" aria-label="WhatsApp" className={base}>
        <svg
          {...svg}
          fill="none"
          stroke={SKY}
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8z" />
          <path
            d="M9.5 9c.3 2.6 2.2 4.5 4.8 4.8l1.1-1.1-1.7-.9-.8.7a4 4 0 0 1-1.8-1.8l.7-.8-.9-1.7z"
            fill={SKY}
            stroke="none"
          />
        </svg>
      </a>
    </div>
  );
}

/* ---------------- content ---------------- */

const FAQS = [
  {
    q: "How do I track my order?",
    a: "Log in and open Dashboard → My Orders to see every order and its status.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Cash on delivery and card (demo checkout in this project).",
  },
  {
    q: "Can I change my order after placing it?",
    a: "Contact us within 24 hours and we will do our best to update it.",
  },
];

const FACTS = ["Free shipping over $50", "30-day returns", "Ships in 1-2 days"];

function Section({
  title,
  subtitle,
  children,
  art,
  flip = false,
  tint = false,
}) {
  return (
    <section
      className={`py-10 sm:py-14 md:py-20 ${
        tint ? "bg-[#F2F8FD]" : "bg-white"
      }`}
    >
      <div
        className={`${WRAP} grid items-center gap-8 sm:gap-10 md:grid-cols-2 md:gap-12 lg:gap-16`}
      >
        <Reveal
          from={flip ? "right" : "left"}
          className={`mx-auto w-full max-w-md md:max-w-none ${
            flip ? "md:order-2" : ""
          }`}
        >
          {art}
        </Reveal>
        <Reveal from="up" delay={150} className={flip ? "md:order-1" : ""}>
          <h2 className="text-2xl font-extrabold uppercase tracking-wide text-[#2F6EA8] sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-xl font-light text-[#469BD6] sm:text-2xl">
            {subtitle}
          </p>
          <div className="mt-4 text-base leading-relaxed text-[#3D5A75] lg:text-lg">
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// text-base on phones so iOS Safari doesn't zoom the page when an input is focused;
// the smaller, wide-tracked look returns from sm and up.
const field =
  "h-12 w-full rounded-2xl border-2 border-[#469BD6] bg-white px-5 text-base tracking-wider text-[#1B3A57] outline-none placeholder:text-[#7FB6E0] focus:border-[#2F6EA8] sm:text-xs sm:tracking-widest";

function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const list = JSON.parse(localStorage.getItem("shophub_contacts") || "[]");
      list.push({ ...data, at: new Date().toISOString() });
      localStorage.setItem("shophub_contacts", JSON.stringify(list));
    } catch {}
    setSent(true);
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 w-full max-w-sm space-y-4">
      <input
        name="name"
        required
        autoComplete="name"
        placeholder="NAME"
        className={field}
      />
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="EMAIL"
        className={field}
      />
      <input
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="PHONE"
        className={field}
      />
      <button
        type="submit"
        className="h-12 w-full rounded-2xl px-12 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-[#2F6EA8] sm:w-auto"
        style={{ backgroundColor: BUTTON }}
      >
        CONFIRM
      </button>
      {sent && (
        <p role="status" className="text-sm text-[#2F6EA8]">
          Thanks! We will get back to you soon.
        </p>
      )}
    </form>
  );
}

export default function AboutContent() {
  return (
    <div className={`${raleway.className} overflow-x-hidden text-[#1B3A57]`}>
      {/* ---------- hero ----------
          Below lg (phones + tablets): single column. Headline card, shopper, then facts.
          lg and up: the two-column layout with the blue band behind the headline. */}
      <section className="relative bg-white py-6 sm:py-10 lg:py-0 lg:pb-24">
        {/* the sky-blue band behind the headline (desktop only) */}
        <div
          className="absolute inset-x-0 top-16 hidden h-80 lg:block"
          style={{ backgroundColor: SKY }}
        />

        <div
          className={`${WRAP} relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-10`}
        >
          {/* shopper */}
          <Reveal
            from="left"
            className="relative order-2 mx-auto h-72 w-full max-w-md sm:h-96 sm:max-w-lg lg:order-0 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-155 lg:max-w-none"
          >
            <ShopperArt />
          </Reveal>

          {/* headline */}
          <Reveal
            from="up"
            delay={150}
            className="order-1 flex flex-col justify-center rounded-3xl p-6 text-white max-lg:bg-[#469BD6] sm:p-8 lg:order-0 lg:col-start-2 lg:row-start-1 lg:mt-16 lg:h-80 lg:p-0"
          >
            <h1 className="wrap-break-word text-3xl font-extrabold uppercase leading-tight tracking-wide min-[400px]:text-4xl sm:text-5xl lg:text-6xl">
              About ShopHub
            </h1>
            <p className="mt-3 text-xl font-light sm:text-2xl lg:text-3xl">
              Everything you need
            </p>
            <p className="mt-2 max-w-md text-sm font-light leading-relaxed sm:max-w-xl sm:text-base lg:max-w-md">
              ShopHub is your one-stop shop for everything you need:
              electronics, fashion, home essentials, sports gear, books and
              more, delivered fast with prices that make sense.
            </p>
          </Reveal>

          {/* below the band */}
          <Reveal
            from="up"
            delay={300}
            className="order-3 lg:col-start-2 lg:row-start-2 lg:mt-6"
          >
            <ul className="flex flex-wrap gap-2 sm:gap-3">
              {FACTS.map((f) => (
                <li
                  key={f}
                  className="rounded-2xl border-2 border-[#469BD6] px-3 py-2 text-xs font-semibold tracking-wide text-[#2F6EA8] sm:px-4"
                >
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/categories"
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl px-10 text-xs font-semibold tracking-widest text-white transition-colors hover:bg-[#2F6EA8] sm:w-auto"
              style={{ backgroundColor: BUTTON }}
            >
              START SHOPPING
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- shipping ---------- */}
      <Section
        title="Shipping Info"
        subtitle="Fast, and free over $50"
        art={
          <img
            src="/img/shipping.webp"
            alt="Cardboard boxes, a blue cap and a shopping cart ready for delivery"
            loading="lazy"
            className="block h-auto w-full rounded-3xl border-2 border-[#CFE4F5] object-cover sm:rounded-4xl"
          />
        }
        tint
      >
        <p>
          Free shipping on orders over $50. Smaller orders ship for a flat
          $5.99. Most orders leave our warehouse within 1-2 business days.
        </p>
      </Section>

      {/* ---------- returns ---------- */}
      <Section
        title="Returns"
        subtitle="30 days, no stress"
        art={
          <img
            src="/img/returns-bg.png"
            alt="Smiling woman holding a parcel and a phone, with a Return Policy chat button"
            loading="lazy"
            className="block aspect-5/4 w-full  object-cover object-top sm:rounded-4xl"
          />
        }
        flip
      >
        <p>
          Not happy with your purchase? Return it within 30 days in its original
          condition for a full refund.
        </p>
      </Section>

      {/* ---------- faq ---------- */}
      <Section
        title="FAQ"
        subtitle="Quick answers"
        tint
        art={
          <LoopVideo
            src="/img/faq.mp4"
            className=" aspect-4/5 max-h-140 w-full rounded-3xl border-2 border-[#469BD6] object-cover"
          />
        }
      >
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} from="up" delay={i * 150}>
              <div className="rounded-2xl border-2 border-[#469BD6] bg-white p-4 transition-shadow hover:shadow-md">
                <h3 className="text-base font-semibold text-[#2F6EA8]">
                  {f.q}
                </h3>
                <p className="mt-1 text-sm text-[#3D5A75]">{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- contact ----------
          Extra bottom padding leaves room for the clouds and the footer line. On phones
          the footer line is centered and stacks; from sm up it sits at the bottom right. */}
      <section className="relative bg-white pb-52 pt-10 sm:pb-56 sm:pt-14 md:pt-20">
        <div
          className={`${WRAP} relative z-10 grid items-start gap-10 md:grid-cols-2 md:gap-12 lg:gap-16`}
        >
          <Reveal from="left">
            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-[#2F6EA8] sm:text-3xl lg:text-4xl">
              Contact Us
            </h2>
            <p className="mt-2 text-xl font-light text-[#469BD6] sm:text-2xl">
              We reply fast
            </p>
            <div className="mt-4 text-base leading-relaxed text-[#3D5A75] lg:text-lg">
              <p className="wrap-break-word">
                Email:{" "}
                <span className="font-semibold text-[#2F6EA8]">
                  support@shophub.example
                </span>
              </p>
              <p>Phone: +1 (555) 010-2030</p>
              <p>Mon-Fri, 9am-6pm.</p>
            </div>
            <ContactForm />
          </Reveal>
          <Reveal
            from="right"
            delay={150}
            className="mx-auto hidden w-full max-w-md sm:block md:max-w-none"
          >
            <img
              src="/img/contact.jpg"
              alt="Cardboard boxes, a blue cap and a shopping cart ready for delivery"
              loading="lazy"
              className="block h-auto w-full rounded-3xl border-2 border-[#CFE4F5] object-cover sm:rounded-4xl"
            />
          </Reveal>
        </div>

        <Clouds className="w-80 max-w-full sm:w-120 lg:w-160" />
        <div className="absolute inset-x-4 bottom-5 z-10 flex flex-col items-center gap-3 text-white sm:inset-x-6 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-4 md:right-10 md:left-auto">
          <span className="text-sm font-light tracking-wide md:text-base">
            www.shophub.example
          </span>
          <Socials />
        </div>
      </section>
    </div>
  );
}
