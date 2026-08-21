import { createFileRoute } from "@tanstack/react-router";

import { AppShell, type NavItem } from "@/components/AppShell";

const nav: NavItem[] = [
  { labelKey: "nav.home", to: "/buyer" },
  { labelKey: "nav.exploreServices", to: "/buyer/services" },
  { labelKey: "nav.exploreProducts", to: "/buyer/products" },
  { labelKey: "nav.theirExpertise", to: "/buyer/their-expertise" },
];

export const Route = createFileRoute("/buyer")({
  // Browsing is open, like Etsy — no login wall here. Actions that need an
  // identity (favoriting, adding to cart, booking, messaging) prompt sign-in
  // at the point of action instead (see requireSession() in lib/store.ts).
  component: () => <AppShell nav={nav} mode="Buyer" />,
});
