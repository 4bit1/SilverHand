import { createFileRoute, redirect } from "@tanstack/react-router";

import { AppShell, type NavItem } from "@/components/AppShell";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/seller" },
  { label: "My Products", to: "/seller/products" },
  { label: "My Services", to: "/seller/services" },
  { label: "Orders", to: "/seller/orders" },
  { label: "Analytics", to: "/seller/analytics" },
  { label: "AI Advisor", to: "/seller/ai-advisor" },
  { label: "Teach & Share", to: "/seller/teach-and-share" },
  { label: "Profile", to: "/seller/profile" },
];

export const Route = createFileRoute("/seller")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("silverhands.session");
    if (!raw) throw redirect({ to: "/login", search: { role: "seller" } });

    let session: { onboarded?: boolean } | null = null;
    try {
      session = JSON.parse(raw) as { onboarded?: boolean };
    } catch {
      session = null;
    }
    if (!session) throw redirect({ to: "/login", search: { role: "seller" } });

    const onOnboardingPage = location.pathname === "/seller/onboarding";
    const onInterviewRedirect = location.pathname === "/seller/interview";
    if (!session.onboarded && !onOnboardingPage && !onInterviewRedirect) {
      throw redirect({ to: "/seller/onboarding" });
    }
  },
  component: () => <AppShell nav={nav} mode="Seller" />,
});
