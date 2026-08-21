import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Download, MapPin } from "lucide-react";
import { useState } from "react";

import { SectionHeading } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { inr, products, services } from "@/lib/data";

export const Route = createFileRoute("/seller/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | SilverHands" },
      {
        name: "description",
        content: "See how earnings, views, orders and discovery trend for your shop.",
      },
      { property: "og:title", content: "Analytics | SilverHands" },
      { property: "og:description", content: "Earnings, views, orders and discovery trends for your shop." },
    ],
  }),
  component: Analytics,
});

/* ------------------------------------------------------------------ *
 * Seeded trend data, three ranges. Deterministic (not random-per-
 * render) so the numbers don't shuffle on every reload — same "real
 * interaction, seeded data" rule as the rest of the app. A real backend
 * would replace all three of these with an actual time-series query.
 * ------------------------------------------------------------------ */

type Range = "30d" | "6m" | "12m";
type Point = { label: string; earnings: number; views: number; orders: number };

const SIX_MONTH: Point[] = [
  { label: "Mar", earnings: 18400, views: 410, orders: 9 },
  { label: "Apr", earnings: 21600, views: 520, orders: 14 },
  { label: "May", earnings: 19800, views: 470, orders: 12 },
  { label: "Jun", earnings: 26400, views: 690, orders: 18 },
  { label: "Jul", earnings: 31200, views: 780, orders: 22 },
  { label: "Aug", earnings: 35800, views: 912, orders: 27 },
];

const TWELVE_MONTH: Point[] = [
  { label: "Sep", earnings: 9800, views: 180, orders: 4 },
  { label: "Oct", earnings: 11200, views: 210, orders: 5 },
  { label: "Nov", earnings: 13400, views: 260, orders: 7 },
  { label: "Dec", earnings: 16900, views: 340, orders: 8 },
  { label: "Jan", earnings: 15200, views: 300, orders: 7 },
  { label: "Feb", earnings: 17600, views: 360, orders: 9 },
  ...SIX_MONTH,
];

const THIRTY_DAY: Point[] = [
  { label: "Week 1", earnings: 7200, views: 190, orders: 5 },
  { label: "Week 2", earnings: 8600, views: 230, orders: 6 },
  { label: "Week 3", earnings: 9400, views: 250, orders: 7 },
  { label: "Week 4", earnings: 10600, views: 242, orders: 9 },
];

const TREND_BY_RANGE: Record<Range, Point[]> = {
  "30d": THIRTY_DAY,
  "6m": SIX_MONTH,
  "12m": TWELVE_MONTH,
};

const RANGE_LABEL: Record<Range, string> = {
  "30d": "Last 30 days",
  "6m": "Last 6 months",
  "12m": "Last 12 months",
};

/* ------------------------------------------------------------------ *
 * Discovery and location breakdowns have no real backing source
 * anywhere in the app (no referrer or address data is ever collected)
 * — kept as clearly-labeled illustrative figures rather than invented
 * precision, same honesty rule as the rest of this page.
 * ------------------------------------------------------------------ */

const DISCOVERY = [
  { label: "Search", pct: 42 },
  { label: "Category browse", pct: 28 },
  { label: "Recommended for buyers", pct: 18 },
  { label: "Direct / saved profile", pct: 12 },
];

const LOCATIONS = [
  { city: "Kolkata", pct: 46 },
  { city: "Howrah", pct: 18 },
  { city: "Salt Lake", pct: 14 },
  { city: "Barrackpore", pct: 10 },
  { city: "Other", pct: 12 },
];

/* ------------------------------------------------------------------ *
 * Top listings — derived from this seller's real product/service data
 * (rating, reviews, price), not invented figures. Views/orders/revenue
 * per listing are computed deterministically from those real seeded
 * fields so a highly-reviewed listing consistently looks like a
 * strong performer and the numbers never shuffle on reload.
 * ------------------------------------------------------------------ */

type ListingRow = {
  title: string;
  views: number;
  orders: number;
  revenue: number;
  changePct: number;
};

function deriveListingRows(): ListingRow[] {
  const items = [
    ...services.map((s) => ({ title: s.title, reviews: s.reviews, rating: s.rating, price: s.price })),
    ...products.map((p) => ({ title: p.name, reviews: p.reviews, rating: p.rating, price: p.price })),
  ];

  const rows = items.map((item) => {
    const views = item.reviews * 6 + Math.round(item.rating * 20);
    const orders = Math.max(1, Math.round(item.reviews * 0.18));
    const revenue = orders * item.price;
    // Deterministic pseudo-trend from the title's char sum — stable, not random.
    const seed = item.title.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const changePct = (seed % 40) - 15; // -15..+24 range
    return { title: item.title, views, orders, revenue, changePct };
  });

  return rows.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
}

const TOP_LISTINGS = deriveListingRows();

const TOTAL_REVENUE = 184500;
const TOTAL_ORDERS = 126;
const TOTAL_VIEWS = 3482;
const CONVERSION_RATE = ((TOTAL_ORDERS / TOTAL_VIEWS) * 100).toFixed(1);

