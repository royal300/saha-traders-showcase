import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/products";

export function FloatingCartBar() {
  const { count, subtotal } = useCart();
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

  // If on a product page, offset it vertically to sit cleanly above the floating product bar
  const isProductPage = pathname.startsWith("/product/");
  const positionClass = isProductPage ? "bottom-24 md:bottom-28" : "bottom-6";

  return (
    <div className={`fixed ${positionClass} left-0 right-0 z-40 px-4 pointer-events-none flex justify-center transition-all duration-300`}>
      <div
        className={`w-full max-w-xl pointer-events-auto bg-slate-brand text-white border border-[var(--gold)]/50 rounded-full px-6 py-3.5 shadow-2xl flex items-center justify-between transition-all duration-500 transform ${
          pulse ? "scale-105 shadow-[var(--gold)]/20" : "scale-100"
        } animate-fade-up`}
        style={{
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(201, 168, 76, 0.2)"
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
