import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  bookingEnd,
  bookingState,
  formatDate,
  formatTime,
  isJoinable,
  useDB,
} from "@/lib/elderskill/store";

export const Route = createFileRoute("/meeting/$bookingId")({
  head: () => ({
    meta: [
      { title: "Your session — ElderSkill" },
      {
        name: "description",
        content: "Join your booked ElderSkill conversation at the scheduled time.",
      },
      { property: "og:title", content: "Your session — ElderSkill" },
      {
        property: "og:description",
        content: "Join your booked ElderSkill conversation at the scheduled time.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Meeting,
});

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:py-24">
      {children}
    </div>
  );
}

function Meeting() {
  const { bookingId } = Route.useParams();
  const db = useDB();
  const now = useNow();

  const booking = db.bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold">This conversation isn't available.</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          We couldn't find this session, or you don't have access to it.
        </p>
        <Button asChild className="mt-6 h-14 text-base">
          <Link to="/their-expertise">Back to sessions</Link>
        </Button>
      </Shell>
    );
  }

  const state = bookingState(booking, now);

  if (state === "COMPLETED" || state === "EXPIRED" || state === "CANCELLED") {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold">This conversation has ended.</h1>
        <Button asChild className="mt-6 h-14 text-base">
          <Link to="/their-expertise">Back to sessions</Link>
        </Button>
      </Shell>
    );
  }

  if (!isJoinable(booking, now)) {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold">You're a little early.</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          This conversation starts on {formatDate(booking.date)} at {formatTime(booking.start)}.
          You can join five minutes before it begins.
        </p>
        <Button asChild variant="outline" className="mt-6 h-14 text-base">
          <Link to="/their-expertise">Back to sessions</Link>
        </Button>
      </Shell>
    );
  }

  const msLeft = Math.max(0, bookingEnd(booking).getTime() - now.getTime());
  const mm = String(Math.floor(msLeft / 60000)).padStart(2, "0");
  const ss = String(Math.floor((msLeft % 60000) / 1000)).padStart(2, "0");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold sm:text-4xl">
        Conversation with {booking.sellerName}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">{booking.purpose}</p>

      <div className="mt-6 flex aspect-video items-center justify-center rounded-2xl bg-secondary">
        <p className="px-6 text-center text-lg text-muted-foreground">
          Your video conversation appears here.
        </p>
      </div>

      <div
        className="mt-6 flex flex-wrap items-center justify-between gap-4"
        aria-live="polite"
      >
        <p className="text-2xl font-semibold tabular-nums">
          {mm}:{ss} <span className="text-base font-normal text-muted-foreground">remaining</span>
        </p>
        <Button asChild variant="outline" className="h-14 text-base">
          <Link to="/their-expertise">Leave conversation</Link>
        </Button>
      </div>
    </div>
  );
}
