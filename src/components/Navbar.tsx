import * as React from "react";
import { Link, useRouterState, useLoaderData, useNavigate } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, ChevronDown, Search } from "lucide-react";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/products";
import logoPng from "@/logo.png";

export function Navbar() {
  // Read categories from the root route's reactive loader data.
  // This ensures the Navbar always reflects the live DB state after
  // admin CRUD operations + router.invalidate().
  const rootData = useLoaderData({ from: "__root__" }) as any;
  const categoriesList: any[] = rootData?.categories ?? [];
  const productsList: any[] = rootData?.products ?? [];

  const [mobile, setMobile] = React.useState(false);
  const [catOpen, setCatOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { count, setOpen } = useCart();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return productsList
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 3);
  }, [searchQuery, productsList]);

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
              {categoriesList.map((c) => (
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
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="relative text-white hover:text-[var(--gold)] transition-colors p-2"
              aria-label="Search"
            >
              <Search size={22} />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-[300px] md:w-[400px] bg-white rounded-lg shadow-2xl border border-subtle overflow-hidden">
                <div className="p-3 border-b border-subtle flex items-center gap-2">
                  <Search size={16} className="text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm outline-none bg-transparent text-slate-brand"
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
                {searchQuery.trim() && (
                  <div className="max-h-[300px] overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="flex flex-col">
                        {searchResults.map((p) => (
                          <div
                            key={p.slug}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                              navigate({ to: "/product/$slug", params: { slug: p.slug } });
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-[var(--offwhite)] cursor-pointer transition-colors border-b border-subtle last:border-0"
                          >
                            <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded bg-gray-100" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-brand truncate">{p.name}</div>
                              <div className="text-[10px] text-[var(--gold)] uppercase tracking-wider">{p.category}</div>
                            </div>
                            <div className="text-sm font-bold text-slate-brand price-inr">{inr(p.price)}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">No products found</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
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
                  {categoriesList.map((c) => (
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