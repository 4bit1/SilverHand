import { useEffect, useSyncExternalStore } from "react";

/**
 * Self-contained local data layer for the Teach & Share / Their Expertise
 * features. Persists to localStorage so the flows behave end-to-end without a
 * backend. Swap the read/write helpers for API calls when the real ElderSkill
 * services are wired in.
 */

export type TutorialStatus = "Draft" | "Published" | "Unpublished";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  mediaUrl?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  learnings: string[];
  steps: TutorialStep[];
  durationMin: number;
  difficulty: Difficulty;
  language: string;
  priceCents: number; // 0 === free
  status: TutorialStatus;
}

export type SlotKind = "discovery" | "session";

export interface AvailabilitySlot {
  id: string;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
  start: string; // "10:00"
  end: string; // "12:00"
  kind: SlotKind;
}

export type BookingStatus =
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export type BookingState =
  | "CONFIRMED"
  | "UPCOMING"
  | "JOINABLE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export interface Booking {
  id: string;
  kind: SlotKind;
  buyerName: string;
  sellerName: string;
  /** ISO date "2026-08-21" */
  date: string;
  start: string; // "10:00"
  end: string; // "10:30"
  purpose: string;
  status: BookingStatus;
  meetingId: string;
  tutorialId?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  skill: string;
  price: string;
  availability: string;
}

export interface SellerProfile {
  name: string;
  primarySkill: string;
  experience: string;
  location: string;
  languages: string[];
  verified: boolean;
  bio: string;
  initials: string;
}

export interface DB {
  profile: SellerProfile;
  services: Service[];
  tutorials: Tutorial[];
  availability: AvailabilitySlot[];
  bookings: Booking[];
}

export const uid = () => Math.random().toString(36).slice(2, 10);

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

function nextWeekday(weekday: number, offsetWeeks = 0) {
  const d = new Date();
  const diff = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff + offsetWeeks * 7);
  return isoDate(d);
}

function seed(): DB {
  return {
    profile: {
      name: "Margaret Olsen",
      primarySkill: "Traditional Woodworking",
      experience: "38 years as a furniture maker and workshop teacher",
      location: "Portland, Oregon",
      languages: ["English", "Norwegian"],
      verified: true,
      initials: "MO",
      bio: "I spent most of my life making chairs and tables by hand. These days I enjoy passing the craft on — patiently, and at whatever pace suits you.",
    },
    services: [
      {
        id: uid(),
        name: "Furniture restoration",
        description: "Bring an old piece back to life — repairs, refinishing and honest advice on what is worth saving.",
        skill: "Woodworking",
        price: "$65 / hour",
        availability: "Weekday mornings",
      },
      {
        id: uid(),
        name: "Workshop setup consulting",
        description: "Plan a safe, comfortable home workshop with the right tools for the work you actually do.",
        skill: "Workshop planning",
        price: "$120 flat",
        availability: "By arrangement",
      },
      {
        id: uid(),
        name: "One-to-one hand-tool coaching",
        description: "Learn sharpening, joinery and layout at the bench, one step at a time.",
        skill: "Hand tools",
        price: "$45 / session",
        availability: "Tuesdays & Fridays",
      },
    ],
    tutorials: [
      {
        id: uid(),
        title: "Sharpening a chisel the old way",
        videoUrl: "",
        thumbnailUrl: "",
        description: "A calm, complete walkthrough of putting a working edge on a chisel with simple stones.",
        learnings: ["Reading a bevel", "Flattening the back", "Honing a lasting edge"],
        steps: [
          { id: uid(), title: "Set up your stones", description: "Soak, flatten and lay out your stones so nothing moves while you work." },
          { id: uid(), title: "Flatten the back", description: "Work the back flat until the first inch is evenly polished." },
          { id: uid(), title: "Hone the bevel", description: "Hold a steady angle and take light, even strokes." },
        ],
        durationMin: 24,
        difficulty: "Beginner",
        language: "English",
        priceCents: 0,
        status: "Published",
      },
      {
        id: uid(),
        title: "Cutting a through dovetail by hand",
        videoUrl: "",
        thumbnailUrl: "",
        description: "The joint that makes a drawer last a century, explained without rushing.",
        learnings: ["Marking accurately", "Sawing to a line", "Paring to fit"],
        steps: [
          { id: uid(), title: "Mark the tails", description: "Set your gauge and mark both boards clearly." },
          { id: uid(), title: "Saw the waste", description: "Saw on the waste side of every line." },
        ],
        durationMin: 41,
        difficulty: "Intermediate",
        language: "English",
        priceCents: 1900,
        status: "Published",
      },
      {
        id: uid(),
        title: "Choosing timber at the yard",
        videoUrl: "",
        thumbnailUrl: "",
        description: "What to look for, and what to walk away from.",
        learnings: ["Reading grain", "Spotting movement"],
        steps: [],
        durationMin: 15,
        difficulty: "Beginner",
        language: "English",
        priceCents: 0,
        status: "Draft",
      },
    ],
    availability: [
      { id: uid(), weekday: 2, start: "10:00", end: "12:00", kind: "discovery" },
      { id: uid(), weekday: 5, start: "14:00", end: "16:30", kind: "discovery" },
      { id: uid(), weekday: 3, start: "09:00", end: "12:00", kind: "session" },
    ],
    bookings: [
      {
        id: uid(),
        kind: "session",
        buyerName: "Daniel Reyes",
        sellerName: "Margaret Olsen",
        date: nextWeekday(3),
        start: "09:30",
        end: "10:45",
        purpose: "Dovetail practice — follow-up to the paid tutorial",
        status: "CONFIRMED",
        meetingId: uid(),
      },
    ],
  };
}

