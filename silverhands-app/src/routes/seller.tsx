import { createFileRoute, redirect } from "@tanstack/react-router";

import { AppShell, type NavItem } from "@/components/AppShell";

const nav: NavItem[] = [
  { labelKey: "nav.dashboard", to: "/seller" },
  { labelKey: "nav.myProducts", to: "/seller/products" },
  { labelKey: "nav.myServices", to: "/seller/services" },
  { labelKey: "nav.advertising", to: "/seller/advertising" },
  { labelKey: "nav.orders", to: "/seller/orders" },
  { labelKey: "nav.analytics", to: "/seller/analytics" },
  { labelKey: "nav.aiAdvisor", to: "/seller/ai-advisor" },
  { labelKey: "nav.teachAndShare", to: "/seller/teach-and-share" },
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
