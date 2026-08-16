import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, IndianRupee, MessageSquareText, Package, Star, TrendingUp } from "lucide-react";

import { AiAdvisor } from "@/components/AiAdvisor";
import { SectionHeading } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { inr, products, services } from "@/lib/data";
import { useSession } from "@/lib/store";

export const Route = createFileRoute("/seller/")({
  head: () => ({
    meta: [
      { title: "Seller dashboard | SilverHands" },
      {
        name: "description",
        content: "Track earnings, orders, listings and ratings for your SilverHands shop.",
      },
      { property: "og:title", content: "Seller dashboard | SilverHands" },
      { property: "og:description", content: "Track earnings, orders and ratings in one place." },
    ],
  }),
  component: SellerDashboard,
});

const widgets = [
  { icon: IndianRupee, label: "Total earnings", value: inr(184500), sub: "+12% vs last month" },
  { icon: Package, label: "Orders received", value: "126", sub: "8 awaiting dispatch" },
  { icon: TrendingUp, label: "Active listings", value: "14", sub: "3 drafts pending" },
  { icon: Eye, label: "Profile views", value: "3,482", sub: "Last 30 days" },
  { icon: Star, label: "Customer rating", value: "4.9", sub: "From 214 reviews" },
];

function SellerDashboard() {
  const session = useSession();
  const firstName = session?.name?.split(" ")[0] ?? "there";
  return (
    <div className="space-y-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Good morning, {firstName}
          </p>
          <h1 className="mt-2 text-4xl lg:text-5xl">Your shop today</h1>
        </div>
        <Button asChild size="lg" variant="gold">
          <Link to="/seller/products">Add a new listing</Link>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {widgets.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="surface hover-lift p-7">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Icon className="size-6" aria-hidden />
            </span>
            <p className="mt-5 text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-accent">{sub}</p>
          </div>
        ))}

        <Link
          to="/seller/ai-advisor"
          className="surface hover-lift flex flex-col justify-between gap-4 bg-primary-soft p-7"
        >
          <div>
            <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <MessageSquareText className="size-6" aria-hidden />
            </span>
            <p className="mt-5 font-semibold">Ask your AI Advisor</p>
            <p className="text-muted-foreground">
              Get suggestions grounded in your shop's own numbers, or ask a specific question.
            </p>
          </div>
        </Link>
      </div>

      <AiAdvisor
        seller={session?.name ? { name: session.name } : {}}
        stats={{ revenue: 184500, orders: 126, views: 3482, topCategory: "Handmade Food" }}
      />

      <section>
        <SectionHeading
          eyebrow="Recent"
          title="Latest orders"
          action={
            <Button asChild variant="outline">
              <Link to="/seller/orders">All orders</Link>
            </Button>
          }
        />
        <div className="surface divide-y divide-border overflow-hidden">
          {products.map((p, i) => (
            <div key={p.id} className="flex flex-wrap items-center gap-4 px-6 py-5">
              <img src={p.image} alt="" loading="lazy" className="size-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-sm text-muted-foreground">Order #SH-10{i + 4} · 2 items</p>
              </div>
              <p className="font-semibold">{inr(p.price)}</p>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
                {i % 2 ? "Shipped" : "To dispatch"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Live" title="Your active services" />
        <div className="grid gap-5 md:grid-cols-2">
          {services.slice(0, 2).map((s) => (
            <div key={s.id} className="surface flex gap-4 p-6">
              <img src={s.image} alt="" loading="lazy" className="size-20 rounded-2xl object-cover" />
              <div className="min-w-0">
                <p className="font-semibold leading-snug">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {inr(s.price)} {s.unit} · {s.reviews} reviews
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
