// Shared types for the AI Advisor feature — the dashboard "get suggestions"
// panel (AiAdvisor.tsx + api.advisor.ts) and the full chat page
// (seller.ai-advisor.tsx + api.advisor-chat.ts) both import from here so
// client and server can't drift out of sync.

/** The seller's own profile fields. Every field is optional — a brand-new
 * seller who hasn't finished onboarding may have almost nothing filled in. */
export interface AdvisorSeller {
  name?: string;
  location?: string;
  skills?: string[];
  about?: string;
  experience?: string;
}

/** Mock dashboard stats that already render elsewhere on the seller's
 * dashboard. Also all optional — a new seller has no orders yet. */
export interface AdvisorStats {
  revenue?: number;
  orders?: number;
  views?: number;
  topCategory?: string;
}

/* ---------- dashboard panel: fixed "get suggestions" shape ---------- */

export interface AdvisorSuggestion {
  title: string;
  description: string;
}

export interface AdvisorSuggestRequestBody {
  seller: AdvisorSeller;
  stats: AdvisorStats;
}

export interface AdvisorSuggestSuccessResponse {
  suggestions: AdvisorSuggestion[];
}

/* ---------- full chat page: conversational shape ---------- */

export interface AdvisorInsight {
  label: string;
  value: string;
}

export interface AdvisorTurn {
  role: "user" | "assistant";
  text: string;
}

export interface AdvisorChatRequestBody {
  seller: AdvisorSeller;
  stats: AdvisorStats;
  /** Omitted on first load — the route returns an opening message instead
   * of answering a question. Present on every follow-up turn. */
  message?: string;
  /** Prior turns, most recent last, for follow-up context. Keep this
   * reasonably short (the last handful of turns) — no need to send the
   * entire conversation on every request. */
  history?: AdvisorTurn[];
}

export interface AdvisorChatSuccessResponse {
  text: string;
  insights?: AdvisorInsight[];
  recommendations?: string[];
}

/* ---------- shared ---------- */

export interface AdvisorErrorResponse {
  error: string;
}
