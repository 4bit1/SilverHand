import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Copy,
  Eye,
  IndianRupee,
  MapPin,
  PanelLeft,
  PanelLeftClose,
  RefreshCcw,
  Send,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useSession } from "@/lib/store";
import type { AdvisorInsight, AdvisorTurn } from "@/types/advisor";

export const Route = createFileRoute("/seller/ai-advisor")({
  head: () => ({
    meta: [
      { title: "AI Advisor | SilverHands" },
      {
        name: "description",
        content: "Get AI-powered advice grounded in your SilverHands shop data.",
      },
      { property: "og:title", content: "AI Advisor | SilverHands" },
      {
        property: "og:description",
        content: "Get AI-powered advice grounded in your SilverHands shop data.",
      },
    ],
  }),
  component: AIAdvisor,
});

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  insights?: AdvisorInsight[];
  recommendations?: string[];
  timestamp: string;
};

const SUGGESTED_PROMPTS = [
  "How can I increase my profit this month?",
  "Which listing should I promote?",
  "What should I price a new listing at?",
  "What's a good next step for my shop this week?",
];

// Real numbers, matching the seller dashboard exactly (src/routes/seller.index.tsx)
// — not a second, disconnected set of stats.
const CONTEXT_STATS = [
  { icon: IndianRupee, label: "Total earnings", value: "₹1,84,500" },
  { icon: TrendingUp, label: "Orders received", value: "126" },
  { icon: Eye, label: "Profile views", value: "3,482" },
  { icon: Star, label: "Customer rating", value: "4.9 (214 reviews)" },
];

function nowLabel() {
  return new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3" aria-label="Hansa AI is typing" role="status">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-pulse rounded-full bg-muted-foreground"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </div>
  );
}

