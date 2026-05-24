import { Link } from "@tanstack/react-router";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/products";

export function CartDrawer() {
  const { open, setOpen, items, setQty, remove, subtotal } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-subtle">
          <h3 className="font-display text-xl text-slate-brand flex items-center gap-2">
            <ShoppingBag size={18} className="text-[var(--gold)]"/> Your Cart
          </h3>
          <button onClick={() => setOpen(false)} className="text-[var(--slate)] hover:text-[var(--gold)]"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-20 text-[var(--charcoal)]/60">
              <ShoppingBag size={40} className="mx-auto mb-3 text-[var(--gold)]"/>
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((i) => (
                <div key={i.slug} className="flex gap-3 border-b border-subtle pb-4">
                  <img src={i.image} alt={i.name} className="w-20 h-20 object-cover rounded"/>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm text-slate-brand line-clamp-2">{i.name}</div>
                    <div className="text-[var(--gold)] font-semibold text-sm mt-1">{inr(i.price)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => i.qty === 1 ? remove(i.slug) : setQty(i.slug, i.qty - 1)} className="w-7 h-7 border border-subtle rounded flex items-center justify-center hover:border-[var(--gold)]"><Minus size={12}/></button>
                      <span className="text-sm w-6 text-center">{i.qty}</span>
                      <button onClick={() => setQty(i.slug, i.qty + 1)} className="w-7 h-7 border border-subtle rounded flex items-center justify-center hover:border-[var(--gold)]"><Plus size={12}/></button>
                      <button onClick={() => remove(i.slug)} className="ml-auto text-[var(--charcoal)]/50 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-subtle px-6 py-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-brand">{inr(subtotal)}</span>
          </div>
          <Link to="/checkout" onClick={() => setOpen(false)} className="btn-gold w-full">
            Proceed to Checkout
          </Link>
          <button onClick={() => setOpen(false)} className="text-xs text-[var(--charcoal)]/70 hover:text-[var(--gold)] w-full text-center">
            Continue Shopping
          </button>
        </div>
      </aside>
    </div>
  );
}