import { createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/Cards";
import { inr } from "@/lib/data";

export const Route = createFileRoute("/seller/orders")({
  head: () => ({
    meta: [
      { title: "Orders | SilverHands" },
      { name: "description", content: "Track every order, its status and payout at a glance." },
      { property: "og:title", content: "Orders | SilverHands" },
      { property: "og:description", content: "Track every order and payout at a glance." },
    ],
  }),
  component: Orders,
});

const orders = [
  { id: "SH-1042", buyer: "Priya Menon", item: "Handwoven cotton throw", amount: 2400, status: "To dispatch" },
  { id: "SH-1041", buyer: "Arjun Thomas", item: "Mango & jaggery preserve × 2", amount: 840, status: "Shipped" },
  { id: "SH-1039", buyer: "Nisha Rao", item: "Bengali thali, weekly plan", amount: 1260, status: "Completed" },
  { id: "SH-1036", buyer: "Kabir Shah", item: "Kantha cushion cover", amount: 1150, status: "Completed" },
];

function Orders() {
  return (
    <div>
      <SectionHeading eyebrow="Fulfilment" title="Orders" />
      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[42rem] text-left">
          <thead className="border-b border-border text-sm text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">Order</th>
              <th scope="col" className="px-6 py-4 font-medium">Buyer</th>
              <th scope="col" className="px-6 py-4 font-medium">Item</th>
              <th scope="col" className="px-6 py-4 font-medium">Amount</th>
              <th scope="col" className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-6 py-5 font-semibold">{o.id}</td>
                <td className="px-6 py-5">{o.buyer}</td>
                <td className="px-6 py-5 text-muted-foreground">{o.item}</td>
                <td className="px-6 py-5 font-semibold">{inr(o.amount)}</td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
