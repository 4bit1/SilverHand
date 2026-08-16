// Shared Gemini caller for the AI Advisor's two server routes
// (api.advisor.ts and api.advisor-chat.ts). Both need the same env vars,
// the same OpenAI-compatible request shape, and the same error handling —
// centralized here so the two routes can't drift out of sync.
//
// Env vars this expects (server-side only — never exposed to the client):
//   GEMINI_BASE_URL  e.g. "https://generativelanguage.googleapis.com/v1beta/openai/"
//   GEMINI_MODEL     e.g. "gemini-2.5-flash"
//   GEMINI_API_KEY   a Gemini API key from Google AI Studio

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class GeminiConfigError extends Error {}
export class GeminiRequestError extends Error {}

/** Calls Gemini's OpenAI-compatible chat completions endpoint and returns
 * the raw text content of the reply. Throws GeminiConfigError if the env
 * isn't set up, GeminiRequestError if the call itself fails. Callers catch
 * these and turn them into an honest "temporarily unavailable" response —
 * never a silent fallback to invented content. */
export async function callGemini(messages: ChatMessage[]): Promise<string> {
  const baseUrl = process.env["GEMINI_BASE_URL"];
  const model = process.env["GEMINI_MODEL"];
  const apiKey = process.env["GEMINI_API_KEY"];

  if (!baseUrl || !model || !apiKey) {
    throw new GeminiConfigError(
      "Missing GEMINI_BASE_URL, GEMINI_MODEL, or GEMINI_API_KEY",
    );
  }

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.8,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    // Includes the 15/min or 1,500/day free-tier rate limit (HTTP 429)
    const errText = await res.text().catch(() => "");
    throw new GeminiRequestError(`Gemini request failed: ${res.status} ${errText}`);
  }

  const completion = await res.json();
  const content: string | undefined = completion?.choices?.[0]?.message?.content;
  if (!content) {
    throw new GeminiRequestError(`Gemini response had no content: ${JSON.stringify(completion)}`);
  }
  return content;
}

/** Strips markdown fences a model sometimes wraps JSON in, despite being
 * asked not to. Doesn't trust the result — callers should still validate
 * shape before using it. */
export function stripJsonFences(raw: string): string {
  return raw.replace(/```json|```/g, "").trim();
}
