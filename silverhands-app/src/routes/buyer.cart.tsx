import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { EmptyState, SectionHeading } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import { addToCart, removeFromCart, requireSession, useMarketState } from "@/lib/store";
import { useFormatPrice } from "@/lib/currency";

export const Route = createFileRoute("/buyer/cart")({
  head: () => ({
    meta: [
      { title: "Your cart | SilverHands" },
      { name: "description", content: "Review what's in your cart before checkout." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart } = useMarketState();
  const navigate = useNavigate();
  const formatPrice = useFormatPrice();

  const counts = new Map<string, number>();
  for (const id of cart) counts.set(id, (counts.get(id) ?? 0) + 1);

  const rows = Array.from(counts.entries())
    .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
    .filter((r): r is { product: (typeof products)[number]; qty: number } => !!r.product);

  const subtotal = rows.reduce((sum, r) => sum + r.product.price * r.qty, 0);

  function removeAll(id: string, qty: number) {
    for (let i = 0; i < qty; i++) removeFromCart(id);
  }

  return (
    <div className="space-y-10">
      <SectionHeading eyebrow="Cart" title="Your cart" />

      {rows.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add a handmade product you love and it will wait for you here."
          action={
            <Button asChild size="lg">
              <Link to="/buyer/products">Browse products</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <ul className="space-y-4">
            {rows.map(({ product, qty }) => (
              <li key={product.id} className="surface flex flex-wrap items-center gap-5 p-5">
                <Link to="/buyer/product/$id" params={{ id: product.id }} className="shrink-0">
                  <img src={product.image} alt="" className="size-20 rounded-xl object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/buyer/product/$id"
                    params={{ id: product.id }}
                    className="font-display text-lg font-semibold hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-muted-foreground">{formatPrice(product.price)} each</p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    aria-label={`Decrease quantity of ${product.name}`}
                    className="grid size-8 place-items-center rounded-full hover:bg-muted"
                  >
                    <Minus className="size-4" aria-hidden />
                  </button>
                  <span className="w-6 text-center font-medium">{qty}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(product.id)}
                    aria-label={`Increase quantity of ${product.name}`}
                    className="grid size-8 place-items-center rounded-full hover:bg-muted"
                  >
                    <Plus className="size-4" aria-hidden />
                  </button>
                </div>

                <p className="w-24 text-right text-lg font-semibold">
                  {formatPrice(product.price * qty)}
                </p>

                <button
                  type="button"
                  onClick={() => removeAll(product.id, qty)}
                  aria-label={`Remove ${product.name} from cart`}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          <aside className="surface h-fit space-y-5 p-6">
            <h2 className="text-xl font-semibold">Order summary</h2>
            <div className="flex items-center justify-between text-lg">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Delivery is arranged directly with each seller after checkout.
            </p>
            <Button
              size="lg"
              variant="gold"
              className="w-full"
              onClick={() => {
                if (!requireSession(navigate, "/buyer/checkout")) return;
                navigate({ to: "/buyer/checkout" });
              }}
            >
              Proceed to checkout
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
