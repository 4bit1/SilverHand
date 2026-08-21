import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvailabilityDialog } from "@/components/elderskill/AvailabilityDialog";
import { TutorialDialog } from "@/components/elderskill/TutorialDialog";
import {
  WEEKDAYS,
  bookingState,
  formatDate,
  formatTime,
  isJoinable,
  priceLabel,
  toMinutes,
  update,
  useDB,
  type Booking,
  type Tutorial,
} from "@/lib/elderskill/store";

export const Route = createFileRoute("/seller/teach-and-share")({
  head: () => ({
    meta: [
      { title: "Teach & Share — SilverHands" },
      {
        name: "description",
        content:
          "Add tutorials, set your available times and manage your upcoming SilverHands sessions.",
      },
      { property: "og:title", content: "Teach & Share — SilverHands" },
      {
        property: "og:description",
        content:
          "Add tutorials, set your available times and manage your upcoming SilverHands sessions.",
      },
    ],
  }),
  component: TeachAndShare,
});

function TeachAndShare() {
  const db = useDB();
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [editing, setEditing] = useState<Tutorial | null>(null);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [preview, setPreview] = useState<Tutorial | null>(null);
  const [scheduling, setScheduling] = useState<Booking | "new" | null>(null);

  const openNew = () => {
    setEditing(null);
    setTutorialOpen(true);
  };

  const saveTutorial = (t: Tutorial) =>
    update((d) => ({
      ...d,
      tutorials: d.tutorials.some((x) => x.id === t.id)
        ? d.tutorials.map((x) => (x.id === t.id ? t : x))
        : [t, ...d.tutorials],
    }));

  const upcoming = [...db.bookings]
    .filter((b) => bookingState(b) !== "COMPLETED" && bookingState(b) !== "EXPIRED")
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-4xl font-semibold sm:text-5xl">Teach &amp; Share</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Share what you know and help others learn from your experience.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={openNew}
            aria-label="Add tutorial"
            className="size-14 rounded-full bg-secondary text-foreground shadow-sm hover:bg-secondary/70"
          >
            <Plus className="!size-6" />
          </Button>
          <Button onClick={openNew} className="h-12 text-base">Add Tutorial</Button>
          <Button
            variant="outline"
            className="h-12 text-base"
            onClick={() => setAvailabilityOpen(true)}
          >
            Manage Availability
          </Button>
        </div>
      </div>

      {/* Tutorials */}
      <section className="mt-12" aria-labelledby="tutorials-heading">
        <h2 id="tutorials-heading" className="text-2xl font-semibold">Your tutorials</h2>
        {db.tutorials.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-lg">You haven't shared a tutorial yet.</p>
            <Button className="mt-4 h-12 text-base" onClick={openNew}>Add your first tutorial</Button>
          </div>
        ) : (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {db.tutorials.map((t) => (
              <li key={t.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-secondary">
                  {t.thumbnailUrl ? (
                    <img src={t.thumbnailUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="px-4 text-center text-sm text-muted-foreground">No thumbnail yet</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{t.title}</h3>
                <p className="mt-1 text-base text-muted-foreground">{t.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-base">
                  <Badge variant="secondary">{t.durationMin} min</Badge>
                  <Badge variant="secondary">{priceLabel(t.priceCents)}</Badge>
                  <Badge
                    className={
                      t.status === "Published"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }
                  >
                    {t.status}
                  </Badge>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="h-11 text-base"
                    onClick={() => {
                      setEditing(t);
                      setTutorialOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" className="h-11 text-base" onClick={() => setPreview(t)}>
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 text-base"
                    onClick={() =>
                      update((d) => ({
                        ...d,
                        tutorials: d.tutorials.map((x) =>
                          x.id === t.id
                            ? { ...x, status: x.status === "Published" ? "Unpublished" : "Published" }
                            : x,
                        ),
                      }))
                    }
                  >
                    {t.status === "Published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-11 text-base text-destructive hover:text-destructive"
                    onClick={() =>
                      update((d) => ({ ...d, tutorials: d.tutorials.filter((x) => x.id !== t.id) }))
                    }
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Availability */}
      <section className="mt-14" aria-labelledby="availability-heading">
        <h2 id="availability-heading" className="text-2xl font-semibold">Your availability</h2>
        {db.availability.length === 0 ? (
          <p className="mt-3 text-lg text-muted-foreground">
            Set your available times so people can book a conversation with you.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[...db.availability]
              .sort((a, b) => a.weekday - b.weekday || toMinutes(a.start) - toMinutes(b.start))
              .map((s) => (
                <li key={s.id} className="rounded-xl border border-border bg-card px-5 py-4 text-base">
                  <span className="font-semibold">{WEEKDAYS[s.weekday]}</span>{" "}
                  {formatTime(s.start)} – {formatTime(s.end)}
                  <span className="block text-sm text-muted-foreground">
                    {s.kind === "discovery" ? "Free 30-minute conversations" : "Paid or tutorial sessions"}
                  </span>
                </li>
              ))}
          </ul>
        )}
        <Button
          variant="outline"
          className="mt-4 h-12 text-base"
          onClick={() => setAvailabilityOpen(true)}
        >
          Manage Availability
        </Button>
      </section>

      {/* Upcoming sessions */}
      <section className="mt-14" aria-labelledby="sessions-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="sessions-heading" className="text-2xl font-semibold">Upcoming sessions</h2>
          <Button variant="outline" className="h-12 text-base" onClick={() => setScheduling("new")}>
            <CalendarClock /> Schedule a learning session
          </Button>
        </div>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-lg text-muted-foreground">You have no upcoming sessions.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {upcoming.map((b) => {
              const state = bookingState(b);
              return (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4"
                >
                  <div className="text-base">
                    <p className="text-lg font-semibold">{b.buyerName}</p>
                    <p className="text-muted-foreground">
                      {b.kind === "discovery" ? "Free 30-minute conversation" : "Learning session"} ·{" "}
                      {formatDate(b.date)} · {formatTime(b.start)} – {formatTime(b.end)}
                    </p>
                    {b.purpose && <p className="text-muted-foreground">{b.purpose}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={state === "CANCELLED" ? "secondary" : "outline"}>{state}</Badge>
                    {isJoinable(b) && b.status === "CONFIRMED" && (
                      <Button asChild className="h-11 text-base">
                        <Link to="/meeting/$bookingId" params={{ bookingId: b.id }} search={{ from: "/seller/teach-and-share" }}>Join</Link>
                      </Button>
                    )}
                    <Button asChild variant="outline" className="h-11 text-base">
                      <Link to="/meeting/$bookingId" params={{ bookingId: b.id }} search={{ from: "/seller/teach-and-share" }}>View</Link>
                    </Button>
                    {b.status === "CONFIRMED" && (
                      <>
                        <Button
                          variant="outline"
                          className="h-11 text-base"
                          onClick={() => setScheduling(b)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="ghost"
                          className="h-11 text-base text-destructive hover:text-destructive"
                          onClick={() =>
                            update((d) => ({
                              ...d,
                              bookings: d.bookings.map((x) =>
                                x.id === b.id ? { ...x, status: "CANCELLED" } : x,
                              ),
                            }))
                          }
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <TutorialDialog
        open={tutorialOpen}
        onOpenChange={setTutorialOpen}
        tutorial={editing}
        onSave={saveTutorial}
      />
      <AvailabilityDialog
        open={availabilityOpen}
        onOpenChange={setAvailabilityOpen}
        slots={db.availability}
      />
      <SessionScheduleDialog booking={scheduling} onClose={() => setScheduling(null)} />

      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{preview?.title}</DialogTitle>
            <DialogDescription className="text-base">{preview?.description}</DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="space-y-5 text-base">
              <p className="text-muted-foreground">
                {preview.durationMin} min · {preview.difficulty} · {preview.language} ·{" "}
                {priceLabel(preview.priceCents)}
              </p>
              {preview.learnings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">What you'll learn</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-6">
                    {preview.learnings.map((l) => <li key={l}>{l}</li>)}
                  </ul>
                </div>
              )}
              {preview.steps.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Steps</h3>
                  <ol className="mt-2 space-y-3">
                    {preview.steps.map((s, i) => (
                      <li key={s.id} className="rounded-lg border border-border p-4">
                        <p className="font-semibold">{i + 1}. {s.title}</p>
                        <p className="text-muted-foreground">{s.description}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SessionScheduleDialog({
  booking,
  onClose,
}: {
  booking: Booking | "new" | null;
  onClose: () => void;
}) {
  const db = useDB();
  const existing = booking && booking !== "new" ? booking : null;
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    buyerName: "",
    date: "",
    start: "10:00",
    end: "11:00",
    purpose: "",
  });

  const open = booking !== null;

  function submit() {
    const data = {
      buyerName: form.buyerName || existing?.buyerName || "Learner",
      date: form.date || existing?.date || "",
      start: form.start,
      end: form.end,
      purpose: form.purpose || existing?.purpose || "Learning session",
    };
    if (!data.date) {
      setError("Please choose a date for the session.");
      return;
    }
    if (toMinutes(data.end) <= toMinutes(data.start)) {
      setError("The end time needs to be later than the start time.");
      return;
    }
    const clash = db.bookings.some(
      (b) =>
        b.id !== existing?.id &&
        b.status === "CONFIRMED" &&
        b.date === data.date &&
        toMinutes(b.start) < toMinutes(data.end) &&
        toMinutes(data.start) < toMinutes(b.end),
    );
    if (clash) {
      setError("You already have a session at that time.");
      return;
    }
    update((d) => ({
      ...d,
      bookings: existing
        ? d.bookings.map((b) => (b.id === existing.id ? { ...b, ...data } : b))
        : [
            ...d.bookings,
            {
              id: Math.random().toString(36).slice(2, 10),
              kind: "session" as const,
              sellerName: d.profile.name,
              status: "CONFIRMED" as const,
              meetingId: Math.random().toString(36).slice(2, 10),
              ...data,
            },
          ],
    }));
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {existing ? "Reschedule session" : "Schedule a learning session"}
          </DialogTitle>
          <DialogDescription className="text-base">
            You choose the date and length for paid and tutorial sessions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s-buyer" className="text-base">Learner</Label>
            <Input
              id="s-buyer"
              className="h-12 text-base"
              placeholder={existing?.buyerName ?? "Their name"}
              value={form.buyerName}
              onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="s-date" className="text-base">Date</Label>
              <Input
                id="s-date"
                type="date"
                className="h-12 text-base"
                value={form.date || existing?.date || ""}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-start" className="text-base">Start</Label>
              <Input
                id="s-start"
                type="time"
                className="h-12 text-base"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-end" className="text-base">End</Label>
              <Input
                id="s-end"
                type="time"
                className="h-12 text-base"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-desc" className="text-base">Description</Label>
            <Textarea
              id="s-desc"
              className="text-base"
              placeholder={existing?.purpose ?? "What you'll cover together"}
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
          </div>
          {error && <p role="alert" className="text-base font-medium text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button className="h-12 text-base" onClick={submit}>Save session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
