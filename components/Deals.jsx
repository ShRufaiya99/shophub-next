import Link from "next/link";

// Blue + white theme (same blues as the About page).
// Card 1 and 3 are blue with a white button, card 2 is white with a blue button.
const DEALS = [
  {
    title: "Flash Sale",
    text: "Up to 50% off electronics",
    cta: "Shop Now",
    href: "/category/electronics",
    card: "bg-linear-to-r from-[#469BD6] to-[#2F6EA8]",
    titleColor: "text-white",
    textColor: "text-white/90",
    btn: "bg-white text-[#2F6EA8] hover:bg-[#F2F8FD]",
  },
  {
    title: "Free Shipping",
    text: "On orders over $50",
    cta: "Learn More",
    href: "/about#shipping",
    card: "bg-white border-2 border-[#469BD6]",
    titleColor: "text-[#2F6EA8]",
    textColor: "text-[#3D5A75]",
    btn: "bg-[#3A74AE] text-white hover:bg-[#2F6EA8]",
  },
  {
    title: "Member Exclusive",
    text: "Extra 20% off for members",
    cta: "Join Now",
    href: "/login?tab=register",
    card: "bg-linear-to-r from-[#2F6EA8] to-[#1B3A57]",
    titleColor: "text-white",
    textColor: "text-white/90",
    btn: "bg-white text-[#2F6EA8] hover:bg-[#F2F8FD]",
  },
];

const Deals = () => {
  return (
    <section id="deals">
      <div className="container">
        <h2 className="text-center text-[#2F6EA8]">Today&apos;s Deals</h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {DEALS.map((d) => (
            // reveal-up = light scroll animation (CSS only, see reveal.css)
            <div
              key={d.title}
              className={`reveal-up rounded-2xl p-6 sm:p-8 ${d.card}`}
            >
              <h3 className={`text-2xl font-bold ${d.titleColor}`}>
                {d.title}
              </h3>
              <p
                className={`font-inter pt-2 text-base font-normal leading-6 ${d.textColor}`}
              >
                {d.text}
              </p>
              <Link
                href={d.href}
                className={`${d.btn} font-inter mt-4 inline-block rounded-lg px-5 py-2 text-base font-semibold transition-colors`}
              >
                {d.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 pb-10 text-center">
          <Link href="/deals" className="btn-outline">
            See all deals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Deals;
