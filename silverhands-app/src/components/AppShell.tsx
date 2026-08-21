import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Bell, Globe, Heart, LogOut, Menu, MessageCircle, Search, ShoppingBag, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { signOut, useMarketState, useSession } from "@/lib/store";
import { cn } from "@/lib/utils";
import { LANGUAGES, setLang, useLang, useT, type LangCode } from "@/lib/i18n";
import { CURRENCIES, setCurrency, useCurrency, type CurrencyCode } from "@/lib/currency";

export type NavItem = { labelKey: string; to: string };

export function AppShell({ nav, mode }: { nav: NavItem[]; mode: "Buyer" | "Seller" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const session = useSession();
  const navigate = useNavigate();
  const { favorites, cart } = useMarketState();
  const t = useT();
  const lang = useLang();
  const currency = useCurrency();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const to = mode === "Seller" ? "/seller/products" : "/buyer/services";
    navigate({ to, search: query.trim() ? { q: query.trim() } : {} });
  }

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="grid h-20 w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 xl:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <Link to="/" className="flex shrink-0 items-baseline gap-2">
              <span className="font-display text-xl font-semibold tracking-tight">SilverHands</span>
              <span className="hidden rounded-full bg-accent-soft px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-accent sm:inline">
                {mode}
              </span>
            </Link>

            <form onSubmit={submitSearch} className="relative hidden w-full max-w-xs md:block xl:hidden">
              <label htmlFor="shell-search" className="sr-only">
                {t("common.search")}
              </label>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                id="shell-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search SilverHands"
                className="h-10 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground"
              />
            </form>
          </div>

          <nav aria-label="Primary" className="hidden items-center justify-center gap-0 xl:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to.split("/").length <= 2 }}
                activeProps={{ className: "bg-primary-soft text-primary" }}
                className="whitespace-nowrap rounded-full px-2 py-2 text-[0.8125rem] font-medium transition-colors hover:bg-muted"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1.5">
            <div className="hidden items-center gap-1 sm:flex">
              <label className="sr-only" htmlFor="shell-lang">
                {t("language.label")}
              </label>
              <div className="relative">
                <Globe
                  className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <select
                  id="shell-lang"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as LangCode)}
                  className="h-9 rounded-full border border-border bg-card py-0 pl-8 pr-7 text-xs font-medium outline-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeLabel}
                    </option>
                  ))}
                </select>
              </div>

              {mode === "Buyer" && (
                <div className="relative">
                  <Wallet
                    className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <label className="sr-only" htmlFor="shell-currency">
                    {t("currency.label")}
                  </label>
                  <select
                    id="shell-currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="h-9 rounded-full border border-border bg-card py-0 pl-8 pr-7 text-xs font-medium outline-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {session && (
              <>
                {mode === "Buyer" && (
                  <Button asChild variant="ghost" size="icon" aria-label={`${t("nav.favorites")}${favorites.length ? ` (${favorites.length})` : ""}`} className="relative hidden sm:inline-flex">
                    <Link to="/buyer/favorites">
                      <Heart />
                      {favorites.length > 0 && (
                        <span
                          aria-hidden
                          className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-accent text-[0.6rem] font-bold text-accent-foreground"
                        >
                          {favorites.length > 9 ? "9+" : favorites.length}
                        </span>
                      )}
                    </Link>
                  </Button>
                )}
                {mode === "Buyer" && (
                  <Button asChild variant="ghost" size="icon" aria-label={`${t("nav.cart")}${cart.length ? ` (${cart.length})` : ""}`} className="relative hidden sm:inline-flex">
                    <Link to="/buyer/cart">
                      <ShoppingBag />
                      {cart.length > 0 && (
                        <span
                          aria-hidden
                          className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-accent text-[0.6rem] font-bold text-accent-foreground"
                        >
                          {cart.length > 9 ? "9+" : cart.length}
                        </span>
                      )}
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Notifications"
                  className="hidden sm:inline-flex"
                  onClick={() => toast("You're all caught up — no new notifications.")}
                >
                  <Bell />
                </Button>
                <Button asChild variant="ghost" size="icon" aria-label="Messages" className="hidden sm:inline-flex">
                  <Link to={mode === "Buyer" ? "/buyer/messages" : "/seller/messages"}>
                    <MessageCircle />
                  </Link>
                </Button>
              </>
            )}
            {session ? (
              <>
                <Button asChild variant="outline" size="sm" className="ml-1 hidden sm:inline-flex">
                  <Link to={mode === "Buyer" ? "/seller" : "/buyer"}>
                    {mode === "Buyer" ? t("nav.switchToSelling") : t("nav.switchToBuying")}
                  </Link>
                </Button>
                <Link
                  to={mode === "Buyer" ? "/buyer/profile" : "/seller/profile"}
                  aria-label={t("nav.profile")}
                  title={session.name}
                  className="ml-1 hidden size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground sm:inline-flex"
                >
                  {session.name.trim().charAt(0).toUpperCase() || "?"}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("nav.signOut")}
                  className="hidden sm:inline-flex"
                  onClick={() => {
                    signOut();
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut />
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link to="/login" search={{ role: mode === "Buyer" ? "buyer" : "seller" }}>
                  {t("nav.signIn")}
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <Menu />
            </Button>
          </div>
        </div>

        <nav
          aria-label="Mobile"
          className={cn(
            "overflow-hidden border-t border-border transition-all duration-300 xl:hidden",
            open ? "max-h-[36rem]" : "max-h-0",
          )}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-3">
            <form onSubmit={submitSearch} className="relative mb-2 md:hidden">
              <label htmlFor="shell-search-mobile" className="sr-only">
                {t("common.search")}
              </label>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                id="shell-search-mobile"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search SilverHands"
                className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground"
              />
            </form>

            <div className="mb-2 flex items-center gap-2 sm:hidden">
              <select
                aria-label={t("language.label")}
                value={lang}
                onChange={(e) => setLang(e.target.value as LangCode)}
                className="h-10 flex-1 rounded-full border border-border bg-card px-3 text-sm outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeLabel}
                  </option>
                ))}
              </select>
              {mode === "Buyer" && (
                <select
                  aria-label={t("currency.label")}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="h-10 flex-1 rounded-full border border-border bg-card px-3 text-sm outline-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to.split("/").length <= 2 }}
                activeProps={{ className: "bg-primary-soft text-primary" }}
                className="rounded-xl px-4 py-3.5 font-medium"
              >
                {t(item.labelKey)}
              </Link>
            ))}
            {session && (
              <Link
                to={mode === "Buyer" ? "/buyer/profile" : "/seller/profile"}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-primary-soft text-primary" }}
                className="rounded-xl px-4 py-3.5 font-medium"
              >
                {t("nav.profile")}
              </Link>
            )}
            {!session && (
              <Link
                to="/login"
                search={{ role: mode === "Buyer" ? "buyer" : "seller" }}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3.5 font-semibold text-primary"
              >
                {t("nav.signIn")}
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14">
        <Outlet />
      </main>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        SilverHands — turning a lifetime of skill into livelihood.
      </footer>

      <AIAssistant />
    </div>
  );
}
