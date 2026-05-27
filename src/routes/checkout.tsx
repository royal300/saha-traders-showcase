import { createFileRoute, Link, useNavigate, useLoaderData } from "@tanstack/react-router";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart";
import { inr, globalSettings } from "@/lib/products";
import { saveCustomerOrderFn } from "@/lib/server-functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Saha Marble & Tiles" }, { name: "description", content: "Complete your order at Saha Marble & Tiles." }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const rootData = useLoaderData({ from: "__root__" }) as any;
  const settings = rootData?.settings || globalSettings;

  const { items, subtotal, clear, setQty } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [form, setForm] = React.useState({ name: "", mobile: "", address: "" });
  const total = subtotal;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Build structured WhatsApp message
    const itemsList = items.map((i, idx) => (
      `${idx + 1}. *${i.name}* (Qty: ${i.qty})\n` +
      `   Price: ${inr(i.price)} each | Total: ${inr(i.price * i.qty)}`
    )).join("\n\n");

    const message = 
      `🛍️ *New Order from Saha Marble & Tiles*\n` +
      `----------------------------------------\n` +
      `👤 *Name:* ${form.name}\n` +
      `📞 *Mobile:* ${form.mobile}\n` +
      `📍 *Address:* ${form.address}\n` +
      `----------------------------------------\n` +
      `📋 *Items I want to purchase:* \n\n` +
      `${itemsList}\n\n` +
      `----------------------------------------\n` +
      `💰 *Grand Total:* ${inr(total)}`;

    const encodedMessage = encodeURIComponent(message);
    const phone = settings.whatsapp_number || "919330833711";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    // Save details to database asynchronously before redirection
    saveCustomerOrderFn({
      data: {
        name: form.name,
        mobile: form.mobile,
        address: form.address,
        items: items.map(i => ({ name: i.name, qty: i.qty })),
        total: total
      }
    }).catch(err => console.error("Error logging customer order to DB:", err));

    const order = { items, total, form, pay: "WhatsApp", at: new Date().toISOString() };
    try { localStorage.setItem("saha_last_order", JSON.stringify(order)); } catch {}
    
    clear();
    window.open(whatsappUrl, "_blank");
    navigate({ to: "/order-success" });
  };

  if (items.length === 0) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="font-display text-3xl text-slate-brand">Your cart is empty</h1>
        <Link to="/" className="btn-gold mt-6 inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <section className="container-x py-16 max-w-3xl">
      <h1 className="font-display text-4xl text-slate-brand text-center mb-10">Checkout</h1>

      <div className="bg-white rounded-lg mb-6 shadow-sm">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left border-b border-subtle">
          <span className="font-display text-lg text-slate-brand">Order Summary ({items.length})</span>
          <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`}/>
        </button>
        {open && (
          <div className="px-4 pb-4 space-y-3 pt-4">
            {items.map((i) => (
              <div key={i.slug} className="flex gap-3 items-center text-sm">
                <img src={i.image} alt="" className="w-14 h-14 object-cover rounded"/>
                <div className="flex-1">
                  <div className="font-medium text-slate-brand leading-tight mb-1.5">{i.name}</div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setQty(i.slug, i.qty - 1)} className="w-6 h-6 flex items-center justify-center rounded border border-subtle bg-[var(--offwhite)] hover:border-[var(--gold)] transition-colors text-sm font-medium">-</button>
                    <span className="text-xs font-semibold w-4 text-center">{i.qty}</span>
                    <button type="button" onClick={() => setQty(i.slug, i.qty + 1)} className="w-6 h-6 flex items-center justify-center rounded border border-subtle bg-[var(--offwhite)] hover:border-[var(--gold)] transition-colors text-sm font-medium">+</button>
                  </div>
                </div>
                <div className="text-[var(--gold)] font-semibold price-inr">{inr(i.price * i.qty)}</div>
              </div>
            ))}
            <div className="border-t border-subtle pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-base font-semibold text-slate-brand">
                <span>Grand Total</span><span className="text-[var(--gold)] price-inr">{inr(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="bg-gradient-to-br from-white to-[#f8f9fa] rounded-xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-subtle space-y-5 relative overflow-hidden mt-8">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--gold)] via-[#facc15] to-[#fef08a]" />
        <h2 className="font-display text-2xl text-slate-brand mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)] text-sm font-bold">1</span>
          Customer Details
        </h2>
        <div className="space-y-4">
          <Field label="Full Name *"><input required value={form.name} onChange={set("name")} className="ipt" placeholder="e.g. Rahul Sharma"/></Field>
          <Field label="Mobile Number *"><input required value={form.mobile} onChange={set("mobile")} className="ipt" placeholder="10-digit mobile number"/></Field>
          <Field label="Delivery Address *"><textarea required rows={3} value={form.address} onChange={set("address")} className="ipt" placeholder="Full delivery address with landmark"/></Field>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-[#25D366] to-[#1da851] hover:from-[#20ba5a] hover:to-[#178f44] text-white flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-base font-bold shadow-lg shadow-green-500/25 cursor-pointer transition-all hover:-translate-y-0.5 mt-8 uppercase tracking-widest">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="shrink-0 animate-pulse">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.388 2.016 13.91 1.01 11.999 1.01c-5.435 0-9.861 4.371-9.865 9.802-.001 1.84.498 3.631 1.444 5.218L2.539 21.05l4.108-1.896zm12.355-6.223c-.302-.151-1.789-.882-2.057-.981-.268-.099-.463-.148-.658.151-.195.298-.754.981-.925 1.18-.17.198-.341.222-.643.072-1.054-.528-1.824-.875-2.584-2.18-.198-.342.198-.318.567-1.054.061-.121.03-.227-.015-.318-.046-.091-.463-1.12-.634-1.533-.166-.406-.333-.351-.463-.357-.12-.006-.258-.007-.396-.007-.138 0-.363.052-.553.259-.19.206-.728.712-.728 1.738 0 1.026.744 2.016.848 2.152.104.135 1.464 2.235 3.548 3.136.495.215.882.343 1.185.439.497.158.951.135 1.309.082.399-.058 1.789-.731 2.042-1.439.253-.708.253-1.314.177-1.439-.077-.124-.277-.197-.579-.348z" />
          </svg>
          Order via WhatsApp
        </button>
      </form>

      <style>{`
        .ipt { width:100%; padding:0.85rem 1.1rem; border:1px solid #d4d4d8; border-radius:8px; background:#fff; font-family:var(--font-sans); font-size:0.95rem; font-weight:500; color:var(--charcoal); transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 4px rgba(0,0,0,0.01) inset; }
        .ipt::placeholder { color: #a1a1aa; font-weight: 400; }
        .ipt:focus { outline:none; border-color: var(--gold); box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.15), 0 2px 4px rgba(0,0,0,0.01) inset; transform: translateY(-1px); }
      `}</style>
    </section>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex justify-between"><span className="text-[var(--charcoal)]/70">{l}</span><span>{v}</span></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block group">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-brand/70 mb-2 block group-focus-within:text-[var(--gold)] transition-colors">{label}</span>
      {children}
    </label>
  );
}