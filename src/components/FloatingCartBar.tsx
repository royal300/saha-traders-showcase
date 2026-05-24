import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/products";

export function FloatingCartBar() {
  const { count, subtotal, isProductBarActive } = useCart();
  const [pulse, setPulse] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Trigger pulse animation when count changes
  React.useEffect(() => {
    if (count > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 800);
      return () => clearTimeout(t);
    }
  }, [count]);

  if (count === 0) return null;

  // Don't show the cart bar on Checkout or Success pages
  if (pathname === "/checkout" || pathname === "/order-success") {
    return null;
  }

  // If the product bottom action drawer is active, stack above it, otherwise sit at the absolute bottom
  const positionClass = isProductBarActive
    ? "bottom-[82px] px-4 justify-center"
    : "bottom-0 px-0 justify-center";

  const containerClass = isProductBarActive
    ? "w-full max-w-xl rounded-full border border-[var(--gold)]/50 shadow-2xl py-3.5 px-6"
    : "w-full max-w-none rounded-none border-t border-[var(--gold)]/30 shadow-[0_-8px_30px_rgba(0,0,0,0.2)] py-4 px-6 md:px-12";

  return (
    <div className={`fixed ${positionClass} left-0 right-0 z-40 pointer-events-none flex transition-all duration-500`}>
      <div
        className={`pointer-events-auto bg-slate-brand text-white flex items-center justify-between transition-all duration-500 transform ${containerClass} ${
          pulse ? "scale-103 shadow-[var(--gold)]/20" : "scale-100"
        } animate-fade-up`}
        style={{
          boxShadow: isProductBarActive 
            ? "0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(201, 168, 76, 0.2)"
            : "0 -8px 30px rgba(0, 0, 0, 0.15)"
        }}
      >
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 rounded-full bg-[var(--gold)] text-slate-brand flex items-center justify-center shrink-0">
            <ShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
              {count}
            </span>
          </div>
          <div>
            <div className="text-xs text-white/70 uppercase tracking-widest font-semibold">Shopping Cart</div>
            <div className="text-sm font-semibold flex items-center gap-1.5 mt-0.5">
              <span>{count} {count === 1 ? "item" : "items"}</span>
              <span className="text-white/40">•</span>
              <span className="text-[var(--gold)] font-bold text-base">{inr(subtotal)}</span>
            </div>
          </div>
        </div>

        <Link
          to="/checkout"
          className="btn-gold !py-2.5 !px-5 !rounded-full !text-xs !bg-[var(--gold)] !text-slate-brand hover:!bg-white hover:!text-slate-brand hover:!border-white flex items-center gap-1.5 shadow-md shadow-black/15 shrink-0"
        >
          Checkout <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
