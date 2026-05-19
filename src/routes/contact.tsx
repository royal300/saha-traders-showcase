import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Saha Traders, Barasat" },
      { name: "description", content: "Visit Saha Traders in Barasat, West Bengal, or get in touch for tile and bathroom fitting enquiries." },
      { property: "og:title", content: "Contact Saha Traders" },
      { property: "og:description", content: "Get in touch with our Barasat showroom." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = React.useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <>
      <section className="relative h-[380px]">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80" className="absolute inset-0 w-full h-full object-cover" alt=""/>
        <div className="absolute inset-0 bg-black/60"/>
        <div className="relative container-x h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="font-display text-5xl md:text-6xl text-white">Get In Touch</h1>
          <p className="text-[var(--gold)] mt-3 uppercase tracking-[0.3em] text-xs">We'd love to hear from you</p>
        </div>
      </section>

      <section className="container-x py-20 grid lg:grid-cols-2 gap-12">
        <div className="bg-white border border-subtle rounded-lg p-8">
          <h2 className="font-display text-2xl text-slate-brand mb-6">Send us a message</h2>
          {sent ? (
            <div className="bg-[var(--gold)]/15 border border-[var(--gold)] text-[var(--slate)] rounded-md p-5 text-center">
              ✓ We'll get back to you soon!
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Field label="Name *"><input required className="ipt"/></Field>
              <Field label="Email *"><input type="email" required className="ipt"/></Field>
              <Field label="Mobile *"><input required className="ipt"/></Field>
              <Field label="Subject">
                <select className="ipt">
                  <option>General Inquiry</option>
                  <option>Product Query</option>
                  <option>Bulk Order</option>
                  <option>Complaint</option>
                </select>
              </Field>
              <Field label="Message *"><textarea required rows={5} className="ipt"/></Field>
              <button className="btn-gold w-full">Send Message</button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          {[
            { I: MapPin, t: "Address", d: "Saha Traders, Main Road, Barasat, West Bengal 700124" },
            { I: Phone, t: "Phone", d: "+91 98765 43210" },
            { I: Mail, t: "Email", d: "info@sahatraders.com" },
            { I: Clock, t: "Hours", d: "Mon–Sat, 10AM – 7PM" },
          ].map((c) => (
            <div key={c.t} className="bg-white border border-subtle rounded-lg p-5 flex gap-4 items-start hover:border-[var(--gold)] transition-colors">
              <div className="w-11 h-11 rounded-full bg-[var(--gold)]/15 flex items-center justify-center text-[var(--gold)] shrink-0">
                <c.I size={18}/>
              </div>
              <div>
                <div className="font-display text-slate-brand text-lg">{c.t}</div>
                <div className="text-sm text-[var(--charcoal)] mt-1">{c.d}</div>
              </div>
            </div>
          ))}
          <div className="rounded-lg overflow-hidden border border-subtle h-64">
            <iframe
              title="Barasat Map"
              src="https://www.google.com/maps?q=Barasat,West+Bengal&output=embed"
              width="100%" height="100%" style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <style>{`
        .ipt { width: 100%; padding: 0.7rem 0.9rem; border: 1px solid var(--subtle-border); border-radius: 6px; background: var(--offwhite); font-family: var(--font-sans); font-size: 0.9rem; transition: border-color 0.2s; }
        .ipt:focus { outline: none; border-color: var(--gold); }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-[var(--charcoal)] mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}