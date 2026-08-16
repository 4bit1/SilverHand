import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { SectionHeading, ServiceCard, EmptyState, StitchDivider } from "@/components/Cards";
import { Search } from "lucide-react";
import { categories, services } from "@/lib/data";
import { cn } from "@/lib/utils";

type ServicesSearch = { category?: string; q?: string };

export const Route = createFileRoute("/buyer/services")({
  validateSearch: (search: Record<string, unknown>): ServicesSearch => {
    const category = typeof search["category"] === "string" ? search["category"] : undefined;
    const q = typeof search["q"] === "string" ? search["q"] : undefined;
    return { ...(category ? { category } : {}), ...(q ? { q } : {}) };
  },
  head: () => ({
    meta: [
      { title: "Explore services | SilverHands" },
      {
        name: "description",
        content:
          "Book tutoring, tailoring, home-cooked meals, gardening and more from experienced senior and homemaker sellers.",
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
  const { category, q } = Route.useSearch();
  const navigate = useNavigate();
  const active = category ?? "All";
  const [query, setQuery] = useState(q ?? "");

  const list = services.filter((s) => {
    const matchesCategory = active === "All" || s.category === active;
    const needle = (q ?? "").trim().toLowerCase();
    const matchesQuery =
      !needle ||
      s.title.toLowerCase().includes(needle) ||
      s.category.toLowerCase().includes(needle) ||
      s.seller.toLowerCase().includes(needle);
    return matchesCategory && matchesQuery;
  });

  function setActive(next: string) {
    navigate({ to: "/buyer/services", search: { ...(next !== "All" ? { category: next } : {}), ...(q ? { q } : {}) } });
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({
      to: "/buyer/services",
      search: { ...(active !== "All" ? { category: active } : {}), ...(query.trim() ? { q: query.trim() } : {}) },
    });
  }

  return (
    <div>
      <SectionHeading eyebrow="Explore" title="Services" />

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
          placeholder="Search services — e.g. tailoring, tutoring, sitar"
          className="h-13 w-full rounded-full border border-border bg-card pl-13 pr-5 text-base shadow-soft outline-none placeholder:text-muted-foreground"
        />
      </form>

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["All", ...categories.map((c) => c.name)].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
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
