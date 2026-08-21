import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SELECT = "id, purpose, host_name, guest_name, started_at, ends_at, status, ended_at";

const idSchema = z.object({ meetingId: z.string().min(6).max(64) });

const openSchema = z.object({
  meetingId: z.string().min(6).max(64),
  purpose: z.string().max(200).default(""),
  hostName: z.string().min(1).max(80),
  guestName: z.string().min(1).max(80),
  startedAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});

export const getMeetingSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("meeting_sessions")
      .select(SELECT)
      .eq("id", data.meetingId)
      .maybeSingle();
    if (error) {
      console.error("[meeting] fetch failed", error);
      throw new Error("Unable to load this conversation.");
    }
    return row ?? null;
  });

export const openMeetingSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => openSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const existing = await supabaseAdmin
      .from("meeting_sessions")
      .select(SELECT)
      .eq("id", data.meetingId)
      .maybeSingle();
    if (existing.data) return existing.data;

    const { data: row, error } = await supabaseAdmin
      .from("meeting_sessions")
      .insert({
        id: data.meetingId,
        purpose: data.purpose,
        host_name: data.hostName,
        guest_name: data.guestName,
        started_at: data.startedAt,
        ends_at: data.endsAt,
        status: "ACTIVE",
      })
      .select(SELECT)
      .single();

    if (error) {
      const raced = await supabaseAdmin
        .from("meeting_sessions")
        .select(SELECT)
        .eq("id", data.meetingId)
        .maybeSingle();
      if (raced.data) return raced.data;
      console.error("[meeting] open failed", error);
      throw new Error("Unable to start this conversation.");
    }
    return row;
  });

export const endMeetingSession = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("meeting_sessions")
      .update({ status: "COMPLETED", ended_at: new Date().toISOString() })
      .eq("id", data.meetingId)
      .eq("status", "ACTIVE");
    if (error) console.error("[meeting] end failed", error);
    return { ok: true };
  });
