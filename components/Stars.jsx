import { Star } from "lucide-react";

export default function Stars({ rating = 0, size = 14, showValue = true }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rating ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= full ? "fill-amber-400 text-amber-400" : "text-border-btn"}
        />
      ))}
      {showValue && (
        <span className="ml-1 font-inter text-xs text-gray">{Number(rating).toFixed(1)}</span>
      )}
    </span>
  );
}
