import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { EmptyState, ProductCard, SectionHeading, ServiceCard } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { products, services } from "@/lib/data";
import { useMarketState } from "@/lib/store";

export const Route = createFileRoute("/buyer/favorites")({
  head: () => ({
    meta: [
      { title: "Your favorites | SilverHands" },
      { name: "description", content: "Every seller, service and handmade piece you've saved." },
      { property: "og:title", content: "Your favorites | SilverHands" },
      { property: "og:description", content: "Everything you've saved on SilverHands." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { favorites } = useMarketState();
  const savedServices = services.filter((s) => favorites.includes(s.id));
  const savedProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="space-y-12">
      <SectionHeading eyebrow="Saved" title="Your favorites" />

      {!savedServices.length && !savedProducts.length ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          description="Tap the heart on any service or product and it will wait for you here."
          action={
            <Button asChild size="lg">
              <Link to="/buyer/services">Start exploring</Link>
            </Button>
          }
        />
      ) : (
        <>
          {!!savedServices.length && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedServices.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
          {!!savedProducts.length && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {savedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
