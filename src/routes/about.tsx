import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Heart, Sparkles, Layers } from "lucide-react";
import { ai, seedFrom } from "@/lib/images";
import { SafeImage } from "@/components/SafeImage";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Saha Marble & Tiles, Barasat" },
      { name: "description", content: "Learn about Saha Marble & Tiles — Barasat's trusted name in premium tiles and bathroom fittings for over a decade." },
      { property: "og:title", content: "About Saha Marble & Tiles" },
      { property: "og:description", content: "10+ years serving Barasat with premium tiles and bathroom fittings." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative h-[400px]">
        <SafeImage src={ai("luxury modern showroom interior displaying premium tiles and bathroom fittings, elegant architecture, wide shot, photorealistic, 1920x1080", 1920, 1080, seedFrom("about-hero"))} className="absolute inset-0 w-full h-full object-cover" alt=""/>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative container-x h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="font-display text-5xl md:text-6xl text-white">About Saha Marble & Tiles</h1>
          <p className="text-[var(--gold)] mt-3 uppercase tracking-[0.3em] text-xs">Crafting Spaces, Defining Excellence</p>
        </div>
      </section>

      <section className="container-x py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl text-slate-brand mb-5">Barasat's trusted name for tiles and bathroom fittings.</h2>
          <div className="space-y-4 text-[var(--charcoal)] leading-relaxed">
            <p>For over a decade, Saha Marble & Tiles has been the destination of choice for homeowners, architects, and contractors across Barasat and beyond. What began as a small tile shop has grown into a premium showroom carrying a curated catalogue of floor and wall tiles, basins, commodes, taps and sinks.</p>
            <p>Every product we stock is hand-picked from leading manufacturers — chosen for durability, beauty, and long-term value. We don't believe in shortcuts; we believe in spaces that stand the test of time.</p>
            <p>Our team is here to help you find exactly what suits your home, your project, and your budget. Walk in for a coffee and a chat about your renovation — we're always happy to help.</p>
          </div>
        </div>
        <SafeImage src={ai("friendly professional store owner inside a premium tiles and sanitaryware showroom, high quality interior photography, 800x1000", 800, 1000, seedFrom("about-store"))} className="rounded-lg shadow-xl w-full aspect-[4/5] object-cover" alt="Our Showroom"/>
      </section>

      <section className="bg-slate-brand text-white py-16">
        <div className="container-x grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            ["500+", "Products"],
            ["1000+", "Happy Customers"],
            ["10+", "Years Experience"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-5xl text-[var(--gold)]">{n}</div>
              <div className="text-white/80 mt-2 uppercase tracking-widest text-sm">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20">
        <h2 className="section-title mb-12">Our Values</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { I: Award, t: "Quality", d: "Only the best materials, every time" },
            { I: Heart, t: "Trust", d: "Honest pricing, no surprises" },
            { I: Sparkles, t: "Service", d: "Personal guidance from start to finish" },
            { I: Layers, t: "Variety", d: "Thousands of designs to choose from" },
          ].map((v) => (
            <div key={v.t} className="bg-white border border-subtle rounded-lg p-6 text-center hover:border-[var(--gold)] transition-colors">
              <v.I size={32} className="text-[var(--gold)] mx-auto mb-3"/>
              <h4 className="font-display text-lg text-slate-brand mb-1">{v.t}</h4>
              <p className="text-sm text-[var(--charcoal)]/80">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}