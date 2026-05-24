import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { inr } from "@/lib/products";

export const Route = createFileRoute("/order-success")({
  head: () => ({ meta: [{ title: "Order Placed — Saha Marble & Tiles" }] }),
  component: SuccessPage,
});

type Order = {
  items: { slug: string; name: string; price: number; qty: number; image: string }[];
  total: number;
  form: { name: string; mobile: string; address: string; city: string; pin: string };
  pay: string;
};

function SuccessPage() {
  const [order, setOrder] = React.useState<Order | null>(null);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("saha_last_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <section className="container-x py-20 max-w-2xl text-center">
      <svg className="mx-auto mb-6" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="var(--gold)" strokeWidth="4" fill="none" className="check-circle"/>
        <path d="M30 52 L45 67 L72 38" stroke="var(--gold)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="check-tick"/>
      </svg>
      <h1 className="font-display text-4xl text-slate-brand">Order Placed Successfully! 🎉</h1>
      <p className="mt-4 text-[var(--charcoal)] max-w-md mx-auto">
        Thank you{order?.form?.name ? `, ${order.form.name}` : ""}! Your order has been received. Our team will contact you{order?.form?.mobile ? ` at ${order.form.mobile}` : ""} within 24 hours to confirm.
      </p>

      {order && (
        <div className="mt-10 bg-white border border-subtle rounded-lg p-6 text-left">
          <h2 className="font-display text-xl text-slate-brand mb-4">Order Summary</h2>
          <div className="space-y-3">
            {order.items.map((i) => (
              <div key={i.slug} className="flex gap-3 text-sm">
                <img src={i.image} alt="" className="w-12 h-12 object-cover rounded"/>
                <div className="flex-1">{i.name} <span className="text-[var(--charcoal)]/60">× {i.qty}</span></div>
                <div className="text-[var(--gold)] font-semibold">{inr(i.price * i.qty)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-subtle flex justify-between font-semibold text-slate-brand">
            <span>Grand Total</span><span className="text-[var(--gold)]">{inr(order.total)}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-subtle text-sm">
            <div className="text-[var(--charcoal)]/70 uppercase text-xs tracking-wider mb-1">Delivery Address</div>
            <div>{order.form.address}, {order.form.city} - {order.form.pin}</div>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Link to="/category/$slug" params={{ slug: "floor-tiles" }} className="btn-gold">Continue Shopping</Link>
        <Link to="/" className="btn-slate">Go to Home</Link>
      </div>
    </section>
  );
}