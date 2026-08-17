import type { CallState } from "@/lib/elderskill/useWebRTCMeeting";

export function statusLabel(state: CallState, otherName: string) {
  switch (state) {
    case "initializing":
      return "Joining conversation…";
    case "waiting-for-permission":
      return "Waiting for camera and microphone permission…";
    case "waiting-for-participant":
      return `Waiting for ${otherName} to join…`;
    case "connecting":
      return "Connecting…";
    case "connected":
      return "Connected";
    case "reconnecting":
      return "Reconnecting…";
    case "participant-left":
      return `${otherName} has left the conversation.`;
    case "permission-denied":
      return "Camera and microphone access is needed.";
    case "room-full":
      return "This conversation already has two participants.";
    case "ended":
      return "This conversation has ended.";
    default:
      return "Something went wrong.";
  }
}

export function MeetingStatus({ state, otherName }: { state: CallState; otherName: string }) {
  return (
    <p className="text-base text-muted-foreground" aria-live="polite">
      {statusLabel(state, otherName)}
    </p>
  );
}
