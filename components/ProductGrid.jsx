import ProductCard from "@/components/ProductCard";
import RevealItem from "@/components/RevealItem";

export const GRID_CLASS =
  "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4";

export function ProductSkeletons({ count = 8 }) {
  return (
    <div className={GRID_CLASS}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border-btn bg-white p-4">
          <div className="skeleton aspect-square w-full" />
          <div className="skeleton mt-4 h-4 w-3/4" />
          <div className="skeleton mt-3 h-3 w-1/2" />
          <div className="skeleton mt-6 h-6 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-red/30 bg-red/5 p-6 text-center">
      <p className="font-inter font-semibold text-black">Something went wrong</p>
      <p className="mt-1 font-inter text-sm text-gray">
        {message || "Could not load data. Check your internet connection."}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = "Nothing found", text, children }) {
  return (
    <div className="rounded-lg border border-border-btn bg-g p-10 text-center">
      <p className="font-inter text-lg font-semibold text-black">{title}</p>
      {text && <p className="mt-1 font-inter text-sm text-gray">{text}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default function ProductGrid({ products }) {
  return (
    <div className={GRID_CLASS}>
      {products.map((p, i) => (
        // cards in the same row rise one after another (0, 100, 200, 300 ms)
        <RevealItem key={p.id} className="h-full" delay={(i % 4) * 100}>
          <ProductCard product={p} />
        </RevealItem>
      ))}
    </div>
  );
}