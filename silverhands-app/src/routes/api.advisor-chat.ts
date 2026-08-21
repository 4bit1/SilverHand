// Server route for the full AI Advisor chat page (seller.ai-advisor.tsx).
// Same seller/stats grounding as api.advisor.ts, but conversational: an
// opening message with no `message` field, then a real reply per follow-up
// question. Shares the Gemini caller and env vars with api.advisor.ts —
// see src/lib/gemini.ts.

import { createFileRoute } from "@tanstack/react-router";

import { callGemini, GeminiConfigError, stripJsonFences } from "@/lib/gemini";
import type {
  AdvisorChatRequestBody,
  AdvisorChatSuccessResponse,
  AdvisorSeller,
  AdvisorStats,
  AdvisorTurn,
} from "@/types/advisor";

const SYSTEM_PROMPT = `You are "Hansa AI", the seller-facing AI Advisor on SilverHands, a marketplace where senior citizens and homemakers in India sell handmade goods and services. You are in a conversation with ONE seller about their own shop, grounded only in the profile and stats given to you below — you cannot see order history, competitor prices, reviews, or any other seller's data, so never invent or imply access to information you don't have.

Two modes, based on whether the latest user message is present:

1. NO user message (this is the opening turn): write a short, warm opening (1-2 sentences) plus 2-3 grounded insights and 2-3 concrete recommendations — specific to this seller's craft, city, and the current time of year in India (season, festivals, school calendar). A recommendation that could be copy-pasted onto a different seller unchanged has failed. Example of the right specificity: a home baker in Amritsar near Diwali should hear about festive gift-box bulk orders, not "consider offering discounts."

2. A user message IS present: answer that specific question directly and conversationally, using the same profile/stats grounding and conversation history. Only include insights/recommendations if they genuinely help answer this question — a simple question can just get a direct, well-reasoned answer with no bullet lists.

Some profile fields may be missing because the seller is new — don't mention that data is missing or apologize for it, just lean on whatever IS present. If almost nothing is filled in, give general encouragement suited to a new seller in their stated craft.

Respond with ONLY a JSON object, no markdown fences, no commentary, in exactly this shape:
{"text": "string", "insights": [{"label": "string", "value": "string"}], "recommendations": ["string"]}

"insights" and "recommendations" are optional — omit them (or use empty arrays) for a simple conversational answer that doesn't need them.`;

function buildContextBlock(seller: AdvisorSeller, stats: AdvisorStats): string {
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

/** Keep only the last few turns — this is a demo, not a feature that needs
 * unbounded context, and it keeps every request small and fast. */
function recentHistory(history: AdvisorTurn[] | undefined, limit = 6): AdvisorTurn[] {
  if (!history || history.length === 0) return [];
  return history.slice(-limit);
}

function parseReply(raw: string): AdvisorChatSuccessResponse {
  const parsed = JSON.parse(stripJsonFences(raw));
  if (typeof parsed?.text !== "string" || !parsed.text.trim()) {
    throw new Error("Response JSON did not contain non-empty text");
  }

  const insights = Array.isArray(parsed.insights)
    ? parsed.insights.filter(
        (i: unknown): i is { label: string; value: string } =>
          typeof i === "object" &&
          i !== null &&
          typeof (i as { label?: unknown }).label === "string" &&
          typeof (i as { value?: unknown }).value === "string",
      )
    : undefined;

  const recommendations = Array.isArray(parsed.recommendations)
    ? parsed.recommendations.filter((r: unknown): r is string => typeof r === "string")
    : undefined;

  return {
    text: parsed.text,
    ...(insights && insights.length > 0 ? { insights } : {}),
    ...(recommendations && recommendations.length > 0 ? { recommendations } : {}),
  };
}

export const Route = createFileRoute("/api/advisor-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: AdvisorChatRequestBody;
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
        const message = body?.message?.trim();
        const history = recentHistory(body?.history);

        const messages = [
          { role: "system" as const, content: SYSTEM_PROMPT },
          { role: "user" as const, content: buildContextBlock(seller, stats) },
          ...history.map((turn) => ({
            role: (turn.role === "user" ? "user" : "assistant") as "user" | "assistant",
            content: turn.text,
          })),
          {
            role: "user" as const,
            content: message
              ? `The seller asks: "${message}"`
              : "No question yet — write the opening message for this session.",
          },
        ];

        try {
          const content = await callGemini(messages);
          const reply = parseReply(content);

          return new Response(JSON.stringify(reply), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          const status = err instanceof GeminiConfigError ? 500 : 502;
          console.error("Advisor chat route error:", err);
          return new Response(
            JSON.stringify({ error: "Advisor is temporarily unavailable." }),
            { status, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
