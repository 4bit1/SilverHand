import { createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/buyer/profile")({
  head: () => ({
    meta: [
      { title: "Your profile | SilverHands" },
      { name: "description", content: "Manage your delivery details, preferences and orders." },
      { property: "og:title", content: "Your profile | SilverHands" },
      { property: "og:description", content: "Manage your SilverHands account details." },
    ],
  }),
  component: BuyerProfile,
});

const fields = [
  { id: "name", label: "Full name", value: "Priya Menon" },
  { id: "email", label: "Email", value: "priya@example.com" },
  { id: "phone", label: "Phone", value: "+91 98765 43210" },
  { id: "city", label: "City", value: "Bengaluru" },
];

function BuyerProfile() {
  return (
    <div className="max-w-3xl">
      <SectionHeading eyebrow="Account" title="Your profile" />
      <form onSubmit={(e) => e.preventDefault()} className="surface space-y-6 p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.id} className="space-y-2">
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input id={f.id} defaultValue={f.value} className="h-12 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Delivery address</Label>
          <Input id="address" defaultValue="14, Lakeview Residency, Indiranagar" className="h-12 rounded-xl" />
        </div>
        <Button size="lg" type="submit">
          Save changes
        </Button>
      </form>
    </div>
  );
}