function MessageBubble({
  message,
  onCopy,
  copied,
  onRegenerate,
  canRegenerate,
}: {
  message: Message;
  onCopy: (message: Message) => void;
  copied: boolean;
  onRegenerate: (message: Message) => void;
  canRegenerate: boolean;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-[15px] leading-relaxed text-primary-foreground sm:max-w-[65%]">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
        <Sparkles size={15} aria-hidden />
      </div>
      <div className="max-w-[85%] sm:max-w-[75%]">
        <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3.5 shadow-soft">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.text}</p>

          {message.insights && message.insights.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.insights.map((stat) => (
                <span
                  key={stat.label}
                  className="rounded-full border border-border bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary"
                >
                  {stat.label}: <strong>{stat.value}</strong>
                </span>
              ))}
            </div>
          )}

          {message.recommendations && message.recommendations.length > 0 && (
            <ul className="mt-3 flex flex-col gap-2.5">
              {message.recommendations.map((recommendation, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {recommendation}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-1.5 flex items-center gap-1 pl-1">
          <span className="mr-2 text-xs text-muted-foreground">{message.timestamp}</span>
          <button
            type="button"
            onClick={() => onCopy(message)}
            aria-label="Copy response"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
          {canRegenerate && (
            <button
              type="button"
              onClick={() => onRegenerate(message)}
              aria-label="Regenerate response"
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <RefreshCcw size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AIAdvisor() {
  const session = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [openingError, setOpeningError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // The seller's own data — this is honestly all that's persisted right
  // now (name from session). Location/skills/about/experience will start
  // flowing in once the profile page persists onboarding fields somewhere
  // the advisor can read; until then the backend already handles missing
  // fields gracefully rather than inventing values for them.
  const seller = session?.name ? { name: session.name } : {};
  const stats = { revenue: 184500, orders: 126, views: 3482, topCategory: "Handmade Food" };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  async function callAdvisor(userMessage: string | undefined, history: AdvisorTurn[]) {
    const res = await fetch("/api/advisor-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seller, stats, message: userMessage, history }),
    });
    if (!res.ok) throw new Error("Advisor request failed");
    const data = await res.json();
    if (typeof data?.text !== "string") throw new Error("Advisor response malformed");
    return data as { text: string; insights?: AdvisorInsight[]; recommendations?: string[] };
  }

  // Opening message — fetched for real on mount, not a hardcoded seed.
  useEffect(() => {
    let cancelled = false;
    setThinking(true);
    callAdvisor(undefined, [])
      .then((reply) => {
        if (cancelled) return;
        setMessages([
          {
            id: "m1",
            role: "assistant",
            timestamp: nowLabel(),
            text: reply.text,
            ...(reply.insights ? { insights: reply.insights } : {}),
            ...(reply.recommendations ? { recommendations: reply.recommendations } : {}),
          },
        ]);
      })
      .catch(() => {
        if (!cancelled) setOpeningError("Advisor is temporarily unavailable.");
      })
      .finally(() => {
        if (!cancelled) setThinking(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const history: AdvisorTurn[] = messages.map((m) => ({ role: m.role, text: m.text }));
    const userMsg: Message = { id: `u${Date.now()}`, role: "user", text: trimmed, timestamp: nowLabel() };
    setMessages((previous) => [...previous, userMsg]);
    setInput("");
    setThinking(true);

    callAdvisor(trimmed, history)
      .then((reply) => {
        setMessages((previous) => [
          ...previous,
          {
            id: `a${Date.now()}`,
            role: "assistant",
            timestamp: nowLabel(),
            text: reply.text,
            ...(reply.insights ? { insights: reply.insights } : {}),
            ...(reply.recommendations ? { recommendations: reply.recommendations } : {}),
          },
        ]);
      })
      .catch(() => {
        setMessages((previous) => [
          ...previous,
          {
            id: `a${Date.now()}`,
            role: "assistant",
            timestamp: nowLabel(),
            text: "I couldn't reach the advisor just now — please try that again in a moment.",
          },
        ]);
      })
      .finally(() => setThinking(false));
  };

  const handleCopy = (message: Message) => {
    const plain = [message.text, ...(message.recommendations ?? [])].join("\n");
    void navigator.clipboard?.writeText(plain);
    setCopiedId(message.id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  const handleRegenerate = (message: Message) => {
    const idx = messages.findIndex((m) => m.id === message.id);
    const history: AdvisorTurn[] = messages.slice(0, idx).map((m) => ({ role: m.role, text: m.text }));
    const precedingUser = [...messages.slice(0, idx)].reverse().find((m) => m.role === "user");

    setMessages((previous) => previous.filter((item) => item.id !== message.id));
    setThinking(true);
    callAdvisor(precedingUser?.text, history)
      .then((reply) => {
        setMessages((previous) => [
          ...previous,
          {
            id: `${message.id}-r`,
            role: "assistant",
            timestamp: nowLabel(),
            text: reply.text,
            ...(reply.insights ? { insights: reply.insights } : {}),
            ...(reply.recommendations ? { recommendations: reply.recommendations } : {}),
          },
        ]);
      })
      .catch(() => {
        setMessages((previous) => [...previous, { ...message, id: `${message.id}-r`, timestamp: nowLabel() }]);
      })
      .finally(() => setThinking(false));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="-mx-5 -my-10 flex min-h-[calc(100vh-5rem)] flex-col bg-background lg:-mx-10 lg:-my-14">
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && (
          <aside
            className="hidden w-72 shrink-0 flex-col border-r border-border bg-sidebar md:flex"
            aria-label="Advisor context"
          >
            <div className="mt-auto border-t border-border p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                What Hansa AI is looking at
              </p>
              <div className="flex flex-col gap-3">
                {CONTEXT_STATS.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center gap-2.5">
                      <div className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                        <Icon size={13} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                        <p className="truncate text-sm font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
                {seller.name && (
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                      <MapPin size={13} aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs text-muted-foreground">Seller</p>
                      <p className="truncate text-sm font-semibold">{seller.name}</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Conversations aren't saved between visits in this demo.
              </p>
            </div>
          </aside>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-3 border-b border-border px-6 py-3 md:px-10">
            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              className="hidden rounded-full p-2 hover:bg-muted md:inline-flex"
            >
              {sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeft size={17} />}
            </button>
            <div>
              <h1 className="font-display text-lg font-semibold leading-tight">Hansa AI</h1>
              <p className="text-xs text-muted-foreground">Advice grounded in your shop's own numbers</p>
            </div>
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-10" aria-live="polite">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCopy={handleCopy}
                  copied={copiedId === message.id}
                  onRegenerate={handleRegenerate}
                  canRegenerate={message.id !== "m1"}
                />
              ))}

              {openingError && messages.length === 0 && (
                <div className="rounded-xl bg-secondary px-4 py-3 text-sm" role="alert">
                  {openingError}
                </div>
              )}

              {thinking && (
                <div className="flex items-start gap-3">
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Sparkles size={15} aria-hidden />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-border bg-card shadow-soft">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 px-6 pb-6 pt-2 md:px-10">
            <div className="mx-auto max-w-3xl">
              {messages.length <= 1 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="min-h-10 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 pl-4 shadow-soft">
                <label htmlFor="advisor-input" className="sr-only">
                  Ask Hansa AI about your shop
                </label>
                <textarea
                  id="advisor-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask about pricing, promotion, or what's working…"
                  className="max-h-32 flex-1 resize-none bg-transparent py-2.5 text-[15px] outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || thinking}
                  aria-label="Send message"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
                >
                  <Send size={16} aria-hidden />
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Hansa AI uses your shop's data to advise — it doesn't post, price, or message buyers without you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
