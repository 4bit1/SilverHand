import { Link } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  bookingStart,
  bookingState,
  formatDate,
  formatTime,
  isJoinable,
  type Booking,
} from "@/lib/elderskill/store";

const STATE_LABEL: Record<string, string> = {
  UPCOMING: "Upcoming",
  CONFIRMED: "Upcoming",
  JOINABLE: "Starting soon",
  IN_PROGRESS: "Live now",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  EXPIRED: "Ended",
};

function relativeWhen(b: Booking) {
  const diff = bookingStart(b).getTime() - Date.now();
  if (diff <= 0) return "now";
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `in ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  const days = Math.round(hours / 24);
  return `in ${days} ${days === 1 ? "day" : "days"}`;
}

function dayLabel(b: Booking) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (b.date === today) return "Today";
  if (b.date === tomorrow) return "Tomorrow";
  return formatDate(b.date);
}

export function UpcomingSessions({ bookings }: { bookings: Booking[] }) {
  const upcoming = bookings
    .filter((b) => {
      const s = bookingState(b);
      return s !== "COMPLETED" && s !== "EXPIRED" && s !== "CANCELLED";
    })
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));

  return (
    <section aria-labelledby="upcoming-heading">
      <h2 id="upcoming-heading" className="font-serif text-2xl font-semibold">
        Your upcoming sessions
      </h2>

      {upcoming.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border bg-card/60 p-8 text-center">
          <CalendarClock className="mx-auto size-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 text-lg text-muted-foreground">
            You have no conversations scheduled yet.
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {upcoming.map((b) => {
            const state = bookingState(b);
            const live = state === "IN_PROGRESS" || state === "JOINABLE";
            return (
              <li
                key={b.id}
                className={`relative overflow-hidden rounded-xl border bg-card p-5 pl-6 shadow-sm transition-shadow hover:shadow-md sm:p-6 sm:pl-7 ${
                  live ? "border-primary/50" : "border-border"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-1.5 ${live ? "bg-primary" : "bg-primary/30"}`}
                />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                      <span
                        aria-hidden
                        className={`size-2 rounded-full bg-primary ${live ? "animate-pulse" : ""}`}
                      />
                      {STATE_LABEL[state] ?? state}
                    </p>
                    <p className="mt-2 font-serif text-xl font-semibold">
                      Conversation with {b.sellerName}
                    </p>
                    <p className="mt-1 text-lg">
                      {dayLabel(b)} · {formatTime(b.start)}–{formatTime(b.end)}
                      <span className="text-muted-foreground"> · {relativeWhen(b)}</span>
                    </p>
                    <p className="mt-1 text-base text-muted-foreground">{b.purpose}</p>
                  </div>
                  {isJoinable(b) ? (
                    <Button asChild className="h-12 text-base">
                      <Link to="/meeting/$bookingId" params={{ bookingId: b.id }}>
                        Join conversation
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="h-12 text-base">
                      Join conversation
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
