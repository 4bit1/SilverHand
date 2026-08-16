import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories, inr, products } from "@/lib/data";

export const Route = createFileRoute("/seller/products")({
  head: () => ({
    meta: [
      { title: "My products | SilverHands" },
      {
        name: "description",
        content: "List handmade products with AI-written descriptions and suggested pricing.",
      },
      { property: "og:title", content: "My products | SilverHands" },
      { property: "og:description", content: "List handmade products with AI assistance." },
    ],
  }),
  component: SellerProducts,
});

function SellerProducts() {
  return (
    <div className="space-y-14">
      <SectionHeading eyebrow="Catalogue" title="My products" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="surface hover-lift overflow-hidden">
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <div className="space-y-1 p-5">
              <p className="font-semibold leading-snug">{p.name}</p>
              <p className="text-muted-foreground">
                {inr(p.price)} · {p.stock} in stock
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="surface p-8 lg:p-10">
        <h2 className="text-3xl">Add a product</h2>
        <p className="mt-2 text-muted-foreground">
          Fill what you can — Hansa AI will help with the rest.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Product saved as draft");
          }}
          className="mt-8 space-y-6"
        >
          <div className="grid place-items-center gap-3 rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center">
            <ImagePlus className="size-8 text-primary" aria-hidden />
            <p className="font-medium">Upload up to 8 photos</p>
            <p className="text-sm text-muted-foreground">Daylight, plain background works best</p>
            <Button type="button" variant="outline">
              Choose images
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ptitle">Product title</Label>
              <Input id="ptitle" placeholder="Handwoven cotton throw" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pcat">Category</Label>
              <select
                id="pcat"
                className="h-12 w-full rounded-xl border border-input bg-card px-4"
                defaultValue={categories[0]?.name}
              >
                {categories.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pprice">Price (₹)</Label>
              <Input id="pprice" type="number" placeholder="2400" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pstock">Stock</Label>
              <Input id="pstock" type="number" placeholder="6" className="h-12 rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdesc">Description</Label>
            <Textarea id="pdesc" rows={5} placeholder="Tell buyers how it's made…" className="rounded-xl" />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => toast("Hansa AI drafted a description for you")}
            >
              <Sparkles /> Generate with AI
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdelivery">Delivery options</Label>
            <Input id="pdelivery" placeholder="Ships in 3 days · Free above ₹1,500" className="h-12 rounded-xl" />
          </div>

          <Button type="submit" size="lg" variant="gold">
            Publish product
          </Button>
        </form>
      </section>
    </div>
  );
}
