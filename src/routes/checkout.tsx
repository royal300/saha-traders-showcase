import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Saha Traders" }, { name: "description", content: "Complete your order at Saha Traders." }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [pay, setPay] = React.useState("cod");
  const [form, setForm] = React.useState({ name: "", mobile: "", email: "", address: "", city: "Barasat", pin: "", landmark: "" });
  const delivery = subtotal >= 5000 || subtotal === 0 ? 0 : 200;
  const total = subtotal + delivery;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const order = { items, total, form, pay, at: new Date().toISOString() };
    try { localStorage.setItem("saha_last_order", JSON.stringify(order)); } catch {}
    clear();
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
        <Field label="Full Name *"><input required value={form.name} onChange={set("name")} className="ipt"/></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Mobile Number *"><input required value={form.mobile} onChange={set("mobile")} className="ipt"/></Field>
          <Field label="Email Address"><input type="email" value={form.email} onChange={set("email")} className="ipt"/></Field>
        </div>
        <Field label="Delivery Address *"><textarea required rows={3} value={form.address} onChange={set("address")} className="ipt"/></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="City *"><input required value={form.city} onChange={set("city")} className="ipt"/></Field>
          <Field label="PIN Code *"><input required value={form.pin} onChange={set("pin")} className="ipt"/></Field>
        </div>
        <Field label="Landmark"><input value={form.landmark} onChange={set("landmark")} className="ipt"/></Field>

        <div className="pt-3 border-t border-subtle">
          <h2 className="font-display text-xl text-slate-brand mb-3">Payment Method</h2>
          <label className="flex items-center gap-3 p-4 border border-subtle rounded-md cursor-pointer hover:border-[var(--gold)]">
            <input type="radio" name="pay" checked={pay === "cod"} onChange={() => setPay("cod")} className="accent-[var(--gold)]"/>
            <span className="text-sm font-medium">Cash on Delivery</span>
          </label>
          <label className="flex items-center gap-3 p-4 border border-subtle rounded-md cursor-pointer hover:border-[var(--gold)] mt-2">
            <input type="radio" name="pay" checked={pay === "bank"} onChange={() => setPay("bank")} className="accent-[var(--gold)]"/>
            <span className="text-sm font-medium">Bank Transfer</span>
          </label>
          <p className="text-xs text-[var(--charcoal)]/60 mt-2">Online payment coming soon.</p>
        </div>

        <button className="btn-gold w-full !py-3.5 text-base">Place Order</button>
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