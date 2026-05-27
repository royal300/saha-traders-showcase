import { Link, useLoaderData } from "@tanstack/react-router";
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import logoPng from "@/logo.png";

export function Footer() {
  const rootData = useLoaderData({ from: "__root__" }) as any;
  const categories: any[] = rootData?.categories ?? [];

  return (
    <footer className="bg-slate-brand text-white/80 mt-0">
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3.5 mb-4">
            <img src={logoPng} alt="Saha Marble & Tiles Logo" className="h-16 md:h-20 w-auto object-contain shrink-0 transition-all" />
            <h3 className="font-display text-2xl md:text-3xl text-white leading-tight transition-all">
              Saha <span className="text-[var(--gold)]">Marble & Tiles</span>
            </h3>
          </div>
          <p className="text-[var(--gold)] italic text-sm mb-3">Crafting Spaces, Defining Excellence</p>
          <p className="text-sm leading-relaxed">
            Barasat's most trusted name for premium tiles and bathroom fittings. Quality you can build on.
          </p>
        </div>
        <div>
          <h4 className="text-white uppercase tracking-wider text-sm mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[var(--gold)] transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-[var(--gold)] transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-[var(--gold)] transition-colors">Contact</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "floor-tiles" }} className="hover:text-[var(--gold)] transition-colors">All Categories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white uppercase tracking-wider text-sm mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="hover:text-[var(--gold)] transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white uppercase tracking-wider text-sm mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><MapPin size={16} className="text-[var(--gold)] mt-0.5 shrink-0"/> Barrackpore - Barasat Rd, opp. Loknath Mandir, Barasat, Kolkata, West Bengal 700126</li>
            <li className="flex gap-2"><Phone size={16} className="text-[var(--gold)] mt-0.5 shrink-0"/> +91 98369 34398</li>
            <li className="flex gap-2"><Mail size={16} className="text-[var(--gold)] mt-0.5 shrink-0"/> info@sahatraders.com</li>
          </ul>
          <div className="flex gap-3 mt-5">
            <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--gold)] hover:text-[var(--slate)] hover:border-[var(--gold)] transition-all"><Instagram size={16}/></a>
            <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--gold)] hover:text-[var(--slate)] hover:border-[var(--gold)] transition-all"><Facebook size={16}/></a>
            <a href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--gold)] hover:text-[var(--slate)] hover:border-[var(--gold)] transition-all"><MessageCircle size={16}/></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 text-xs text-white/60 text-center">
          © 2025 Saha Marble & Tiles. All Rights Reserved. | Barasat, West Bengal
        </div>
      </div>
    </footer>
  );
}