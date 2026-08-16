import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Search, Sparkles, MapPin } from "lucide-react";

import { ProductCard, SectionHeading, ServiceCard, StitchDivider } from "@/components/Cards";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/ui/button";
import { categories, products, services } from "@/lib/data";

export const Route = createFileRoute("/buyer/")({
  head: () => ({
    meta: [
      { title: "Discover local makers & experts | SilverHands" },
      {
        name: "description",
        content:
          "Search AI-curated services, handmade products and mentors from senior citizens and homemakers near you.",
      },
      { property: "og:title", content: "Discover local makers & experts | SilverHands" },
      {
        property: "og:description",
        content: "AI-curated services, handmade products and mentors near you.",
      },
    ],
  }),
  component: BuyerHome,
});

function BuyerHome() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    navigate({ to: "/buyer/services", search: query.trim() ? { q: query.trim() } : {} });
  }

  return (
    <div className="space-y-20">
      <section className="surface rise-in px-6 py-12 text-center lg:px-16 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Curated by people with decades of practice
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
          What would you like to find today?
        </h1>
        <form onSubmit={submitSearch} className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <label htmlFor="q" className="sr-only">
            Search services and products
          </label>
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              id="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “home-cooked meals near me”"
              className="h-15 w-full rounded-full border border-border bg-card pl-13 pr-5 text-base shadow-soft outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" size="xl" variant="gold">
            <Sparkles /> AI Search
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          AI understands plain language — describe the outcome you want, not the keyword.
        </p>
      </section>

      <section>
        <SectionHeading eyebrow="Trending" title="Browse by category" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.name}
              to="/buyer/services"
              search={{ category: c.name }}
              className="surface hover-lift group overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="font-display font-semibold leading-snug">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.count} listings</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <StitchDivider />

      <section>
        <SectionHeading
          eyebrow="Featured"
          title="Services worth booking"
          action={
            <Button asChild variant="outline">
              <Link to="/buyer/services">View all services</Link>
            </Button>
          }
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Handmade, not mass-produced"
          title="Made slowly, by hand"
          action={
            <Button asChild variant="outline">
              <Link to="/buyer/products">View all products</Link>
            </Button>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Recommended for you" title="Sellers you may love" />
        <div className="grid gap-6 md:grid-cols-3">
          {services.slice(0, 3).map((s) => (
            <div key={s.id} className="surface flex items-center gap-4 p-6">
              <img
                src={s.image}
                alt={s.seller}
                loading="lazy"
                className="size-16 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-display font-semibold">{s.seller}</p>
                <p className="text-sm text-muted-foreground">{s.sellerAge}</p>
                <Stars rating={s.rating} reviews={s.reviews} className="mt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface flex flex-col items-start gap-6 bg-primary-soft p-8 lg:flex-row lg:items-center lg:p-12">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <MapPin className="size-7" aria-hidden />
        </span>
        <div>
          <h2 className="text-3xl">Nearby opportunities</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Eleven sellers within 3 km are open for bookings this week — including two tiffin
            kitchens and a retired chartered accountant offering tax consultations.
          </p>
        </div>
        <Button asChild size="lg" className="lg:ml-auto">
          <Link to="/buyer/services">See what's close by</Link>
        </Button>
      </section>
    </div>
  );
}