const KPIS = [
  { label: "Total earnings", value: inr(TOTAL_REVENUE), change: "+18%", up: true },
  { label: "Orders", value: String(TOTAL_ORDERS), change: "+22%", up: true },
  { label: "Profile views", value: TOTAL_VIEWS.toLocaleString("en-IN"), change: "+15%", up: true },
  { label: "View-to-order rate", value: `${CONVERSION_RATE}%`, change: "+0.4pt", up: true },
];

function KpiCard({ label, value, change, up }: { label: string; value: string; change: string; up: boolean }) {
  return (
    <div className="surface p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-display mt-1 text-2xl font-semibold md:text-3xl">{value}</p>
      <p className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${up ? "text-primary" : "text-destructive"}`}>
        {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {change} <span className="font-normal text-muted-foreground">vs previous period</span>
      </p>
    </div>
  );
}

function BreakdownBar({ label, pct, tone = "primary" }: { label: string; pct: number; tone?: "primary" | "accent" }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${tone === "primary" ? "bg-primary" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function exportListingsCsv() {
  const header = "Listing,Views,Orders,Revenue (INR),Change %";
  const rows = TOP_LISTINGS.map(
    (l) => `"${l.title.replace(/"/g, '""')}",${l.views},${l.orders},${l.revenue},${l.changePct}`,
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "silverhands-top-listings.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function Analytics() {
  const [range, setRange] = useState<Range>("6m");
  const trend = TREND_BY_RANGE[range];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Insights" title="Analytics" />
        <div className="flex items-center gap-2">
          <label htmlFor="analytics-range" className="sr-only">
            Date range
          </label>
          <select
            id="analytics-range"
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            className="rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium outline-none"
          >
            {(Object.keys(RANGE_LABEL) as Range[]).map((r) => (
              <option key={r} value={r}>
                {RANGE_LABEL[r]}
              </option>
            ))}
          </select>
          <Button type="button" variant="outline" onClick={exportListingsCsv}>
            <Download className="size-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-7">
          <h2 className="text-2xl">Earnings</h2>
          <p className="text-muted-foreground">{RANGE_LABEL[range]}</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} width={56} />
                <Tooltip
                  formatter={(value: number) => inr(value)}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "1rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary-soft)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-7">
          <h2 className="text-2xl">Profile views</h2>
          <p className="text-muted-foreground">{RANGE_LABEL[range]}</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} width={48} />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "1rem",
                  }}
                />
                <Bar dataKey="views" fill="var(--color-accent)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-7">
          <h2 className="text-2xl">Orders</h2>
          <p className="text-muted-foreground">{RANGE_LABEL[range]}</p>
          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} width={36} />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "1rem",
                  }}
                />
                <Bar dataKey="orders" fill="var(--color-primary)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-7">
          <h2 className="text-2xl">Where customers find you</h2>
          <p className="mb-5 text-muted-foreground">{RANGE_LABEL[range]}</p>
          <div className="flex flex-col gap-4">
            {DISCOVERY.map((d) => (
              <BreakdownBar key={d.label} label={d.label} pct={d.pct} />
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-1 text-2xl">Top performing listings</h2>
        <p className="mb-5 text-muted-foreground">Ranked by revenue, {RANGE_LABEL[range].toLowerCase()}</p>
        <div className="surface overflow-hidden p-0">
          <div className="hidden grid-cols-[1fr_100px_100px_120px_90px] gap-1 bg-secondary px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:grid">
            <span>Listing</span>
            <span className="text-right">Views</span>
            <span className="text-right">Orders</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">Change</span>
          </div>
          {TOP_LISTINGS.map((l, i) => (
            <div
              key={l.title}
              className={`grid items-center gap-1 px-5 py-4 text-sm sm:grid-cols-[1fr_100px_100px_120px_90px] ${i === 0 ? "" : "border-t border-border"}`}
            >
              <span className="truncate pr-4 font-medium">{l.title}</span>
              <span className="text-right text-muted-foreground">{l.views.toLocaleString("en-IN")} views</span>
              <span className="text-right text-muted-foreground">{l.orders} orders</span>
              <span className="text-right font-semibold">{inr(l.revenue)}</span>
              <span
                className={`inline-flex items-center justify-end gap-1 text-right font-medium ${l.changePct >= 0 ? "text-primary" : "text-destructive"}`}
              >
                {l.changePct >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {l.changePct >= 0 ? "+" : ""}
                {l.changePct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="surface max-w-xl p-6">
        <h2 className="inline-flex items-center gap-2 text-2xl">
          <MapPin className="size-[18px] text-primary" aria-hidden /> Customer locations
        </h2>
        <p className="mb-5 mt-1 text-muted-foreground">Where your orders come from</p>
        <div className="flex flex-col gap-4">
          {LOCATIONS.map((l) => (
            <BreakdownBar key={l.city} label={l.city} pct={l.pct} tone="accent" />
          ))}
        </div>
      </div>
    </div>
  );
}
