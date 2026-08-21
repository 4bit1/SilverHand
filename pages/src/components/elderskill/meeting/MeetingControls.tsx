import { Mic, MicOff, Video, VideoOff } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MeetingControls({
  micOn,
  cameraOn,
  disabled,
  onToggleMic,
  onToggleCamera,
  onLeave,
}: {
  micOn: boolean;
  cameraOn: boolean;
  disabled: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-between">
      <div className="flex gap-3">
        <Button
          type="button"
          variant={micOn ? "outline" : "secondary"}
          className="h-14 min-w-14 text-base"
          disabled={disabled}
          aria-pressed={!micOn}
          aria-label={micOn ? "Turn microphone off" : "Turn microphone on"}
          onClick={onToggleMic}
        >
          {micOn ? <Mic className="h-5 w-5" aria-hidden /> : <MicOff className="h-5 w-5" aria-hidden />}
          <span className="ml-2 hidden sm:inline">{micOn ? "Microphone on" : "Microphone off"}</span>
        </Button>

        <Button
          type="button"
          variant={cameraOn ? "outline" : "secondary"}
          className="h-14 min-w-14 text-base"
          disabled={disabled}
          aria-pressed={!cameraOn}
          aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
          onClick={onToggleCamera}
        >
          {cameraOn ? (
            <Video className="h-5 w-5" aria-hidden />
          ) : (
            <VideoOff className="h-5 w-5" aria-hidden />
          )}
          <span className="ml-2 hidden sm:inline">{cameraOn ? "Camera on" : "Camera off"}</span>
        </Button>
      </div>

      <Button type="button" variant="outline" className="h-14 text-base" onClick={onLeave}>
        Leave conversation
      </Button>
    </div>
  );
}
