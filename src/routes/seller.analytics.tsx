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

import { SectionHeading } from "@/components/Cards";

export const Route = createFileRoute("/seller/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics | SilverHands" },
      { name: "description", content: "See how earnings, views and orders trend month to month." },
      { property: "og:title", content: "Analytics | SilverHands" },
      { property: "og:description", content: "Earnings, views and order trends for your shop." },
    ],
  }),
  component: Analytics,
});

const earnings = [
  { month: "Mar", value: 18400 },
  { month: "Apr", value: 21600 },
  { month: "May", value: 19800 },
  { month: "Jun", value: 26400 },
  { month: "Jul", value: 31200 },
  { month: "Aug", value: 35800 },
];

const views = [
  { month: "Mar", value: 410 },
  { month: "Apr", value: 520 },
  { month: "May", value: 470 },
  { month: "Jun", value: 690 },
  { month: "Jul", value: 780 },
  { month: "Aug", value: 912 },
];

function Analytics() {
  return (
    <div className="space-y-10">
      <SectionHeading eyebrow="Insights" title="Analytics" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-7">
          <h2 className="text-2xl">Earnings</h2>
          <p className="text-muted-foreground">Last six months</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} width={56} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "1rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
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
          <p className="text-muted-foreground">Last six months</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={views}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} width={48} />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "1rem",
                  }}
                />
                <Bar dataKey="value" fill="var(--color-accent)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
