// SilverHands Fair Discovery — the "opportunity balancing" idea from the
// project's original pitch: instead of ranking purely by rating (which
// concentrates demand on whoever already has the most reviews), blend in
// quality, a diminishing-returns popularity term, and an explicit boost
// for newer / less-reviewed sellers, so a strong new seller isn't
// permanently buried under established ones.
//
// This is a transparent, deterministic formula — not a black box — on
// purpose: every factor here is inspectable and explainable, which is
// exactly what you want to be able to say out loud in a demo.

import { sellerById } from "./data";

export type SortMode = "fair" | "rating";

interface Rankable {
  sellerId: string;
  rating: number;
  reviews: number;
}

const CURRENT_YEAR = 2026;

// Normalizes review count on a log scale against a realistic
// "well-established seller" ceiling, so raw review count alone can't run
// away with the ranking.
const REVIEW_CEILING = 250;

function joinedYear(joined: string): number {
  const match = joined.match(/(\d{4})/);
  return match ? Number(match[1]) : 2018;
}

/** Higher is better. Every term is 0..1 before weighting, so the weights
 * below are the actual, tunable knobs on how much each factor matters. */
export function fairScore(item: Rankable, locationNeedle?: string): number {
  const seller = sellerById(item.sellerId);

  const quality = item.rating / 5;

  const popularity = Math.min(Math.log10(item.reviews + 1) / Math.log10(REVIEW_CEILING), 1);

  // The core fairness term: fewer reviews -> bigger boost. This is what
  // keeps a 40-review seller competitive against a 240-review one when
  // quality is comparable, instead of losing on volume alone.
  const opportunityBoost = 1 - popularity;

  // Sellers who joined within the last ~2 years get an extra nudge — a
  // fair first look for people still building a review history.
  const yearsSinceJoin = seller ? CURRENT_YEAR - joinedYear(seller.joined) : 4;
  const noviceBoost = yearsSinceJoin <= 2 ? 1 : yearsSinceJoin <= 4 ? 0.5 : 0;

  let score = quality * 0.4 + popularity * 0.15 + opportunityBoost * 0.3 + noviceBoost * 0.15;

  if (locationNeedle && seller?.location.toLowerCase().includes(locationNeedle.toLowerCase())) {
    score += 0.2;
  }

  return score;
}

export function sortFair<T extends Rankable>(items: T[], locationNeedle?: string): T[] {
  return items
    .map((item) => ({ item, score: fairScore(item, locationNeedle) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}

export function sortByRating<T extends Rankable>(items: T[]): T[] {
  return [...items].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
}

export function sortByMode<T extends Rankable>(items: T[], mode: SortMode, locationNeedle?: string): T[] {
  return mode === "fair" ? sortFair(items, locationNeedle) : sortByRating(items);
}

/* ------------------------ location-aware search ------------------------ */

import { sellers } from "./data";

const KNOWN_LOCATIONS = Array.from(
  new Set(sellers.map((s) => s.location.split(",").pop()?.trim() ?? s.location)),
);

/** Pulls a known city out of free-text search, e.g. "tutoring in Chennai"
 * -> "Chennai", so Fair Discovery can give local sellers a boost without
 * the buyer needing a separate location filter. */
export function detectLocationNeedle(query: string | undefined): string | undefined {
  if (!query) return undefined;
  const lower = query.toLowerCase();
  return KNOWN_LOCATIONS.find((city) => lower.includes(city.toLowerCase()));
}
