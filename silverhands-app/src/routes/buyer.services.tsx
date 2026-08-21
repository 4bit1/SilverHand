import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, Star } from "lucide-react";

import { SectionHeading, ServiceCard, EmptyState, StitchDivider } from "@/components/Cards";
import { categories, services } from "@/lib/data";
import { detectLocationNeedle, sortByMode, type SortMode } from "@/lib/ranking";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

type ServicesSearch = { category?: string; q?: string; sort?: SortMode };

export const Route = createFileRoute("/buyer/services")({
  validateSearch: (search: Record<string, unknown>): ServicesSearch => {
    const category = typeof search["category"] === "string" ? search["category"] : undefined;
    const q = typeof search["q"] === "string" ? search["q"] : undefined;
    const sort = search["sort"] === "rating" ? "rating" : undefined;
    return { ...(category ? { category } : {}), ...(q ? { q } : {}), ...(sort ? { sort } : {}) };
  },
  head: () => ({
    meta: [
      { title: "Explore services | SilverHands" },
      {
        name: "description",
        content:
          "Book tutoring, handicrafts, home-cooked meals, gardening and more from experienced senior and homemaker sellers.",
      },
      { property: "og:title", content: "Explore services | SilverHands" },
      {
        property: "og:description",
        content: "Book trusted local services from experienced senior and homemaker sellers.",
      },
    ],
  }),
  component: ExploreServices,
});

function ExploreServices() {
  const { category, q, sort } = Route.useSearch();
  const navigate = useNavigate();
  const active = category ?? "All";
  const mode: SortMode = sort ?? "fair";
  const [query, setQuery] = useState(q ?? "");
  const t = useT();

  const filtered = services.filter((s) => {
    const matchesCategory = active === "All" || s.category === active;
    const needle = (q ?? "").trim().toLowerCase();
    const matchesQuery =
      !needle ||
      s.title.toLowerCase().includes(needle) ||
      s.category.toLowerCase().includes(needle) ||
      s.seller.toLowerCase().includes(needle) ||
      s.location.toLowerCase().includes(needle);
    return matchesCategory && matchesQuery;
  });

  const locationNeedle = detectLocationNeedle(q);
  const list = sortByMode(filtered, mode, locationNeedle);

  function pushSearch(next: Partial<ServicesSearch>) {
    const merged = { category, q, sort, ...next };
    navigate({
      to: "/buyer/services",
      search: {
        ...(merged.category && merged.category !== "All" ? { category: merged.category } : {}),
        ...(merged.q?.trim() ? { q: merged.q.trim() } : {}),
        ...(merged.sort && merged.sort !== "fair" ? { sort: merged.sort } : {}),
      },
    });
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    pushSearch({ q: query });
  }

  return (
    <div>
      <SectionHeading eyebrow="Explore" title={t("explore.services")} />

      <form onSubmit={submitSearch} className="relative mb-6 max-w-xl">
        <label htmlFor="services-q" className="sr-only">
          Search services
        </label>
        <Search
          className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="services-q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services — e.g. gardening, tutoring in Chennai, sitar"
          className="h-13 w-full rounded-full border border-border bg-card pl-13 pr-5 text-base shadow-soft outline-none placeholder:text-muted-foreground"
        />
      </form>

      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["All", ...categories.map((c) => c.name)].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => pushSearch({ category: c })}
            aria-pressed={active === c}
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
              active === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary hover:text-primary",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-primary-soft/60 p-4">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => pushSearch({ sort: "fair" })}
            aria-pressed={mode === "fair"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              mode === "fair" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Sparkles className="size-3.5" aria-hidden /> {t("explore.fairDiscovery")}
          </button>
          <button
            type="button"
            onClick={() => pushSearch({ sort: "rating" })}
            aria-pressed={mode === "rating"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              mode === "rating" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Star className="size-3.5" aria-hidden /> {t("explore.topRated")}
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          {mode === "fair"
            ? t("explore.fairDiscoveryHint")
            : "Sorted by rating and review count only — this is what most marketplaces default to."}
          {locationNeedle && mode === "fair" && ` Boosting sellers near ${locationNeedle}.`}
        </p>
      </div>

      <StitchDivider className="mb-8" />

      {list.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No matches yet"
          description={`Nothing found${q ? ` for "${q}"` : ""} in ${active === "All" ? "any category" : active}. Try a different search or browse all categories.`}
        />
      )}
    </div>
  );
}
