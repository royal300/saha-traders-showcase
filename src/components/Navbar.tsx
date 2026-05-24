import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { categories } from "@/lib/products";
import { useCart } from "@/lib/cart";
import logoPng from "@/logo.png";

export function Navbar() {
  const [mobile, setMobile] = React.useState(false);
  const [catOpen, setCatOpen] = React.useState(false);
  const { count, setOpen } = useCart();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const link = (to: string, label: string) => (
    <Link
      to={to}
      onClick={() => setMobile(false)}
      className="relative text-white/90 hover:text-[var(--gold)] transition-colors text-sm tracking-wide uppercase font-medium py-2"
    >
      {label}
      {path === to && (
        <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--gold)]" />
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-slate-brand shadow-md">
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2.5 text-white">
          <img src={logoPng} alt="Saha Marble & Tiles Logo" className="h-12 md:h-14 w-auto object-contain shrink-0 transition-all" />
          <span className="font-display text-xl md:text-3xl tracking-wide whitespace-nowrap transition-all">
            Saha <span className="text-[var(--gold)]">Marble & Tiles</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {link("/", "Home")}
          {link("/about", "About")}
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button className="flex items-center gap-1 text-white/90 hover:text-[var(--gold)] transition-colors text-sm tracking-wide uppercase font-medium py-2">
              Categories <ChevronDown size={14} />
            </button>
            <div
              className={`absolute right-0 top-full mt-1 w-64 bg-white shadow-2xl rounded-md overflow-hidden origin-top transition-all duration-300 ${
                catOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"
              }`}
              style={{ transformOrigin: "top" }}
            >
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="block px-5 py-3 text-sm text-[var(--charcoal)] border-l-2 border-transparent hover:border-l-[var(--gold)] hover:bg-[var(--offwhite)] hover:text-[var(--slate)] transition-all"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          {link("/contact", "Contact")}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="relative text-white hover:text-[var(--gold)] transition-colors p-2"
            aria-label="Cart"
          >
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--gold)] text-[var(--slate)] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobile(true)}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobile(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-slate-brand p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-xl text-white">Menu</span>
              <button onClick={() => setMobile(false)} className="text-white"><X size={22}/></button>
            </div>
            <div className="flex flex-col gap-4">
              {link("/", "Home")}
              {link("/about", "About")}
              {link("/contact", "Contact")}
              <div className="border-t border-white/10 pt-4 mt-2">
                <div className="text-[var(--gold)] uppercase text-xs tracking-wider mb-3">Categories</div>
                <div className="flex flex-col gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      onClick={() => setMobile(false)}
                      className="text-white/80 hover:text-[var(--gold)] text-sm py-1.5"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}