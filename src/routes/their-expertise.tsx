import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingSheet } from "@/components/elderskill/BookingSheet";
import {
  bookingState,
  formatDate,
  formatTime,
  isJoinable,
  priceLabel,
  useDB,
} from "@/lib/elderskill/store";

export const Route = createFileRoute("/their-expertise")({
  head: () => ({
    meta: [
      { title: "Their Expertise — ElderSkill" },
      {
        name: "description",
        content:
          "Learn from an experienced maker: browse tutorials, hire them for a service, or book a free 30-minute conversation.",
      },
      { property: "og:title", content: "Their Expertise — ElderSkill" },
      {
        property: "og:description",
        content:
          "Browse tutorials, hire an experienced maker, or book a free 30-minute conversation.",
      },
    ],
  }),
  component: TheirExpertise,
});

function TheirExpertise() {
  const db = useDB();
  const [bookingOpen, setBookingOpen] = useState(false);

  const published = db.tutorials.filter((t) => t.status === "Published");
  const upcoming = [...db.bookings]
    .filter((b) => {
      const s = bookingState(b);
      return s !== "COMPLETED" && s !== "EXPIRED" && s !== "CANCELLED";
    })
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Profile header */}
      <header className="flex flex-wrap items-start gap-6">
        <div className="flex size-24 items-center justify-center rounded-full bg-secondary font-serif text-3xl font-semibold text-primary">
          {db.profile.initials}
        </div>
        <div className="max-w-2xl">
          <h1 className="flex flex-wrap items-center gap-3 text-4xl font-semibold sm:text-5xl">
            {db.profile.name}
            {db.profile.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-base font-medium text-foreground">
                <BadgeCheck className="size-5 text-primary" aria-hidden />
                Verified
              </span>
            )}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{db.profile.primarySkill}</p>
          <p className="mt-1 text-base text-muted-foreground">{db.profile.experience}</p>
          <p className="mt-1 flex items-center gap-2 text-base text-muted-foreground">
            <MapPin className="size-5" aria-hidden />
            {db.profile.location} · {db.profile.languages.join(", ")}
          </p>
          <p className="mt-4 text-lg">{db.profile.bio}</p>
        </div>
      </header>

      {/* Free session */}
      <section
        className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8"
        aria-labelledby="free-session-heading"
      >
        <h2 id="free-session-heading" className="text-2xl font-semibold">
          Talk first — it's free
        </h2>
        <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
          Book a free 30-minute conversation to see whether {db.profile.name} is the right person
          to help you. No payment, no obligation.
        </p>
        <Button className="mt-5 h-14 text-base" onClick={() => setBookingOpen(true)}>
          Book a free 30-minute session
        </Button>
      </section>

      {/* Services */}
      <section className="mt-14" aria-labelledby="services-heading">
        <h2 id="services-heading" className="text-2xl font-semibold">Work with them</h2>
        {db.services.length === 0 ? (
          <p className="mt-3 text-lg text-muted-foreground">No services listed yet.</p>
        ) : (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {db.services.map((s) => (
              <li key={s.id} className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <p className="mt-1 text-base text-muted-foreground">{s.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-base">
                  <Badge variant="secondary">{s.skill}</Badge>
                  <Badge variant="secondary">{s.price}</Badge>
                  <Badge variant="secondary">{s.availability}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Tutorials */}
      <section className="mt-14" aria-labelledby="tutorials-heading">
        <h2 id="tutorials-heading" className="text-2xl font-semibold">
          Learn from their experience
        </h2>
        {published.length === 0 ? (
          <p className="mt-3 text-lg text-muted-foreground">
            No tutorials have been published yet.
          </p>
        ) : (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {published.map((t) => (
              <li key={t.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-secondary">
                  {t.thumbnailUrl ? (
                    <img src={t.thumbnailUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="px-4 text-center text-sm text-muted-foreground">
                      No thumbnail yet
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{t.title}</h3>
                <p className="mt-1 text-base text-muted-foreground">{t.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-base">
                  <Badge variant="secondary">{t.durationMin} min</Badge>
                  <Badge variant="secondary">{t.difficulty}</Badge>
                  <Badge variant="secondary">{priceLabel(t.priceCents)}</Badge>
                </div>
                {t.learnings.length > 0 && (
                  <ul className="mt-4 list-disc space-y-1 pl-5 text-base text-muted-foreground">
                    {t.learnings.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Upcoming bookings */}
      <section className="mt-14" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="text-2xl font-semibold">Your upcoming sessions</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-lg text-muted-foreground">
            You have no sessions booked yet.
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {upcoming.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {formatDate(b.date)} · {formatTime(b.start)}–{formatTime(b.end)}
                  </p>
                  <p className="text-base text-muted-foreground">
                    With {b.sellerName} — {b.purpose}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{bookingState(b).replace("_", " ")}</Badge>
                  {isJoinable(b) ? (
                    <Button asChild className="h-12 text-base">
                      <Link to="/meeting/$bookingId" params={{ bookingId: b.id }}>
                        Join
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="h-12 text-base">Join</Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <BookingSheet open={bookingOpen} onOpenChange={setBookingOpen} db={db} />
    </div>
  );
}
