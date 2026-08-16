import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { inr, services } from "@/lib/data";

export const Route = createFileRoute("/seller/services")({
  head: () => ({
    meta: [
      { title: "My services | SilverHands" },
      {
        name: "description",
        content: "Create and manage the services you offer, with AI pricing suggestions.",
      },
      { property: "og:title", content: "My services | SilverHands" },
      { property: "og:description", content: "Create and manage the services you offer." },
    ],
  }),
  component: SellerServices,
});

function SellerServices() {
  return (
    <div className="space-y-14">
      <SectionHeading eyebrow="Offerings" title="My services" />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 3).map((s) => (
          <div key={s.id} className="surface hover-lift overflow-hidden">
            <img src={s.image} alt={s.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <div className="space-y-1 p-5">
              <p className="font-semibold leading-snug">{s.title}</p>
              <p className="text-muted-foreground">
                {inr(s.price)} {s.unit}
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="surface p-8 lg:p-10">
        <h2 className="text-3xl">Create a service</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Service published");
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="stitle">Service title</Label>
            <Input id="stitle" placeholder="Bespoke blouse stitching" className="h-12 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sdesc">Description</Label>
            <Textarea id="sdesc" rows={5} placeholder="What's included, and how you work…" className="rounded-xl" />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => toast("Hansa AI polished your service description")}
            >
              <Sparkles /> Improve with AI
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sprice">Price (₹)</Label>
              <Input id="sprice" type="number" placeholder="450" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="savail">Availability</Label>
              <Input id="savail" placeholder="Mon–Fri, 10am–5pm" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sdel">Delivery time</Label>
              <Input id="sdel" placeholder="4–6 days" className="h-12 rounded-xl" />
            </div>
          </div>

          <div className="grid place-items-center gap-3 rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center">
            <ImagePlus className="size-8 text-primary" aria-hidden />
            <p className="font-medium">Add portfolio images</p>
            <Button type="button" variant="outline">
              Choose images
            </Button>
          </div>

          <Button type="submit" size="lg" variant="gold">
            Publish service
          </Button>
        </form>
      </section>
    </div>
  );
}
