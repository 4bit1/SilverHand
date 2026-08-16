import { useState } from "react";
import { Sparkles, X, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { from: "ai" | "me"; text: string };

const suggestions = [
  "Write a product description",
  "Suggest a fair price",
  "Improve my profile bio",
  "What's trending this week?",
];

const canned: Record<string, string> = {
  "Write a product description":
    "Here's a draft: “Woven slowly on a pit loom, this cotton throw carries the small irregularities that only hands can leave. Undyed, breathable, and softer with every wash.” Want a shorter version for listings?",
  "Suggest a fair price":
    "Similar handwoven throws in your city list between ₹2,100 and ₹2,900. Given your 4.9 rating and nine-day weave time, I'd anchor at ₹2,400 with a festive bundle at ₹4,300.",
  "Improve my profile bio":
    "Try leading with your years of craft: “Thirty-eight years of cooking for family — now for my neighbourhood.” Specific numbers build trust faster than adjectives.",
  "What's trending this week?":
    "Homemade Food and Traditional Arts are up 18% in your area. Tutoring peaks in the next two weeks — a good moment to publish a short evening batch.",
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "ai",
      text: "Hello, I'm Hansa — your SilverHands assistant. I can write descriptions, suggest pricing, or polish your profile. What shall we work on?",
    },
  ]);

  function send(text: string) {
    if (!text.trim()) return;
    const reply =
      canned[text] ??
      "Good question. Here's my suggestion: keep the listing title under nine words, lead with the material or method, and mention delivery time — listings that do this get about 30% more enquiries.";
    setMessages((m) => [...m, { from: "me", text }, { from: "ai", text: reply }]);
    setInput("");
  }

  return (
    <>
      <Button
        variant="gold"
        size="lg"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Open the SilverHands AI assistant"
        className="fixed bottom-6 right-5 z-50 shadow-lift md:bottom-8 md:right-8"
      >
        {open ? <X /> : <Sparkles />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask Hansa AI"}</span>
      </Button>

      <div
        className={cn(
          "surface fixed bottom-24 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden transition-all duration-300 md:right-8",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <header className="flex items-center gap-3 border-b border-border bg-primary-soft px-5 py-4">
          <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold">Hansa AI</p>
            <p className="text-xs text-muted-foreground">Your listing & pricing companion</p>
          </div>
        </header>

        <div className="flex max-h-[45vh] flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => (
            <p
              key={i}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.from === "ai"
                  ? "bg-muted text-foreground"
                  : "self-end bg-primary text-primary-foreground",
              )}
            >
              {m.text}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <label htmlFor="hansa-input" className="sr-only">
            Message Hansa AI
          </label>
          <input
            id="hansa-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            className="h-11 flex-1 rounded-full bg-muted px-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" size="icon" aria-label="Send message">
            <SendHorizonal />
          </Button>
        </form>
      </div>
    </>
  );
}
