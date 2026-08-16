import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  WEEKDAYS,
  formatTime,
  slotStartsOverlap,
  toMinutes,
  uid,
  update,
  type AvailabilitySlot,
  type SlotKind,
} from "@/lib/elderskill/store";

export function AvailabilityDialog({
  open,
  onOpenChange,
  slots,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  slots: AvailabilitySlot[];
}) {
  const [weekday, setWeekday] = useState("2");
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("12:00");
  const [kind, setKind] = useState<SlotKind>("discovery");
  const [error, setError] = useState<string | null>(null);

  function addSlot() {
    const candidate: AvailabilitySlot = {
      id: uid(),
      weekday: Number(weekday),
      start,
      end,
      kind,
    };
    if (toMinutes(end) <= toMinutes(start)) {
      setError("The end time needs to be later than the start time.");
      return;
    }
    if (kind === "discovery" && toMinutes(end) - toMinutes(start) < 30) {
      setError("Free conversations are 30 minutes, so please allow at least half an hour.");
      return;
    }
    if (slots.some((s) => slotStartsOverlap(s, candidate))) {
      setError("That time overlaps a time you have already set. Please pick another.");
      return;
    }
    setError(null);
    update((db) => ({ ...db, availability: [...db.availability, candidate] }));
  }

  const grouped = [...slots].sort(
    (a, b) => a.weekday - b.weekday || toMinutes(a.start) - toMinutes(b.start),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Manage availability</DialogTitle>
          <DialogDescription className="text-base">
            These times repeat every week. People can only book inside them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-base">Day</Label>
              <Select value={weekday} onValueChange={setWeekday}>
                <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map((d, i) => (
                    <SelectItem key={d} value={String(i)}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-base">Type of time</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as SlotKind)}>
                <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Free 30-minute conversations</SelectItem>
                  <SelectItem value="session">Paid or tutorial sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-start" className="text-base">Start time</Label>
              <Input
                id="a-start"
                type="time"
                className="h-12 text-base"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-end" className="text-base">End time</Label>
              <Input
                id="a-end"
                type="time"
                className="h-12 text-base"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-base font-medium text-destructive">{error}</p>
          )}

          <Button className="h-12 w-full text-base" onClick={addSlot}>
            Add this time
          </Button>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Your weekly times</h3>
            {grouped.length === 0 && (
              <p className="text-base text-muted-foreground">
                Set your available times so people can book a conversation with you.
              </p>
            )}
            <ul className="space-y-2">
              {grouped.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
                >
                  <span className="text-base">
                    <span className="font-semibold">{WEEKDAYS[s.weekday]}</span>{" "}
                    {formatTime(s.start)} – {formatTime(s.end)}
                    <span className="block text-sm text-muted-foreground">
                      {s.kind === "discovery" ? "Free 30-minute conversations" : "Paid or tutorial sessions"}
                    </span>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${WEEKDAYS[s.weekday]} ${formatTime(s.start)}`}
                    onClick={() =>
                      update((db) => ({
                        ...db,
                        availability: db.availability.filter((x) => x.id !== s.id),
                      }))
                    }
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
