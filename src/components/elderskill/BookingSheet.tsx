import { useMemo, useState } from "react";
import { CalendarCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  discoveryOptions,
  formatDate,
  formatTime,
  fromMinutes,
  toMinutes,
  uid,
  update,
  type Booking,
  type DB,
} from "@/lib/elderskill/store";

const BUYER_NAME = "You";

export function BookingSheet({
  open,
  onOpenChange,
  db,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  db: DB;
}) {
  const options = useMemo(() => discoveryOptions(db), [db]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [booked, setBooked] = useState<Booking | null>(null);

  const selectedDay = options.find((o) => o.date === (date ?? options[0]?.date));

  function confirm() {
    if (!selectedDay || !time) return;
    const booking: Booking = {
      id: uid(),
      kind: "discovery",
      buyerName: BUYER_NAME,
      sellerName: db.profile.name,
      date: selectedDay.date,
      start: time,
      end: fromMinutes(toMinutes(time) + 30),
      purpose: "Free 30-minute conversation",
      status: "CONFIRMED",
      meetingId: uid(),
    };
    update((d) => ({ ...d, bookings: [...d.bookings, booking] }));
    setBooked(booking);
  }

  function close(v: boolean) {
    onOpenChange(v);
    if (!v) {
      setBooked(null);
      setTime(null);
      setDate(null);
    }
  }

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-2xl sm:mx-auto sm:max-w-2xl"
      >
        {booked ? (
          <div className="space-y-5 pb-8">
            <SheetHeader className="px-0">
              <SheetTitle className="flex items-center gap-2 font-serif text-2xl">
                <CalendarCheck className="size-6 text-primary" /> Your conversation is booked.
              </SheetTitle>
              <SheetDescription className="text-base">
                We will show it in your upcoming sessions below.
              </SheetDescription>
            </SheetHeader>
            <dl className="grid gap-3 rounded-xl border border-border bg-card p-5 text-base sm:grid-cols-2">
              <div><dt className="text-muted-foreground">With</dt><dd className="font-semibold">{booked.sellerName}</dd></div>
              <div><dt className="text-muted-foreground">Date</dt><dd className="font-semibold">{formatDate(booked.date)}</dd></div>
              <div><dt className="text-muted-foreground">Time</dt><dd className="font-semibold">{formatTime(booked.start)}</dd></div>
              <div><dt className="text-muted-foreground">Length</dt><dd className="font-semibold">30 minutes</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted-foreground">Purpose</dt><dd className="font-semibold">{booked.purpose}</dd></div>
            </dl>
            <Button className="h-14 w-full text-base" onClick={() => close(false)}>Done</Button>
          </div>
        ) : (
          <div className="space-y-6 pb-8">
            <SheetHeader className="px-0">
              <SheetTitle className="font-serif text-2xl">Book a free 30-minute session</SheetTitle>
              <SheetDescription className="text-base">
                Choose a day and a time that {db.profile.name} has opened.
              </SheetDescription>
            </SheetHeader>

            {options.length === 0 ? (
              <p className="text-base text-muted-foreground">
                No free conversation times are available right now.
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Choose a day</h3>
                  <div className="flex flex-wrap gap-2">
                    {options.map((o) => {
                      const active = (date ?? options[0]?.date) === o.date;
                      return (
                        <button
                          key={o.date}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            setDate(o.date);
                            setTime(null);
                          }}
                          className={`min-h-14 rounded-xl border px-4 py-2 text-base transition-colors ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:bg-secondary"
                          }`}
                        >
                          {formatDate(o.date)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Choose a time</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectedDay?.times.map((t) => {
                      const active = time === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setTime(t)}
                          className={`min-h-14 rounded-xl border px-3 text-base font-medium transition-colors ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:bg-secondary"
                          }`}
                        >
                          {formatTime(t)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button className="h-14 w-full text-base" disabled={!time} onClick={confirm}>
                  Confirm booking
                </Button>
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
