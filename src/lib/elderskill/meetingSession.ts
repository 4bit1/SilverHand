import { supabase } from "@/integrations/supabase/client";

import { bookingEnd, bookingStart, type Booking } from "./store";

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

/** Read the shared session record for a meeting link. */
export async function fetchSession(meetingId: string): Promise<MeetingSession | null> {
  const { data, error } = await supabase
    .from("meeting_sessions")
    .select("id, purpose, host_name, guest_name, started_at, ends_at, status, ended_at")
    .eq("id", meetingId)
    .maybeSingle();
  if (error) throw error;
  return data as MeetingSession | null;
}

/**
 * The participant who holds the booking opens the session; the other side
 * simply joins the record that already exists.
 */
export async function openSession(booking: Booking): Promise<MeetingSession> {
  const existing = await fetchSession(booking.id);
  if (existing) return existing;

  const start = bookingStart(booking);
  const end = bookingEnd(booking);
  const now = Date.now();
  const startedAt = new Date(Math.max(start.getTime(), now)).toISOString();

  const { data, error } = await supabase
    .from("meeting_sessions")
    .insert({
      id: booking.id,
      purpose: booking.purpose,
      host_name: booking.sellerName,
      guest_name: booking.buyerName,
      started_at: startedAt,
      ends_at: end.toISOString(),
      status: "ACTIVE",
    })
    .select("id, purpose, host_name, guest_name, started_at, ends_at, status, ended_at")
    .single();

  if (error) {
    // Someone else created it in the same moment — read theirs.
    const raced = await fetchSession(booking.id);
    if (raced) return raced;
    throw error;
  }
  return data as MeetingSession;
}

export async function endSession(meetingId: string) {
  await supabase
    .from("meeting_sessions")
    .update({ status: "COMPLETED", ended_at: new Date().toISOString() })
    .eq("id", meetingId);
}
