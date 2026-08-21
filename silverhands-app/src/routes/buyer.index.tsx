import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Search, Sparkles, MapPin } from "lucide-react";

import { ProductCard, SectionHeading, ServiceCard, StitchDivider } from "@/components/Cards";
import { Stars } from "@/components/Stars";
import { Button } from "@/components/ui/button";
import { categories, products, services } from "@/lib/data";
import { sortFair } from "@/lib/ranking";
import { usePromotions } from "@/lib/ads";
import { useT } from "@/lib/i18n";

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
  const fairServices = sortFair(services);
  const fairProducts = sortFair(products);
  const promotions = usePromotions();
  const t = useT();

  // Sponsored is a separate, additive slot — it never reorders the
  // Fair-Discovery-ranked lists above/below it. See lib/ads.ts.
  const sponsoredServices = promotions
    .filter((p) => p.kind === "service")
    .map((p) => services.find((s) => s.id === p.id))
    .filter((s): s is (typeof services)[number] => Boolean(s));
  const sponsoredProducts = promotions
    .filter((p) => p.kind === "product")
    .map((p) => products.find((pr) => pr.id === p.id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    navigate({ to: "/buyer/services", search: query.trim() ? { q: query.trim() } : {} });
  }

  return (
    <div className="space-y-20">
      <section className="surface rise-in px-6 py-12 text-center lg:px-16 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {t("buyerHome.searchEyebrow")}
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
          {t("buyerHome.searchHeadline")}
        </h1>
        <form onSubmit={submitSearch} className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <label htmlFor="q" className="sr-only">
            {t("common.search")}
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
              placeholder={t("buyerHome.searchPlaceholder")}
              className="h-15 w-full rounded-full border border-border bg-card pl-13 pr-5 text-base shadow-soft outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" size="xl" variant="gold">
            <Sparkles /> {t("buyerHome.aiSearch")}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">{t("buyerHome.aiSearchHint")}</p>
      </section>

      {(sponsoredServices.length > 0 || sponsoredProducts.length > 0) && (
        <section aria-label={t("buyerHome.sponsored")}>
          <SectionHeading eyebrow={t("buyerHome.sponsored")} title={t("buyerHome.featuredThisWeek")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sponsoredServices.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
            {sponsoredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeading eyebrow={t("buyerHome.trending")} title={t("buyerHome.browseByCategory")} />
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
          eyebrow={t("buyerHome.featured")}
          title={t("buyerHome.servicesWorthBooking")}
          action={
            <Button asChild variant="outline">
              <Link to="/buyer/services">{t("common.viewAll")}</Link>
            </Button>
          }
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fairServices.slice(0, 3).map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow={t("buyerHome.handmade")}
          title={t("buyerHome.madeSlowly")}
          action={
            <Button asChild variant="outline">
              <Link to="/buyer/products">{t("common.viewAll")}</Link>
            </Button>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fairProducts.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow={t("buyerHome.recommended")} title={t("buyerHome.sellersYouMayLove")} />
        <div className="grid gap-6 md:grid-cols-3">
          {fairServices.slice(0, 3).map((s) => (
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
          <h2 className="text-3xl">{t("buyerHome.nearbyOpportunities")}</h2>
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
