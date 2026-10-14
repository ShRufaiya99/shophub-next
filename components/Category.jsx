import Link from "next/link";
import { CATEGORY_GROUPS } from "@/lib/categories";

const Category = () => {
  return (
    <section id="category">
      <div className="container">
        <h2 className="text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-5 pt-8 pb-16 sm:grid-cols-3 md:flex md:flex-nowrap md:justify-between">
          {CATEGORY_GROUPS.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group flex flex-col items-center md:w-45.5"
            >
              <img
                src={c.img}
                alt={c.name}
                className="transition-transform group-hover:scale-105"
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
