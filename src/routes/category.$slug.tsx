import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import * as React from "react";
import { ChevronRight } from "lucide-react";
import { getCategory, categories, products, hydrateCatalog } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SafeImage } from "@/components/SafeImage";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const c = getCategory(params.slug);
    const title = c ? `${c.name} — Saha Marble & Tiles` : "Category — Saha Marble & Tiles";
    return {
      meta: [
        { title },
        { name: "description", content: c?.blurb ?? "Browse our catalogue at Saha Marble & Tiles." },
        { property: "og:title", content: title },
        { property: "og:description", content: c?.blurb ?? "" },
        ...(c?.banner ? [{ property: "og:image", content: c.banner }] : []),
      ],
    };
  },
  loader: async ({ params }) => {
    await hydrateCatalog(true);
    const c = getCategory(params.slug);
    if (!c) throw notFound();
    return {
      category: c,
      categories: [...categories],
      products: [...products]
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="container-x py-32 text-center">
      <h1 className="font-display text-4xl text-slate-brand">Category not found</h1>
      <Link to="/" className="btn-gold mt-6 inline-flex">Go Home</Link>
    </div>
  ),
});

type Sort = "default" | "asc" | "desc" | "new";

function CategoryPage() {
  const { slug } = Route.useParams();
  const { category: c, categories: categoriesList, products: productsList } = Route.useLoaderData();
  const base = React.useMemo(() => productsList.filter((p: any) => p.category === slug), [productsList, slug]);
  const [sort, setSort] = React.useState<Sort>("default");

  const list = React.useMemo(() => {
    const arr = [...base];
    if (sort === "asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "desc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "new") arr.reverse();
    return arr;
  }, [base, sort]);

  const sorts: { v: Sort; l: string }[] = [
    { v: "default", l: "All" },
    { v: "asc", l: "Price: Low–High" },
    { v: "desc", l: "Price: High–Low" },
    { v: "new", l: "Newest" },
  ];

  return (
    <>
      <section className="relative h-[420px]">
        <SafeImage src={c.banner} alt={c.name} loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/55"/>
        <div className="relative container-x h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="font-display text-5xl md:text-6xl text-white">{c.name}</h1>
          <p className="text-white/85 mt-3 max-w-xl">{c.blurb}</p>
        </div>
      </section>

      <div className="container-x py-5 text-xs text-[var(--charcoal)]/70 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[var(--gold)]">Home</Link>
        <ChevronRight size={12}/>
        <span>Categories</span>
        <ChevronRight size={12}/>
        <span className="text-[var(--slate)] font-semibold">{c.name}</span>
      </div>

      <section className="container-x pb-20">
        <div className="flex flex-wrap gap-2 mb-8">
          {sorts.map((s) => (
            <button
              key={s.v}
              onClick={() => setSort(s.v)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider border transition-all ${
                sort === s.v
                  ? "bg-[var(--gold)] border-[var(--gold)] text-[var(--slate)] font-semibold"
                  : "bg-white border-subtle text-[var(--charcoal)] hover:border-[var(--gold)]"
              }`}
            >
              {s.l}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {list.map((p, idx) => <ProductCard key={p.slug} p={p} idx={idx} />)}
        </div>
      </section>

      <section className="container-x pb-20">
        <h3 className="font-display text-2xl text-slate-brand mb-5">Explore Other Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categoriesList.filter((x: any) => x.slug !== c.slug).map((x: any) => (
            <Link key={x.slug} to="/category/$slug" params={{ slug: x.slug }}
              className="px-4 py-2 rounded-full text-sm border border-subtle hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all bg-white">
              {x.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}