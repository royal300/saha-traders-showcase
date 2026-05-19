import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { type Product, inr } from "@/lib/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const off = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  return (
    <div className="card-product group flex flex-col">
      <Link to="/product/$slug" params={{ slug: p.slug }} className="block relative aspect-square overflow-hidden bg-[var(--offwhite)]">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        {off > 0 && (
          <span className="absolute top-3 left-3 bg-[var(--gold)] text-[var(--slate)] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {off}% Off
          </span>
        )}
        <span className="absolute top-3 right-3 bg-[var(--slate)]/90 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded">
          {p.category.replace("-", " ")}
        </span>
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link to="/product/$slug" params={{ slug: p.slug }}>
          <h3 className="font-display text-[15px] leading-snug text-[var(--slate)] line-clamp-2 hover:text-[var(--gold)] transition-colors">
            {p.name}
          </h3>
        </Link>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className="fill-[var(--gold)] text-[var(--gold)]" />
          ))}
          <span className="text-[11px] text-[var(--charcoal)]/60 ml-1">({p.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[var(--gold)] font-semibold text-lg">{inr(p.price)}</span>
          {p.oldPrice && (
            <span className="text-xs text-[var(--charcoal)]/50 line-through">{inr(p.oldPrice)}</span>
          )}
        </div>
        <button
          onClick={() => add(p)}
          className="btn-slate mt-auto w-full !py-2.5 !text-[11px]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}