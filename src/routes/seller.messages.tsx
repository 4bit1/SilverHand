import { createFileRoute } from "@tanstack/react-router";

import { SectionHeading } from "@/components/Cards";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/seller/messages")({
  head: () => ({
    meta: [
      { title: "Seller messages | SilverHands" },
      { name: "description", content: "Answer buyer questions and confirm bookings." },
      { property: "og:title", content: "Seller messages | SilverHands" },
      { property: "og:description", content: "Answer buyer questions and confirm bookings." },
    ],
  }),
  component: SellerMessages,
});

const buyers = ["Priya Menon", "Arjun Thomas", "Nisha Rao"];

const thread = [
  { from: "them", text: "Hello! Do you deliver to Indiranagar on Sundays?" },
  { from: "me", text: "Yes, Sunday deliveries reach by 12:30." },
];

function SellerMessages() {
  return (
    <div>
      <SectionHeading eyebrow="Inbox" title="Messages" />
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <ul className="surface divide-y divide-border overflow-hidden">
          {buyers.map((b, i) => (
            <li key={b}>
              <button
                type="button"
                className={`w-full px-5 py-4 text-left transition-colors hover:bg-muted ${i === 0 ? "bg-primary-soft" : ""}`}
              >
                <span className="block font-semibold">{b}</span>
                <span className="block truncate text-sm text-muted-foreground">
                  {i === 0 ? "Do you deliver on Sundays?" : "Thank you, it arrived safely!"}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="surface flex min-h-[26rem] flex-col">
          <header className="border-b border-border px-6 py-4">
            <p className="font-semibold">{buyers[0]}</p>
            <p className="text-sm text-muted-foreground">Buyer since 2024</p>
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
            <label htmlFor="smsg" className="sr-only">
              Write a reply
            </label>
            <input
              id="smsg"
              placeholder="Write a reply…"
              className="h-12 flex-1 rounded-full bg-muted px-5 outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
