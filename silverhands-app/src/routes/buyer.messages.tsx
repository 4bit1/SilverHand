import { createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data";

export const Route = createFileRoute("/buyer/messages")({
  head: () => ({
    meta: [
      { title: "Messages | SilverHands" },
      { name: "description", content: "Chat directly with the sellers you've booked or saved." },
      { property: "og:title", content: "Messages | SilverHands" },
      { property: "og:description", content: "Chat directly with your SilverHands sellers." },
    ],
  }),
  component: Messages,
});

const thread = [
  { from: "them", text: "Namaste! Yes, I can deliver the thali by 12:30 tomorrow." },
  { from: "me", text: "Perfect. Could you make it slightly less spicy?" },
  { from: "them", text: "Of course — I'll keep the green chilli separate on the side." },
];

function Messages() {
  return (
    <div>
      <SectionHeading eyebrow="Inbox" title="Messages" />
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <ul className="surface divide-y divide-border overflow-hidden">
          {services.slice(0, 4).map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={`flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted ${i === 0 ? "bg-primary-soft" : ""}`}
              >
                <img src={s.image} alt="" loading="lazy" className="size-12 rounded-full object-cover" />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{s.seller}</span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {i === 0 ? "I'll keep the chilli separate" : "Thank you for your order!"}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="surface flex min-h-[26rem] flex-col">
          <header className="border-b border-border px-6 py-4">
            <p className="font-semibold">{services[0]?.seller}</p>
            <p className="text-sm text-muted-foreground">Usually replies within an hour</p>
          </header>
          <div className="flex flex-1 flex-col gap-3 p-6">
            {thread.map((m, i) => (
              <p
                key={i}
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  m.from === "me"
                    ? "self-end bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.text}
              </p>
            ))}
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-3 border-t border-border p-4"
          >
            <label htmlFor="msg" className="sr-only">
              Write a message
            </label>
            <input
              id="msg"
              placeholder="Write a message…"
              className="h-12 flex-1 rounded-full bg-muted px-5 outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
