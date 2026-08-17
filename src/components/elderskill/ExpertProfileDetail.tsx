import { useState } from "react";
import { BadgeCheck, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingSheet } from "@/components/elderskill/BookingSheet";
import { UpcomingSessions } from "@/components/elderskill/UpcomingSessions";
import { priceLabel, useDB } from "@/lib/elderskill/store";
import type { Expert } from "@/lib/elderskill/experts";

/**
 * The detailed expert profile. Same design as before — only the data source is
 * dynamic, so any selected expert renders through this one component.
 */
export function ExpertProfileDetail({ expert }: { expert: Expert }) {
  const db = useDB();
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Profile header */}
      <header className="flex flex-wrap items-start gap-6">
        <div className="flex size-24 items-center justify-center rounded-full bg-secondary font-serif text-3xl font-semibold text-primary">
          {expert.initials}
        </div>
        <div className="max-w-2xl">
          <h1 className="flex flex-wrap items-center gap-3 text-4xl font-semibold sm:text-5xl">
            {expert.name}
            {expert.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-base font-medium text-foreground">
                <BadgeCheck className="size-5 text-primary" aria-hidden />
                Verified
              </span>
            )}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{expert.primarySkill}</p>
          <p className="mt-1 text-base text-muted-foreground">{expert.experienceNote}</p>
          <p className="mt-1 flex items-center gap-2 text-base text-muted-foreground">
            <MapPin className="size-5" aria-hidden />
            {expert.city} · {expert.languages.join(", ")}
          </p>
          <p className="mt-4 text-lg">{expert.bio}</p>
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
          Book a free 30-minute conversation to see whether {expert.name} is the right person
          to help you. No payment, no obligation.
        </p>
        <Button className="mt-5 h-14 text-base" onClick={() => setBookingOpen(true)}>
          Book a free 30-minute session
        </Button>
      </section>

      {/* Services */}
      <section className="mt-14" aria-labelledby="services-heading">
        <h2 id="services-heading" className="text-2xl font-semibold">Work with them</h2>
        {expert.services.length === 0 ? (
          <p className="mt-3 text-lg text-muted-foreground">No services listed yet.</p>
        ) : (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {expert.services.map((s) => (
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
        {expert.tutorials.length === 0 ? (
          <p className="mt-3 text-lg text-muted-foreground">
            No tutorials have been published yet.
          </p>
        ) : (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {expert.tutorials.map((t) => (
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
      <div className="mt-14">
        <UpcomingSessions bookings={db.bookings} />
      </div>

      <BookingSheet open={bookingOpen} onOpenChange={setBookingOpen} db={db} />
    </div>
  );
}
