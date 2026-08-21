import { useEffect, useRef } from "react";
import { VideoOff } from "lucide-react";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function StreamVideo({
  stream,
  muted,
  className,
}: {
  stream: MediaStream | null;
  muted: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.srcObject !== stream) el.srcObject = stream;
    if (stream) void el.play().catch(() => undefined);
  }, [stream]);

  return <video ref={ref} autoPlay playsInline muted={muted} className={className} />;
}

function CameraOff({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-secondary">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-2xl font-semibold text-primary">
        {initials(name)}
      </div>
      <p className="flex items-center gap-2 text-base text-muted-foreground">
        <VideoOff className="h-4 w-4" aria-hidden /> Camera off
      </p>
      <p className="text-lg font-medium">{name}</p>
    </div>
  );
}

export function VideoStage({
  localStream,
  remoteStream,
  remoteName,
  remoteVideoOn,
  cameraOn,
  statusOverlay,
}: {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  remoteName: string;
  remoteVideoOn: boolean;
  cameraOn: boolean;
  statusOverlay?: React.ReactNode;
}) {
  const showRemote = Boolean(remoteStream) && remoteVideoOn;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-secondary">
      {remoteStream ? (
        <StreamVideo
          stream={remoteStream}
          muted={false}
          className={`h-full w-full object-cover ${showRemote ? "" : "invisible"}`}
        />
      ) : null}

      {remoteStream && !remoteVideoOn ? <CameraOff name={remoteName} /> : null}

      {!remoteStream && statusOverlay ? (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          {statusOverlay}
        </div>
      ) : null}

      {remoteStream ? (
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-sm font-medium">
          {remoteName}
        </span>
      ) : null}

      <div className="absolute bottom-3 right-3 w-28 overflow-hidden rounded-xl border border-border bg-background shadow-md sm:w-44">
        <div className="relative aspect-video">
          <StreamVideo
            stream={localStream}
            muted
            className={`h-full w-full object-cover ${cameraOn ? "" : "invisible"}`}
          />
          {!cameraOn ? (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
              <VideoOff className="h-5 w-5 text-muted-foreground" aria-hidden />
            </div>
          ) : null}
          <span className="absolute bottom-1 left-1 rounded bg-background/80 px-1.5 text-xs font-medium">
            You
          </span>
        </div>
      </div>
    </div>
  );
}
