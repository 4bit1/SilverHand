import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, TrendingUp, Eye, MousePointerClick, Wallet, Info } from "lucide-react";
import { toast } from "sonner";

import { SectionHeading, EmptyState } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { inr, products, services, type Product, type Service } from "@/lib/data";
import {
  campaignMetrics,
  promote,
  unpromote,
  usePromotions,
  usePromotedIds,
  PRODUCT_AD_COST,
  SERVICE_AD_COST,
  type ListingKind,
  type Promotion,
} from "@/lib/ads";

export const Route = createFileRoute("/seller/advertising")({
  head: () => ({
    meta: [
      { title: "Advertising | SilverHands" },
      {
        name: "description",
        content: "Manage sponsored placements for your products and services.",
      },
    ],
  }),
  component: SellerAdvertising,
});

type Listing = { id: string; kind: ListingKind; title: string; image: string; rating: number; reviews: number };

function findListing(id: string, kind: ListingKind): Listing | undefined {
  if (kind === "product") {
    const p = products.find((x) => x.id === id);
    return p && { id: p.id, kind, title: p.name, image: p.image, rating: p.rating, reviews: p.reviews };
  }
  const s = services.find((x) => x.id === id);
  return s && { id: s.id, kind, title: s.title, image: s.image, rating: s.rating, reviews: s.reviews };
}

function SellerAdvertising() {
  const promotions = usePromotions();
  const promotedIds = usePromotedIds();

  const rows = promotions
    .map((promo) => {
      const listing = findListing(promo.id, promo.kind);
      if (!listing) return null;
      return { promo, listing, metrics: campaignMetrics(promo, listing.rating, listing.reviews) };
    })
    .filter((r): r is { promo: Promotion; listing: Listing; metrics: ReturnType<typeof campaignMetrics> } => r !== null)
    .sort((a, b) => b.promo.startedAt - a.promo.startedAt);

  const summary = useMemo(
    () => ({
      activeCampaigns: rows.length,
      weeklySpend: rows.reduce((sum, r) => sum + r.promo.costPerWeek, 0),
      impressionsThisWeek: rows.reduce((sum, r) => sum + r.metrics.impressionsThisWeek, 0),
    }),
    [rows],
  );

  const promotableListings: Listing[] = [
    ...products
      .filter((p) => !promotedIds.has(p.id))
      .map((p) => ({ id: p.id, kind: "product" as const, title: p.name, image: p.image, rating: p.rating, reviews: p.reviews })),
    ...services
      .filter((s) => !promotedIds.has(s.id))
      .map((s) => ({ id: s.id, kind: "service" as const, title: s.title, image: s.image, rating: s.rating, reviews: s.reviews })),
  ];

  return (
    <div className="space-y-14">
      <SectionHeading eyebrow="Advertising" title="Manage your campaigns" />

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="surface flex items-center gap-4 p-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-2xl font-semibold">{summary.activeCampaigns}</p>
            <p className="text-sm text-muted-foreground">Active campaigns</p>
          </div>
        </div>
        <div className="surface flex items-center gap-4 p-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
            <Wallet className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-2xl font-semibold">{inr(summary.weeklySpend)}</p>
            <p className="text-sm text-muted-foreground">Total weekly spend</p>
          </div>
        </div>
        <div className="surface flex items-center gap-4 p-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
            <Eye className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-2xl font-semibold">{summary.impressionsThisWeek.toLocaleString("en-IN")}</p>
            <p className="text-sm text-muted-foreground">Impressions this week</p>
          </div>
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-2xl bg-primary-soft/60 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        Impressions, clicks and CTR here are illustrative figures for this demo — there's no real
        ad-serving telemetry behind them. Sponsored placements never affect Fair Discovery's
        organic ranking; they only add a separate, clearly-labeled slot.
      </p>

      <section>
        <h2 className="text-2xl font-semibold">Current campaigns</h2>
        {rows.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              icon={Sparkles}
              title="No campaigns running"
              description="Launch one below to get your listing into the Sponsored placement."
            />
          </div>
        ) : (
          <ul className="mt-5 space-y-4">
            {rows.map(({ promo, listing, metrics }) => (
              <li key={promo.id} className="surface flex flex-wrap items-center gap-5 p-5">
                <img
                  src={listing.image}
                  alt=""
                  className="size-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{listing.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {listing.kind === "product" ? "Product" : "Service"} · Day {metrics.daysRunning}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="size-4 text-muted-foreground" aria-hidden />
                    {metrics.impressionsThisWeek.toLocaleString("en-IN")} this week
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MousePointerClick className="size-4 text-muted-foreground" aria-hidden />
                    {metrics.clicksThisWeek.toLocaleString("en-IN")} clicks
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <TrendingUp className="size-4 text-muted-foreground" aria-hidden />
                    {(metrics.ctr * 100).toFixed(1)}% CTR
                  </span>
                  <span className="font-semibold">{inr(promo.costPerWeek)}/week</span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    unpromote(promo.id);
                    toast("Campaign stopped", { description: listing.title });
                  }}
                >
                  Stop campaign
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <NewCampaign listings={promotableListings} />
    </div>
  );
}

function NewCampaign({ listings }: { listings: Listing[] }) {
  const [selectedKey, setSelectedKey] = useState(listings[0] ? `${listings[0].kind}:${listings[0].id}` : "");
  const [weeks, setWeeks] = useState(1);

  const selected = listings.find((l) => `${l.kind}:${l.id}` === selectedKey);
  const costPerWeek = selected?.kind === "product" ? PRODUCT_AD_COST : SERVICE_AD_COST;
  const totalCost = costPerWeek * weeks;

  return (
    <section className="surface p-8 lg:p-10">
      <h2 className="text-2xl font-semibold">Launch a new campaign</h2>
      <p className="mt-2 text-muted-foreground">
        Pick one of your listings and how long you'd like it sponsored.
      </p>

      {listings.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          Every listing you have is already sponsored — stop one above to launch a new campaign.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!selected) return;
            promote(selected.id, selected.kind, costPerWeek);
            toast.success("Campaign launched!", {
              description: `${selected.title} will now appear in Sponsored placements — ${inr(costPerWeek)}/week.`,
            });
            setWeeks(1);
          }}
          className="mt-8 grid gap-6 sm:grid-cols-2"
        >
          <div className="space-y-2">
            <label htmlFor="ad-listing" className="text-sm font-medium">
              Listing
            </label>
            <select
              id="ad-listing"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-card px-4"
            >
              {listings.map((l) => (
                <option key={`${l.kind}:${l.id}`} value={`${l.kind}:${l.id}`}>
                  {l.title} ({l.kind === "product" ? "Product" : "Service"})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="ad-weeks" className="text-sm font-medium">
              Duration
            </label>
            <select
              id="ad-weeks"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="h-12 w-full rounded-xl border border-input bg-card px-4"
            >
              <option value={1}>1 week</option>
              <option value={2}>2 weeks</option>
              <option value={4}>4 weeks</option>
            </select>
          </div>

          <div className="surface flex items-center justify-between p-5 sm:col-span-2">
            <div>
              <p className="text-sm text-muted-foreground">
                {inr(costPerWeek)}/week × {weeks} {weeks === 1 ? "week" : "weeks"}
              </p>
              <p className="text-2xl font-semibold">{inr(totalCost)}</p>
            </div>
            <Button type="submit" variant="gold" disabled={!selected}>
              <Sparkles /> Confirm campaign
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
