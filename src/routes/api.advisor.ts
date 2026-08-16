// Server route for the AI Advisor dashboard panel (src/components/AiAdvisor.tsx).
// The frontend never talks to Gemini directly — it POSTs the seller's own
// props here, and this route makes the LLM call server-side so the API key
// never reaches the browser. See src/lib/gemini.ts for the env vars this
// depends on.

import { createFileRoute } from "@tanstack/react-router";

import { callGemini, GeminiConfigError, stripJsonFences } from "@/lib/gemini";
import type {
  AdvisorSeller,
  AdvisorStats,
  AdvisorSuggestRequestBody,
  AdvisorSuggestion,
} from "@/types/advisor";

const SYSTEM_PROMPT = `You are the seller-facing "AI Advisor" on SilverHands, a marketplace where senior citizens and homemakers in India sell handmade goods and services. You are looking at ONE seller's own profile and dashboard stats and giving THEM 3-4 short, concrete suggestions to grow their business.

The bar for a good suggestion: it should only make sense for THIS seller — it should draw on their specific craft/skill, their city or region, and the current time of year (season, festivals, school calendar, weather) in India. If a suggestion could be copy-pasted onto a different seller's dashboard unchanged, it has failed.

Good example: a tailor in Chennai, with school reopening season approaching, gets told to offer uniform stitching — not "consider offering discounts" or "raise your prices."

Bad suggestions to avoid: generic marketing advice ("promote on social media", "offer discounts", "improve your photos") unless you tie it to something specific about this seller. Never suggest anything that requires data you don't have (you cannot see order history, competitor prices, or reviews — only what's given to you below).

Some profile fields may be missing or empty because the seller is new. Don't mention that data is missing and don't apologize for it — just lean more heavily on whatever fields ARE present (even just a skill and a city is enough for one good seasonal or local suggestion). If almost nothing is filled in, give general encouragement suited to a new seller in their stated craft, still grounded in location/season where possible, rather than inventing facts about them.

Respond with ONLY a JSON object, no markdown fences, no commentary, in exactly this shape:
{"suggestions": [{"title": "string, under 8 words", "description": "string, 1-2 sentences"}]}

Return 3 to 4 suggestions.`;

function buildUserPrompt(seller: AdvisorSeller, stats: AdvisorStats): string {
  const today = new Date();
  const dateContext = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const lines: string[] = [`Today's date: ${dateContext} (India).`, "", "Seller profile:"];

  lines.push(`- Name: ${seller.name || "(not provided)"}`);
  lines.push(`- Location: ${seller.location || "(not provided)"}`);
  lines.push(
    `- Skills: ${seller.skills && seller.skills.length > 0 ? seller.skills.join(", ") : "(not provided)"}`,
  );
  lines.push(`- About: ${seller.about || "(not provided)"}`);
  lines.push(`- Experience: ${seller.experience || "(not provided)"}`);

  lines.push("", "Dashboard stats:");
  lines.push(`- Revenue: ${stats.revenue !== undefined ? stats.revenue : "(not available yet)"}`);
  lines.push(`- Orders: ${stats.orders !== undefined ? stats.orders : "(not available yet)"}`);
  lines.push(`- Views: ${stats.views !== undefined ? stats.views : "(not available yet)"}`);
  lines.push(`- Top category: ${stats.topCategory || "(not available yet)"}`);

  return lines.join("\n");
}

/** Very defensive parse — the model is asked for clean JSON, but we don't
 * trust that blindly. Strips markdown fences if present, validates shape,
 * and drops any item missing a title/description instead of failing the
 * whole response. */
function parseSuggestions(raw: string): AdvisorSuggestion[] {
  const parsed = JSON.parse(stripJsonFences(raw));

  const list = Array.isArray(parsed?.suggestions) ? parsed.suggestions : null;
  if (!list) throw new Error("Response JSON did not contain a suggestions array");

  const suggestions: AdvisorSuggestion[] = list
    .filter(
      (item: unknown): item is AdvisorSuggestion =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as AdvisorSuggestion).title === "string" &&
        typeof (item as AdvisorSuggestion).description === "string",
    )
    .slice(0, 4);

  if (suggestions.length === 0) throw new Error("No valid suggestions in response");
  return suggestions;
}

export const Route = createFileRoute("/api/advisor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: AdvisorSuggestRequestBody;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid request body." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const seller = body?.seller ?? {};
        const stats = body?.stats ?? {};

        try {
          const content = await callGemini([
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(seller, stats) },
          ]);
          const suggestions = parseSuggestions(content);

          return new Response(JSON.stringify({ suggestions }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          const status = err instanceof GeminiConfigError ? 500 : 502;
          console.error("Advisor route error:", err);
          return new Response(
            JSON.stringify({ error: "Advisor is temporarily unavailable." }),
            { status, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
