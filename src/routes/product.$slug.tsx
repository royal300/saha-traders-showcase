import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import * as React from "react";
import { ChevronRight, Plus, Minus, ShoppingBag, Star, Check, ChevronDown } from "lucide-react";
import { getProduct, getProductsByCategory, getCategory, inr } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { useNavigate } from "@tanstack/react-router";
import { SafeImage } from "@/components/SafeImage";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const p = getProduct(params.slug);
    const title = p ? `${p.name} — Saha Traders` : "Product — Saha Traders";
    return {
      meta: [
        { title },
        { name: "description", content: p?.description ?? "Premium tiles & bathroom fittings at Saha Traders." },
        { property: "og:title", content: title },
        { property: "og:description", content: p?.description ?? "" },
        ...(p?.image ? [{ property: "og:image", content: p.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return p;
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container-x py-32 text-center">
      <h1 className="font-display text-4xl text-slate-brand">Product not found</h1>
      <Link to="/" className="btn-gold mt-6 inline-flex">Go Home</Link>
    </div>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const p = getProduct(slug)!;
  const cat = getCategory(p.category)!;
  const related = getProductsByCategory(p.category).filter(x => x.slug !== p.slug).slice(0, 4);
  const [img, setImg] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [acc, setAcc] = React.useState<string | null>("specs");
  const { add } = useCart();
  const navigate = useNavigate();

  const buyNow = () => { add(p, qty); navigate({ to: "/checkout" }); };

  return (
    <>
      <div className="container-x py-5 text-xs text-[var(--charcoal)]/70 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-[var(--gold)]">Home</Link>
        <ChevronRight size={12}/>
        <Link to="/category/$slug" params={{ slug: cat.slug }} className="hover:text-[var(--gold)]">{cat.name}</Link>
        <ChevronRight size={12}/>
        <span className="text-[var(--slate)] font-semibold">{p.name}</span>
      </div>

      <section className="container-x grid lg:grid-cols-2 gap-12 pb-16">
        <div>
          <div className="bg-white rounded-lg border border-subtle overflow-hidden aspect-square relative">
            {p.gallery.map((g, i) => (
              <SafeImage key={i} src={g} alt={`${p.name} — view ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} decoding="async"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === img ? "opacity-100" : "opacity-0"}`}/>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {p.gallery.map((g, i) => (
              <button key={i} onClick={() => setImg(i)}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${i === img ? "border-[var(--gold)]" : "border-subtle hover:border-[var(--gold)]/50"}`}>
                <SafeImage src={g} alt="" className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl md:text-4xl text-slate-brand">{p.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5">
              {Array.from({length:5}).map((_,i)=>(<Star key={i} size={14} className="fill-[var(--gold)] text-[var(--gold)]"/>))}
            </div>
            <span className="text-sm text-[var(--charcoal)]/70">({p.reviews} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-[var(--gold)] font-bold text-3xl">{inr(p.price)}</span>
            {p.oldPrice && <span className="text-[var(--charcoal)]/50 line-through">{inr(p.oldPrice)}</span>}
          </div>
          <p className="text-[var(--charcoal)] mt-5 leading-relaxed">{p.description}</p>

          <div className="flex items-center gap-3 mt-7">
            <div className="flex items-center border border-subtle rounded-md overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-10 h-11 bg-slate-brand text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--slate)] transition-colors"><Minus size={14} className="mx-auto"/></button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(q => q+1)} className="w-10 h-11 bg-slate-brand text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--slate)] transition-colors"><Plus size={14} className="mx-auto"/></button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => add(p, qty)} className="btn-gold flex-1 min-w-[200px]">
              <ShoppingBag size={16}/> Add to Cart
            </button>
            <button onClick={buyNow} className="btn-slate flex-1 min-w-[200px] !bg-transparent !text-[var(--slate)] hover:!bg-[var(--slate)] hover:!text-[var(--gold)]">
              Buy Now
            </button>
          </div>

          <ul className="mt-7 space-y-2 text-sm text-[var(--charcoal)]">
            {["Premium Quality Certified","Available in bulk orders","Free delivery on orders above ₹5000","Easy return within 7 days"].map((t)=>(
              <li key={t} className="flex items-start gap-2"><Check size={16} className="text-[var(--gold)] mt-0.5 shrink-0"/> {t}</li>
            ))}
          </ul>

          <div className="mt-8 border-t border-subtle">
            {[
              { id: "specs", label: "Specifications", content: (
                <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm">
                  {p.specs.map(s => (
                    <React.Fragment key={s.label}>
                      <span className="text-[var(--charcoal)]/70">{s.label}</span>
                      <span className="text-[var(--slate)] font-medium">{s.value}</span>
                    </React.Fragment>
                  ))}
                </div>
              )},
              { id: "ship", label: "Shipping Info", content: <p className="text-sm">Delivered across Barasat and nearby areas within 2–4 business days. Free shipping on orders above ₹5000.</p> },
              { id: "return", label: "Return Policy", content: <p className="text-sm">7-day hassle-free return on unused products in original packaging.</p> },
            ].map((a) => {
              const open = acc === a.id;
              return (
                <div key={a.id} className="border-b border-subtle">
                  <button onClick={() => setAcc(open ? null : a.id)} className="w-full flex items-center justify-between py-4 text-left text-slate-brand font-semibold">
                    {a.label}
                    <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`}/>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-4" : "max-h-0"}`}>
                    {a.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="section-title mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map(r => <ProductCard key={r.slug} p={r} />)}
          </div>
        </section>
      )}
    </>
  );
}