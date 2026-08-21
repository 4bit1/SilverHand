// Buyer-facing currency display preference. Every price in the app's data
// is authored in INR (that's what sellers actually get paid in — this
// never changes); this only controls how prices are *displayed* to a
// buyer who's browsing in a different currency. Rates are static/mock,
// not live FX — same "real interaction, mocked infrastructure" rule as
// the rest of the app. Persisted the same way session/cart/language are.

import { useSyncExternalStore } from "react";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string; perInr: number }[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee", perInr: 1 },
  // Approximate, static conversion rates — not live. Good enough to
  // demonstrate the feature; would need a real FX source for production.
  { code: "USD", symbol: "$", label: "US Dollar", perInr: 1 / 83 },
  { code: "EUR", symbol: "€", label: "Euro", perInr: 1 / 90 },
  { code: "GBP", symbol: "£", label: "British Pound", perInr: 1 / 105 },
];

const CURRENCY_KEY = "silverhands.currency";

function loadCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "INR";
  try {
    const raw = window.localStorage.getItem(CURRENCY_KEY);
    return raw === "USD" || raw === "EUR" || raw === "GBP" ? raw : "INR";
  } catch {
    return "INR";
  }
}

let currency: CurrencyCode = loadCurrency();
const listeners = new Set<() => void>();

export function setCurrency(next: CurrencyCode) {
  currency = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CURRENCY_KEY, next);
    } catch {
      // ignore
    }
  }
  listeners.forEach((l) => l());
}

export function useCurrency(): CurrencyCode {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => currency,
    () => "INR",
  );
}

/** Formats an INR amount in the given currency. Non-INR currencies show a
 * "~" prefix — this is a converted estimate, not what actually settles. */
export function formatPrice(amountInInr: number, code: CurrencyCode): string {
  const meta = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]!;
  const converted = amountInInr * meta.perInr;
  const decimals = code === "INR" ? 0 : 2;
  const formatted = converted.toLocaleString(code === "INR" ? "en-IN" : "en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return code === "INR" ? `${meta.symbol}${formatted}` : `~${meta.symbol}${formatted}`;
}

/** Convenience hook: returns a bound formatter using the current currency,
 * so components don't need to call useCurrency() + formatPrice() separately. */
export function useFormatPrice() {
  const code = useCurrency();
  return (amountInInr: number) => formatPrice(amountInInr, code);
}
