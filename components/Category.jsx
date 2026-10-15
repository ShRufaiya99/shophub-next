import Link from "next/link";
import { CATEGORY_GROUPS } from "@/lib/categories";

const Category = () => {
  return (
    <section id="category">
      <div className="container">
        <h2 className="text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 pt-8 pb-12 sm:grid-cols-3 sm:gap-5 lg:flex lg:flex-nowrap lg:justify-between">
          {CATEGORY_GROUPS.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group flex flex-col items-center lg:w-45.5"
            >
              <img
                src={c.img}
                alt={c.name}
                className="max-h-24 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <p className="category-p group-hover:text-blue transition-colors">
                {c.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
