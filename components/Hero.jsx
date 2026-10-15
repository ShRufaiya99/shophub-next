import Link from "next/link";

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-y-5">
          <div className="text-center md:text-left">
            <h1 className="hero-h1">Summer Sale</h1>
            <p className="hero-p">
              Up to 70% off on selected items. Limited time offer!
            </p>
            <Link href="/deals" className="hero-btn">
              Shop Now
            </Link>
          </div>
          <div className="md:pt-22.5 max-w-full">
            <img src="/img/hero.png" alt="Summer sale" className="max-w-full h-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
