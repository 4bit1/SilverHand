import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";

import { ProductCard, SectionHeading, EmptyState, StitchDivider } from "@/components/Cards";
import { categories, products } from "@/lib/data";
import { cn } from "@/lib/utils";

type ProductsSearch = { q?: string; category?: string; sort?: string };

export const Route = createFileRoute("/buyer/products")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => {
    const q = typeof search["q"] === "string" ? search["q"] : undefined;
    const category = typeof search["category"] === "string" ? search["category"] : undefined;
    const sort = typeof search["sort"] === "string" ? search["sort"] : undefined;
    return { ...(q ? { q } : {}), ...(category ? { category } : {}), ...(sort ? { sort } : {}) };
  },
  head: () => ({
    meta: [
      { title: "Handmade products | SilverHands" },
      {
        name: "description",
        content:
          "Shop handwoven textiles, small-batch preserves, embroidery and terracotta made by senior artisans and homemakers.",
      },
      { property: "og:title", content: "Handmade products | SilverHands" },
      {
        property: "og:description",
        content: "Shop handmade goods made slowly by senior artisans and homemakers.",
      },
    ],
  }),
  component: ExploreProducts,
});

function ExploreProducts() {
  const { q, category, sort } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(q ?? "");
  const active = category ?? "All";
  const activeSort = sort ?? "popular";

  const needle = (q ?? "").trim().toLowerCase();
  let list = products.filter((p) => {
    const matchesCategory = active === "All" || p.category === active;
    const matchesQuery =
      !needle ||
      p.name.toLowerCase().includes(needle) ||
      p.category.toLowerCase().includes(needle) ||
      p.seller.toLowerCase().includes(needle);
    return matchesCategory && matchesQuery;
  });
  if (activeSort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
  if (activeSort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (activeSort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

  function pushSearch(next: Partial<ProductsSearch>) {
    const merged = { q, category, sort, ...next };
    navigate({
      to: "/buyer/products",
      search: {
        ...(merged.q?.trim() ? { q: merged.q.trim() } : {}),
        ...(merged.category && merged.category !== "All" ? { category: merged.category } : {}),
        ...(merged.sort && merged.sort !== "popular" ? { sort: merged.sort } : {}),
      },
    });
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    pushSearch({ q: query });
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Explore" title="Handmade products" />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Sort
          <select
            value={activeSort}
            onChange={(e) => pushSearch({ sort: e.target.value })}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground outline-none"
          >
            <option value="popular">Most popular</option>
            <option value="rating">Highest rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      <form onSubmit={submitSearch} className="relative mb-6 max-w-xl">
        <label htmlFor="products-q" className="sr-only">
          Search products
        </label>
        <Search
          className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="products-q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products — e.g. pickle, cushion, saree"
          className="h-13 w-full rounded-full border border-border bg-card pl-13 pr-5 text-base shadow-soft outline-none placeholder:text-muted-foreground"
        />
      </form>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["All", ...categories.map((c) => c.name)].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => pushSearch({ category: c })}
            aria-pressed={active === c}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary hover:text-primary",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <StitchDivider className="mb-6" />

      <p className="mb-6 text-sm text-muted-foreground">
        {list.length} {list.length === 1 ? "product" : "products"}
      </p>

      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No matches yet"
          description={`Nothing found${q ? ` for "${q}"` : ""}${active !== "All" ? ` in ${active}` : ""}. Try a different search or category.`}
        />
      )}
    </div>
  );
}
