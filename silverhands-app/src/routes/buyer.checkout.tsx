import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, CheckCircle2, CreditCard, Smartphone } from "lucide-react";

import { EmptyState, SectionHeading } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import { clearCart, requireSession, useMarketState } from "@/lib/store";
import { useFormatPrice } from "@/lib/currency";

export const Route = createFileRoute("/buyer/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | SilverHands" },
      { name: "description", content: "Review and place your order." },
    ],
  }),
  component: Checkout,
});

type PaymentMethod = "upi" | "card" | "cod";

const METHODS: { id: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "cod", label: "Cash on delivery", icon: Banknote },
];

function Checkout() {
  const { cart } = useMarketState();
  const navigate = useNavigate();
  const formatPrice = useFormatPrice();
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [placedOrder, setPlacedOrder] = useState<{ id: string; total: number; method: PaymentMethod } | null>(
    null,
  );

  const counts = new Map<string, number>();
  for (const id of cart) counts.set(id, (counts.get(id) ?? 0) + 1);
  const rows = Array.from(counts.entries())
    .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
    .filter((r): r is { product: (typeof products)[number]; qty: number } => !!r.product);
  const subtotal = rows.reduce((sum, r) => sum + r.product.price * r.qty, 0);

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="surface flex flex-col items-center gap-4 p-10 text-center">
          <CheckCircle2 className="size-14 text-primary" aria-hidden />
          <h1 className="font-display text-3xl font-semibold">Order placed!</h1>
          <p className="text-muted-foreground">
            Order <span className="font-medium text-foreground">#{placedOrder.id}</span> for{" "}
            {formatPrice(placedOrder.total)}, paying by{" "}
            {METHODS.find((m) => m.id === placedOrder.method)?.label}.
          </p>
          <p className="text-sm text-muted-foreground">
            This is a demo checkout — no real payment was processed. Each seller will reach out
            directly to arrange delivery.
          </p>
          <div className="mt-2 flex gap-3">
            <Button asChild variant="outline">
              <Link to="/buyer/products">Keep browsing</Link>
            </Button>
            <Button asChild>
              <Link to="/buyer">Back home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="Nothing to check out"
        description="Your cart is empty — add a product first."
        action={
          <Button asChild size="lg">
            <Link to="/buyer/products">Browse products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-10">
      <SectionHeading eyebrow="Checkout" title="Review your order" />

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-8">
          <section className="surface p-6">
            <h2 className="text-xl font-semibold">Items</h2>
            <ul className="mt-4 space-y-3">
              {rows.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    {product.name} × {qty}
                  </span>
                  <span className="font-medium">{formatPrice(product.price * qty)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="surface p-6">
            <h2 className="text-xl font-semibold">Payment method</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This is a demo — no real payment is processed.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {METHODS.map((m) => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <Icon className="size-5" aria-hidden />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="surface h-fit space-y-5 p-6">
          <h2 className="text-xl font-semibold">Total</h2>
          <div className="flex items-center justify-between text-lg">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <Button
            size="lg"
            variant="gold"
            className="w-full"
            onClick={() => {
              if (!requireSession(navigate, "/buyer/checkout")) return;
              const id = Math.random().toString(36).slice(2, 8).toUpperCase();
              clearCart();
              setPlacedOrder({ id, total: subtotal, method });
            }}
          >
            Place order
          </Button>
        </aside>
      </div>
    </div>
  );
}