const KEY = "elderskill.expertise.v1";

let state: DB = seed();
let hydrated = false;
const subscribers = new Set<() => void>();

function emit() {
  for (const fn of subscribers) fn();
}

function subscribe(fn: () => void) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function commit(next: DB) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — keep in-memory state */
  }
  emit();
}

export function update(fn: (db: DB) => DB) {
  commit(fn(state));
}

export function useDB(): DB {
  const db = useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );

  useEffect(() => {
    if (hydrated) return;
    hydrated = true;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        state = { ...seed(), ...(JSON.parse(raw) as DB) };
        emit();
      }
    } catch {
      /* corrupt storage — keep the seed */
    }
  }, []);

  return db;
}

/* ---------- time helpers ---------- */

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function fromMinutes(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatTime(hhmm: string) {
  const mins = toMinutes(hhmm);
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h24 < 12 ? "AM" : "PM";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function slotStartsOverlap(a: AvailabilitySlot, b: AvailabilitySlot) {
  if (a.weekday !== b.weekday) return false;
  return toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
}

export function bookingStart(b: Booking) {
  return new Date(`${b.date}T${b.start}:00`);
}

export function bookingEnd(b: Booking) {
  return new Date(`${b.date}T${b.end}:00`);
}

/** Deterministic booking state derived from the schedule. */
export function bookingState(b: Booking, now: Date = new Date()): BookingState {
  if (b.status === "CANCELLED") return "CANCELLED";
  if (b.status === "COMPLETED") return "COMPLETED";
  const start = bookingStart(b).getTime();
  const end = bookingEnd(b).getTime();
  const t = now.getTime();
  if (t >= end) return b.kind === "discovery" ? "EXPIRED" : "COMPLETED";
  if (t >= start) return "IN_PROGRESS";
  if (t >= start - 5 * 60 * 1000) return "JOINABLE";
  return "UPCOMING";
}

export function isJoinable(b: Booking, now: Date = new Date()) {
  const s = bookingState(b, now);
  return s === "JOINABLE" || s === "IN_PROGRESS";
}

/** Free 30-minute discovery slots the seller has actually opened, next 21 days. */
export function discoveryOptions(db: DB, days = 21) {
  const out: { date: string; times: string[] }[] = [];
  const taken = new Set(
    db.bookings.filter((b) => b.status === "CONFIRMED").map((b) => `${b.date} ${b.start}`),
  );
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);
    const date = isoDate(d);
    const times: string[] = [];
    for (const slot of db.availability.filter((s) => s.kind === "discovery" && s.weekday === d.getDay())) {
      for (let m = toMinutes(slot.start); m + 30 <= toMinutes(slot.end); m += 30) {
        const hhmm = fromMinutes(m);
        if (taken.has(`${date} ${hhmm}`)) continue;
        if (new Date(`${date}T${hhmm}:00`).getTime() <= now.getTime()) continue;
        times.push(hhmm);
      }
    }
    if (times.length) out.push({ date, times });
  }
  return out;
}

export function priceLabel(cents: number) {
  return cents === 0 ? "Free" : `$${(cents / 100).toFixed(2)}`;
}
