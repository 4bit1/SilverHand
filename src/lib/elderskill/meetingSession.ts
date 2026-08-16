import { bookingEnd, bookingStart, type Booking } from "./store";
import {
  endMeetingSession,
  getMeetingSession,
  openMeetingSession,
} from "./meetingSession.functions";

export interface MeetingSession {
  id: string;
  purpose: string;
  host_name: string;
  guest_name: string;
  started_at: string;
  ends_at: string;
  status: string;
  ended_at: string | null;
}

/** Read the shared session record for a meeting link (server-side, link-scoped). */
export async function fetchSession(meetingId: string): Promise<MeetingSession | null> {
  const data = await getMeetingSession({ data: { meetingId } });
  return (data as MeetingSession | null) ?? null;
}

/**
 * The participant who holds the booking opens the session; the other side
 * simply joins the record that already exists.
 */
export async function openSession(booking: Booking): Promise<MeetingSession> {
  const start = bookingStart(booking);
  const end = bookingEnd(booking);
  const startedAt = new Date(Math.max(start.getTime(), Date.now())).toISOString();

  const data = await openMeetingSession({
    data: {
      meetingId: booking.id,
      purpose: booking.purpose ?? "",
      hostName: booking.sellerName,
      guestName: booking.buyerName,
      startedAt,
      endsAt: end.toISOString(),
    },
  });
  return data as MeetingSession;
}

export async function endSession(meetingId: string) {
  await endMeetingSession({ data: { meetingId } });
}
