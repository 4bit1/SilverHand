import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, MapPin, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Stars } from "@/components/Stars";
import { inr, type Product, type Service } from "@/lib/data";
import { addToCart, requireSession, toggleFavorite, useMarketState } from "@/lib/store";
import { cn } from "@/lib/utils";

export function StitchDivider({ className = "" }: { className?: string }) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn("h-[2px] w-full opacity-60", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--accent) 0 10px, transparent 10px 18px)",
      }}
    />
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const { favorites } = useMarketState();
  const navigate = useNavigate();
  const fav = favorites.includes(service.id);

  return (
    <article className="surface hover-lift group flex flex-col overflow-hidden">
      <div className="relative">
        <Link
          to="/buyer/service/$id"
          params={{ id: service.id }}
          className="block aspect-[4/3] overflow-hidden"
        >
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          onClick={() => {
            if (!requireSession(navigate, `/buyer/service/${service.id}`)) return;
            toggleFavorite(service.id);
          }}
          aria-pressed={fav}
          aria-label={fav ? "Remove from favorites" : "Save to favorites"}
          className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-card/90 shadow-soft backdrop-blur transition-colors hover:bg-card"
        >
          <Heart className={cn("size-5", fav ? "fill-accent text-accent" : "text-foreground")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          {service.category}
        </span>
        <Link
          to="/buyer/service/$id"
          params={{ id: service.id }}
          className="font-display text-lg leading-snug font-semibold hover:text-primary"
        >
          {service.title}
        </Link>
        <p className="text-sm text-muted-foreground">
          {service.seller} · {service.sellerAge}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Stars rating={service.rating} reviews={service.reviews} />
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden />
            {service.location}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <p className="text-lg font-semibold">
            {inr(service.price)}{" "}
            <span className="text-sm font-normal text-muted-foreground">{service.unit}</span>
          </p>
          <Button asChild variant="gold">
            <Link to="/buyer/service/$id" params={{ id: service.id }}>
              Book
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { favorites } = useMarketState();
  const navigate = useNavigate();
  const fav = favorites.includes(product.id);

  return (
    <article className="surface hover-lift group flex flex-col overflow-hidden">
      <div className="relative">
        <Link
          to="/buyer/product/$id"
          params={{ id: product.id }}
          className="block aspect-[4/5] overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          onClick={() => {
            if (!requireSession(navigate, `/buyer/product/${product.id}`)) return;
            toggleFavorite(product.id);
          }}
          aria-pressed={fav}
          aria-label={fav ? "Remove from favorites" : "Save to favorites"}
          className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-card/90 shadow-soft backdrop-blur transition-colors hover:bg-card"
        >
          <Heart className={cn("size-5", fav ? "fill-accent text-accent" : "text-foreground")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <Link
          to="/buyer/product/$id"
          params={{ id: product.id }}
          className="font-display text-lg leading-snug font-semibold hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground">by {product.seller}</p>
        <Stars rating={product.rating} reviews={product.reviews} />
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="text-lg font-semibold">{inr(product.price)}</p>
          <Button
            variant="outline"
            onClick={() => {
              if (!requireSession(navigate, `/buyer/product/${product.id}`)) return;
              addToCart(product.id);
              toast.success("Added to cart", { description: product.name });
            }}
          >
            <ShoppingBag /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        )}
        <h2 className="mt-1 text-3xl md:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="surface flex flex-col items-center gap-4 px-6 py-20 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-primary-soft text-primary">
        <Icon className="size-7" aria-hidden />
      </span>
      <h3 className="text-2xl">{title}</h3>
      <p className="max-w-md text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
