// Sponsored listings — a seller can pay (mocked) to promote a listing.
//
// IMPORTANT design constraint, matching how this was scoped: promotion is
// a separate, clearly-labeled "Sponsored" placement, additive to search
// results. It never touches Fair Discovery's organic ranking (see
// lib/ranking.ts) — a promoted listing gets extra visibility in its own
// slot, not a boosted position in the fair-ranked list underneath. That's
// what keeps this feature honest: paying for an ad buys attention, not a
// rigged ranking.
//
// Seeded with a couple of promotions already on, the same "never show an
// empty state in the demo" rule the rest of the app follows — and the
// seller-side toggle genuinely adds/removes from this same list, so it's
// not just a static seed.

import { useSyncExternalStore } from "react";

export type ListingKind = "service" | "product";

export interface Promotion {
  id: string; // service or product id
  kind: ListingKind;
  costPerWeek: number; // INR, mocked
  startedAt: number; // epoch ms
}

// Shared so the per-card "Promote" button (seller.products.tsx /
// seller.services.tsx) and the fuller Advertising dashboard
// (seller.advertising.tsx) always quote the same price for the same kind of
// listing — one source of truth instead of two hardcoded numbers.
export const PRODUCT_AD_COST = 99; // INR per week, mocked
export const SERVICE_AD_COST = 149; // INR per week, mocked

const ADS_KEY = "silverhands.promotions";

const SEED_PROMOTIONS: Promotion[] = [
  { id: "s7", kind: "service", costPerWeek: 149, startedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },
  { id: "p2", kind: "product", costPerWeek: 99, startedAt: Date.now() - 1 * 24 * 60 * 60 * 1000 },
];

function loadPromotions(): Promotion[] {
  if (typeof window === "undefined") return SEED_PROMOTIONS;
  try {
    const raw = window.localStorage.getItem(ADS_KEY);
    if (!raw) return SEED_PROMOTIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_PROMOTIONS;
  } catch {
    return SEED_PROMOTIONS;
  }
}

let promotions: Promotion[] = loadPromotions();
const listeners = new Set<() => void>();

function emit() {
  promotions = [...promotions];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ADS_KEY, JSON.stringify(promotions));
    } catch {
      // ignore
    }
  }
  listeners.forEach((l) => l());
}

export function promote(id: string, kind: ListingKind, costPerWeek: number) {
  if (promotions.some((p) => p.id === id)) return;
  promotions = [...promotions, { id, kind, costPerWeek, startedAt: Date.now() }];
  emit();
}

export function unpromote(id: string) {
  promotions = promotions.filter((p) => p.id !== id);
  emit();
}

export function isPromoted(id: string): boolean {
  return promotions.some((p) => p.id === id);
}

export function usePromotions(): Promotion[] {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => promotions,
    () => SEED_PROMOTIONS,
  );
}

export function usePromotedIds(): Set<string> {
  const list = usePromotions();
  return new Set(list.map((p) => p.id));
}

/* ------------------------------------------------------------------ *
 * Campaign metrics for the Advertising dashboard (seller.advertising.tsx).
 * Deterministic and seeded from the campaign itself (id + startedAt) plus
 * the listing's own rating/reviews as a plausibility signal — a
 * better-received listing plausibly draws a bit more traffic. Reloading
 * the page (or coming back tomorrow) gives the same numbers for the same
 * campaign, same days-running, same day. There is no real ad-serving
 * telemetry behind this — see the disclaimer on that page.
 * ------------------------------------------------------------------ */

export interface CampaignMetrics {
  daysRunning: number;
  impressions: number; // all-time, for this campaign
  impressionsThisWeek: number;
  clicksThisWeek: number;
  ctr: number; // 0..1, e.g. 0.032 = 3.2%
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function campaignMetrics(promo: Promotion, rating: number, reviews: number): CampaignMetrics {
  const dayMs = 24 * 60 * 60 * 1000;
  const daysRunning = Math.max(1, Math.floor((Date.now() - promo.startedAt) / dayMs) + 1);
  const seed = hashString(promo.id);

  // Baseline daily impressions: a per-campaign seed component (so two
  // otherwise-identical listings don't show identical numbers) plus a real
  // signal from the listing's own rating and review count.
  const baseDaily = 45 + (seed % 60) + Math.round(rating * 8) + Math.min(reviews, 200) / 10;

  const daysThisWeek = Math.min(daysRunning, 7);
  const impressionsThisWeek = Math.round(baseDaily * daysThisWeek);
  const impressions = Math.round(baseDaily * daysRunning);

  const ctr = Math.min(0.08, Math.max(0.008, 0.018 + (rating - 4) * 0.02 + (seed % 10) / 1000));
  const clicksThisWeek = Math.round(impressionsThisWeek * ctr);

  return { daysRunning, impressions, impressionsThisWeek, clicksThisWeek, ctr };
}
