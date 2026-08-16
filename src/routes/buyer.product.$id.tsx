import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";

import { Stars } from "@/components/Stars";
import { Button } from "@/components/ui/button";
import { inr, products, reviews } from "@/lib/data";
import { addToCart, requireSession } from "@/lib/store";

export const Route = createFileRoute("/buyer/product/$id")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable | SilverHands" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const description = `${product.name} by ${product.seller} — ${inr(product.price)}, handmade in small batches.`;
    return {
      meta: [
        { title: `${product.name} | SilverHands` },
        { name: "description", content: description },
        { property: "og:title", content: `${product.name} | SilverHands` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <article className="space-y-12">
      <Link to="/buyer/products" className="text-sm font-medium text-primary hover:underline">
        ← Back to products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full rounded-3xl object-cover shadow-soft"
          />
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <img
                key={i}
                src={product.image}
                alt={`${product.name} view ${i + 2}`}
                loading="lazy"
                className="aspect-square rounded-2xl object-cover shadow-soft"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {product.category}
            </p>
            <h1 className="mt-3 text-4xl leading-tight lg:text-5xl">{product.name}</h1>
            <p className="mt-2 text-muted-foreground">by {product.seller}</p>
            <Stars rating={product.rating} reviews={product.reviews} className="mt-3" />
          </div>

          <p className="text-3xl font-semibold">{inr(product.price)}</p>
          <p className="text-lg text-muted-foreground">{product.description}</p>

          <p className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary">
            <Truck className="size-4" aria-hidden /> {product.delivery}
          </p>
          <p className="text-sm text-muted-foreground">{product.stock} in stock</p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="xl"
              variant="gold"
              className="flex-1"
              onClick={() => {
                if (!requireSession(navigate, `/buyer/product/${product.id}`)) return;
                addToCart(product.id);
                toast.success("Added to cart", { description: product.name });
              }}
            >
              <ShoppingBag /> Add to Cart
            </Button>
            <Button asChild size="xl" variant="outline" className="flex-1">
              <Link to="/buyer/messages">Contact seller</Link>
            </Button>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl">Reviews</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="surface p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{r.author}</p>
                <span className="text-sm text-muted-foreground">{r.date}</span>
              </div>
              <Stars rating={r.rating} className="mt-1" />
              <p className="mt-2 text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
