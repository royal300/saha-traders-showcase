import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Saha Marble & Tiles" }, { name: "description", content: "Complete your order at Saha Marble & Tiles." }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [form, setForm] = React.useState({ name: "", mobile: "", address: "" });
  const delivery = subtotal >= 5000 || subtotal === 0 ? 0 : 200;
  const total = subtotal + delivery;

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
    const whatsappUrl = `https://wa.me/919330833711?text=${encodedMessage}`;

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

      <div className="bg-white border border-subtle rounded-lg mb-8">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
          <span className="font-display text-lg text-slate-brand">Order Summary ({items.length} items)</span>
          <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`}/>
        </button>
        {open && (
          <div className="px-5 pb-5 space-y-3 border-t border-subtle pt-4">
            {items.map((i) => (
              <div key={i.slug} className="flex gap-3 items-center text-sm">
                <img src={i.image} alt="" className="w-14 h-14 object-cover rounded"/>
                <div className="flex-1">
                  <div className="font-medium text-slate-brand">{i.name}</div>
                  <div className="text-[var(--charcoal)]/70 text-xs">Qty: {i.qty}</div>
                </div>
                <div className="text-[var(--gold)] font-semibold">{inr(i.price * i.qty)}</div>
              </div>
            ))}
            <div className="border-t border-subtle pt-3 space-y-1 text-sm">
              <Row l="Subtotal" v={inr(subtotal)}/>
              <Row l="Delivery" v={delivery === 0 ? "Free" : inr(delivery)}/>
              <div className="flex justify-between pt-2 border-t border-subtle text-base font-semibold text-slate-brand">
                <span>Grand Total</span><span className="text-[var(--gold)]">{inr(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="bg-white border border-subtle rounded-lg p-7 space-y-4">
        <h2 className="font-display text-xl text-slate-brand mb-2">Delivery Details</h2>
        <Field label="Full Name *"><input required value={form.name} onChange={set("name")} className="ipt" placeholder="Enter your full name"/></Field>
        <Field label="Mobile Number *"><input required value={form.mobile} onChange={set("mobile")} className="ipt" placeholder="Enter 10-digit mobile number"/></Field>
        <Field label="Delivery Address *"><textarea required rows={4} value={form.address} onChange={set("address")} className="ipt" placeholder="Enter short delivery address"/></Field>

        <button type="submit" className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center gap-2.5 py-4 px-6 rounded-lg text-base font-bold shadow-lg shadow-green-500/20 cursor-pointer transition-colors mt-6 uppercase tracking-wider">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="shrink-0 animate-bounce">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.388 2.016 13.91 1.01 11.999 1.01c-5.435 0-9.861 4.371-9.865 9.802-.001 1.84.498 3.631 1.444 5.218L2.539 21.05l4.108-1.896zm12.355-6.223c-.302-.151-1.789-.882-2.057-.981-.268-.099-.463-.148-.658.151-.195.298-.754.981-.925 1.18-.17.198-.341.222-.643.072-1.054-.528-1.824-.875-2.584-2.18-.198-.342.198-.318.567-1.054.061-.121.03-.227-.015-.318-.046-.091-.463-1.12-.634-1.533-.166-.406-.333-.351-.463-.357-.12-.006-.258-.007-.396-.007-.138 0-.363.052-.553.259-.19.206-.728.712-.728 1.738 0 1.026.744 2.016.848 2.152.104.135 1.464 2.235 3.548 3.136.495.215.882.343 1.185.439.497.158.951.135 1.309.082.399-.058 1.789-.731 2.042-1.439.253-.708.253-1.314.177-1.439-.077-.124-.277-.197-.579-.348z" />
          </svg>
          Order via WhatsApp
        </button>
      </form>

      <style>{`
        .ipt { width:100%; padding:0.7rem 0.9rem; border:1px solid var(--subtle-border); border-radius:6px; background:var(--offwhite); font-family:var(--font-sans); font-size:0.9rem; transition:border-color 0.2s; }
        .ipt:focus { outline:none; border-color: var(--gold); }
      `}</style>
    </section>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex justify-between"><span className="text-[var(--charcoal)]/70">{l}</span><span>{v}</span></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-[var(--charcoal)] mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}