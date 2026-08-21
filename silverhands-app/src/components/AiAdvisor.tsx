// Drop into the seller dashboard as:
//   <AiAdvisor seller={{ name, location, skills, about, experience }}
//              stats={{ revenue, orders, views, topCategory }} />
//
// Every prop field is optional — see the "Missing props" note at the bottom
// of this file for exactly what happens when one is absent.
//
// Ported onto the app's real design tokens (bg-card, text-primary, etc.)
// instead of a second copy of the palette — see api.advisor.ts for the
// server side.

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AdvisorSeller, AdvisorStats, AdvisorSuggestion } from "@/types/advisor";

interface AiAdvisorProps {
  seller: AdvisorSeller;
  stats: AdvisorStats;
  className?: string;
}

type AdvisorState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; suggestions: AdvisorSuggestion[] };

export function AiAdvisor({ seller, stats, className = "" }: AiAdvisorProps) {
  const [state, setState] = useState<AdvisorState>({ status: "idle" });

  async function getSuggestions() {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seller, stats }),
      });

      if (!res.ok) {
        setState({ status: "error", message: "Advisor is temporarily unavailable." });
        return;
      }

      const data = await res.json();
      if (!Array.isArray(data?.suggestions) || data.suggestions.length === 0) {
        setState({ status: "error", message: "Advisor is temporarily unavailable." });
        return;
      }

      setState({ status: "success", suggestions: data.suggestions });
    } catch {
      setState({ status: "error", message: "Advisor is temporarily unavailable." });
    }
  }

  return (
    <section className={cn("surface p-7 lg:p-9", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            <Sparkles className="size-3.5" aria-hidden /> AI-drafted
          </p>
          <h3 className="mt-1.5 font-display text-2xl font-semibold">Suggestions for you</h3>
        </div>
        {state.status !== "loading" && (
          <button
            type="button"
            onClick={getSuggestions}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {state.status === "success" ? "Refresh suggestions" : "Get suggestions"}
          </button>
        )}
      </div>

      {state.status === "idle" && (
        <p className="mt-4 text-sm text-muted-foreground">
          Get a few ideas based on your craft, your city, and what's happening this season.
        </p>
      )}

      {state.status === "loading" && (
        <div
          className="mt-5 flex items-center gap-2.5 text-sm text-primary"
          role="status"
          aria-live="polite"
        >
          <span className="size-3.5 animate-spin rounded-full border-2 border-primary-soft border-t-primary" />
          Thinking about your shop…
        </div>
      )}

      {state.status === "error" && (
        <div className="mt-4 rounded-xl bg-secondary px-4 py-3 text-sm" role="alert">
          {state.message}{" "}
          <button
            type="button"
            onClick={getSuggestions}
            className="font-semibold text-primary underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {state.status === "success" && (
        <ul className="mt-5 flex flex-col gap-3">
          {state.suggestions.map((s, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <Sparkles className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="font-display font-semibold leading-snug">{s.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AiAdvisor;

/*
 * Missing props — what actually happens:
 *
 * - Component-level: every field on `seller` and `stats` is optional in the
 *   type, and the component never reads into them directly (it just passes
 *   the two objects straight to the server route as JSON, even if seller or
 *   stats is `{}`). So a missing prop can never throw or blank the panel.
 *
 * - Server-route level: each field is read with a fallback string before it
 *   goes into the prompt (see buildUserPrompt in api.advisor.ts). So the
 *   model always sees an explicit placeholder instead of "undefined" or a
 *   missing key.
 *
 * - Model-level: the system prompt tells it not to mention or apologize for
 *   missing fields, and to lean on whatever IS present — e.g. a seller with
 *   only `skills: ["gardening"]` and `location: "Chennai"` filled in still
 *   gets a real seasonal/local suggestion. Only if almost everything is
 *   missing does it fall back to general encouragement for a new seller in
 *   their stated craft, rather than inventing specifics about them.
 *
 * - `stats.topCategory` specifically: with no orders yet it's genuinely
 *   unknowable, so it's the one field where the fallback isn't just cosmetic
 *   — a brand-new seller's suggestions simply won't reference a top
 *   category, since there isn't one.
 */
