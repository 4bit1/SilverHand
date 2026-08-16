import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { MeetingControls } from "@/components/elderskill/meeting/MeetingControls";
import { MeetingStatus } from "@/components/elderskill/meeting/MeetingStatus";
import { VideoStage } from "@/components/elderskill/meeting/VideoStage";
import {
  endSession,
  fetchSession,
  openSession,
  type MeetingSession,
} from "@/lib/elderskill/meetingSession";
import { formatDate, formatTime, useDB } from "@/lib/elderskill/store";
import { useWebRTCMeeting } from "@/lib/elderskill/useWebRTCMeeting";

export const Route = createFileRoute("/meeting/$bookingId")({
  ssr: false,
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

type Access =
  | { kind: "loading" }
  | { kind: "not-found" }
  | { kind: "error" }
  | { kind: "ended" }
  | { kind: "ok"; session: MeetingSession; role: "host" | "guest" };

function Meeting() {
  const { bookingId } = Route.useParams();
  const db = useDB();
  const navigate = useNavigate();
  const now = useNow();

  const booking = db.bookings.find((b) => b.id === bookingId);
  const [access, setAccess] = useState<Access>({ kind: "loading" });
  const resolvedFor = useRef<string | null>(null);

  /* Resolve the shared meeting record for this link. */
  useEffect(() => {
    let cancelled = false;


    (async () => {
      try {
        // The participant holding the booking opens the session; the other
        // side joins the record that already exists behind the same link.
        const session = booking ? await openSession(booking) : await fetchSession(bookingId);
        if (cancelled) return;
        if (!session) {
          setAccess({ kind: "not-found" });
          return;
        }
        if (session.status !== "ACTIVE" || new Date(session.ends_at).getTime() <= Date.now()) {
          setAccess({ kind: "ended" });
          return;
        }
        setAccess({ kind: "ok", session, role: booking ? "host" : "guest" });
      } catch (err) {
        console.error("[meeting] failed to load session", err);
        if (!cancelled) setAccess({ kind: "error" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookingId, booking]);

  const session = access.kind === "ok" ? access.session : null;
  const role = access.kind === "ok" ? access.role : null;
  const selfName = session
    ? role === "host"
      ? session.host_name
      : session.guest_name
    : "Participant";
  const expectedOther = session
    ? role === "host"
      ? session.guest_name
      : session.host_name
    : "the other participant";

  const call = useWebRTCMeeting({
    meetingId: bookingId,
    selfName,
    enabled: Boolean(session),
  });

  const [timeUp, setTimeUp] = useState(false);
  const leaveRef = useRef(call.leave);
  leaveRef.current = call.leave;

  /* Shared countdown, driven by the session record. */
  const msLeft = session
    ? Math.max(0, new Date(session.ends_at).getTime() - now.getTime())
    : 0;

  useEffect(() => {
    if (!session || timeUp) return;
    if (msLeft > 0) return;
    setTimeUp(true);
    leaveRef.current();
    void endSession(session.id);
  }, [msLeft, session, timeUp]);

  const handleLeave = useCallback(() => {
    call.leave();
    void navigate({ to: "/their-expertise" });
  }, [call, navigate]);

  if (access.kind === "loading") {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold">Joining conversation…</h1>
      </Shell>
    );
  }

  if (access.kind === "not-found") {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold">Meeting not found.</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          We couldn't find this conversation, or you don't have access to it.
        </p>
        <Button asChild className="mt-6 h-14 text-base">
          <Link to="/their-expertise">Back to sessions</Link>
        </Button>
      </Shell>
    );
  }

  if (access.kind === "error") {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold">We couldn't open this conversation.</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Please check your connection and try again.
        </p>
        <Button className="mt-6 h-14 text-base" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </Shell>
    );
  }

  if (access.kind === "ended" || timeUp || call.state === "ended") {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold">This conversation has ended.</h1>
        <Button asChild className="mt-6 h-14 text-base">
          <Link to="/their-expertise">Back to sessions</Link>
        </Button>
      </Shell>
    );
  }

  if (call.state === "room-full") {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold">You are not authorized to join this meeting.</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          This conversation already has its two participants.
        </p>
        <Button asChild className="mt-6 h-14 text-base">
          <Link to="/their-expertise">Back to sessions</Link>
        </Button>
      </Shell>
    );
  }

  if (call.state === "permission-denied" || call.state === "error") {
    return (
      <Shell>
        <h1 className="text-3xl font-semibold">We need your camera and microphone.</h1>
        <p className="mt-3 text-lg text-muted-foreground">{call.errorMessage}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button className="h-14 text-base" onClick={call.retry}>
            Try again
          </Button>
          <Button asChild variant="outline" className="h-14 text-base">
            <Link to="/their-expertise">Back to sessions</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  const mm = String(Math.floor(msLeft / 60000)).padStart(2, "0");
  const ss = String(Math.floor((msLeft % 60000) / 1000)).padStart(2, "0");
  const otherName = call.remoteName ?? expectedOther;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold sm:text-4xl">Conversation with {otherName}</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        {session!.purpose ||
          (booking
            ? `${formatDate(booking.date)} at ${formatTime(booking.start)}`
            : "Live conversation")}
      </p>

      <div className="mt-6">
        <VideoStage
          localStream={call.localStream}
          remoteStream={call.remoteStream}
          remoteName={otherName}
          remoteVideoOn={call.remoteVideoOn}
          cameraOn={call.cameraOn}
          statusOverlay={<MeetingStatus state={call.state} otherName={otherName} />}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
        <MeetingStatus state={call.state} otherName={otherName} />
        <p className="text-2xl font-semibold tabular-nums">
          {mm}:{ss}{" "}
          <span className="text-base font-normal text-muted-foreground">remaining</span>
        </p>
      </div>

      <MeetingControls
        micOn={call.micOn}
        cameraOn={call.cameraOn}
        disabled={!call.localStream}
        onToggleMic={call.toggleMic}
        onToggleCamera={call.toggleCamera}
        onLeave={handleLeave}
      />
    </div>
  );
}
