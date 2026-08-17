import { createFileRoute } from "@tanstack/react-router";

import { AppShell, type NavItem } from "@/components/AppShell";

const nav: NavItem[] = [
  { label: "Home", to: "/buyer" },
  { label: "Explore Services", to: "/buyer/services" },
  { label: "Explore Products", to: "/buyer/products" },
  { label: "Their Expertise", to: "/buyer/their-expertise" },
  { label: "Profile", to: "/buyer/profile" },
];

export const Route = createFileRoute("/buyer")({
  // Browsing is open, like Etsy — no login wall here. Actions that need an
  // identity (favoriting, adding to cart, booking, messaging) prompt sign-in
  // at the point of action instead (see requireSession() in lib/store.ts).
  component: () => <AppShell nav={nav} mode="Buyer" />,
});
