import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { ChevronRight, Award, Truck, MessageSquare, RotateCcw, Star, Quote } from "lucide-react";
import { categories, getFeatured, showroomBanner } from "@/lib/products";
import { heroSlides } from "@/lib/images";
import { ProductCard } from "@/components/ProductCard";
import { SafeImage } from "@/components/SafeImage";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/")({
  component: Index,
});

const slides = heroSlides.map((s) => ({
  ...s,
  to: "/category/$slug" as const,
}));

function Hero() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
        >
          <SafeImage src={s.img} alt={s.heading} loading={idx === 0 ? "eager" : "lazy"} decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container-x text-center text-white animate-fade-up">
              <div className="text-[var(--gold)] uppercase tracking-[0.3em] text-xs md:text-sm mb-4">{s.label}</div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white max-w-4xl mx-auto leading-tight">{s.heading}</h1>
              <p className="mt-5 text-white/85 max-w-2xl mx-auto text-base md:text-lg">{s.sub}</p>
              <Link to={s.to} params={{ slug: s.slug }} className="btn-gold mt-8 inline-flex">
                Explore Collection <ChevronRight size={16}/>
              </Link>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-[var(--gold)]" : "w-2 bg-white/60"}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function CategorySection() {
  return (
    <section className="py-20">
      <div className="container-x">
        <h2 className="section-title mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, idx) => (
            <ScrollReveal key={c.slug} direction={idx % 2 === 0 ? "left" : "right"} delay={(idx % 4) * 100} className="h-full">
              <Link
                to="/category/$slug"
              params={{ slug: c.slug }}
              className="block w-full h-full group relative aspect-square overflow-hidden rounded-2xl border border-[var(--gold)]/60 shadow-lg shadow-[var(--gold)]/10 transition-all duration-300 hover:border-[var(--gold)] hover:shadow-xl hover:shadow-[var(--gold)]/20 hover:-translate-y-1"
            >
              <SafeImage src={c.image} alt={c.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-white text-xl md:text-2xl">{c.name}</h3>
                <div className="text-[var(--gold)] text-xs uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                  Explore <ChevronRight size={12}/>
                </div>
              </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedSection() {
  const featured = getFeatured();
  return (
    <section className="py-20 bg-white">
      <div className="container-x">
        <h2 className="section-title mb-12">Featured Products</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p, idx) => <ProductCard key={p.slug} p={p} idx={idx} />)}
        </div>
        <div className="text-center mt-12">
          <Link to="/category/$slug" params={{ slug: "floor-tiles" }} className="btn-gold">
            View All Products <ChevronRight size={16}/>
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    { icon: Award, title: "Premium Quality", text: "Sourced from top manufacturers" },
    { icon: Truck, title: "Fast Delivery", text: "Serving Barasat and surrounding areas" },
    { icon: MessageSquare, title: "Expert Guidance", text: "Our team helps you find the perfect fit" },
    { icon: RotateCcw, title: "Easy Returns", text: "Hassle-free return policy" },
  ];
  return (
    <section className="bg-slate-brand text-white py-10 md:py-14">
      <div className="container-x grid grid-cols-2 lg:grid-cols-4 gap-y-7 gap-x-4 md:divide-x divide-white/10">
        {items.map((I) => (
          <div key={I.title} className="px-1 md:px-5 text-center">
            <I.icon size={26} className="text-[var(--gold)] mx-auto mb-2" />
            <h4 className="font-display text-sm md:text-base text-white mb-1">{I.title}</h4>
            <p className="text-[11px] md:text-xs text-white/70 leading-snug">{I.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const list = [
    { name: "Rajesh Sharma", text: "Saha Marble & Tiles helped us pick the perfect floor tiles for our new home. Quality and service both top-notch.", rating: 5 },
    { name: "Priya Banerjee", text: "Beautiful basin and tap collection. The team was knowledgeable and delivery was prompt to my Barasat address.", rating: 5 },
    { name: "Amit Das", text: "Renovated our entire bathroom with their products. Workmanship is excellent and pricing is fair.", rating: 5 },
  ];
  return (
    <section className="py-20">
      <div className="container-x">
        <h2 className="section-title mb-12">What Our Customers Say</h2>
        <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
          {list.map((t) => (
            <div key={t.name} className="min-w-[85vw] md:min-w-0 snap-center bg-white border border-subtle rounded-xl p-7 shadow-sm">
              <Quote className="text-[var(--gold)] mb-3" size={28}/>
              <p className="text-[var(--charcoal)] leading-relaxed text-sm">{t.text}</p>
              <div className="flex items-center gap-0.5 mt-4">
                {Array.from({length: t.rating}).map((_, i) => (
                  <Star key={i} size={14} className="fill-[var(--gold)] text-[var(--gold)]" />
                ))}
              </div>
              <div className="font-display text-slate-brand mt-3">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="relative py-24 mb-0 flex flex-col justify-end">
      <SafeImage src={showroomBanner} alt="Saha Marble & Tiles showroom" className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative container-x text-center text-white">
        <h2 className="font-display text-3xl md:text-5xl text-white">Ready to Transform Your Space?</h2>
        <p className="mt-4 text-white/80 max-w-xl mx-auto">Visit our showroom in Barasat or browse our full catalogue online.</p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/category/$slug" params={{ slug: "floor-tiles" }} className="btn-gold">Browse Products</Link>
          <Link to="/contact" className="btn-outline-white">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <>
      <Hero />
      <CategorySection />
      <WhyUs />
      <FeaturedSection />
      <Testimonials />
      <CTABanner />
    </>
  );
}
