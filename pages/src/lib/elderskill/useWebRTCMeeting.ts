import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

/**
 * Real 1-to-1 WebRTC meeting.
 *
 * - Media: getUserMedia + RTCPeerConnection (browser native).
 * - Signalling: Supabase Realtime broadcast + presence on `meeting:{id}`.
 * - Negotiation: deterministic — the peer with the lexicographically greater
 *   peer id creates the offer, the other answers. No glare, no loops.
 */

export type CallState =
  | "initializing"
  | "waiting-for-permission"
  | "permission-denied"
  | "waiting-for-participant"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "participant-left"
  | "room-full"
  | "ended"
  | "error";

export interface MeetingOptions {
  meetingId: string;
  /** Display name broadcast to the other participant. */
  selfName: string;
  /** Whether the meeting record was resolved and the user may join. */
  enabled: boolean;
}

interface PresenceMeta {
  peerId: string;
  name: string;
  joinedAt: number;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ],
};

const newPeerId = () => Math.random().toString(36).slice(2, 12);

export function useWebRTCMeeting({ meetingId, selfName, enabled }: MeetingOptions) {
  const [state, setState] = useState<CallState>("initializing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [remoteName, setRemoteName] = useState<string | null>(null);
  const [remoteVideoOn, setRemoteVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [retryToken, setRetryToken] = useState(0);

  const peerIdRef = useRef<string>(newPeerId());
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remotePeerRef = useRef<string | null>(null);
  const makingOfferRef = useRef(false);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const leftRef = useRef(false);

  /* ---------- teardown ---------- */

  const closePeer = useCallback(() => {
    const pc = pcRef.current;
    pcRef.current = null;
    if (pc) {
      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.onconnectionstatechange = null;
      try {
        pc.close();
      } catch {
        /* already closed */
      }
    }
    pendingIceRef.current = [];
    makingOfferRef.current = false;
    setRemoteStream(null);
  }, []);

  const stopLocalMedia = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
  }, []);

  const leave = useCallback(() => {
    leftRef.current = true;
    const channel = channelRef.current;
    channelRef.current = null;
    if (channel) {
      try {
        channel.send({
          type: "broadcast",
          event: "signal",
          payload: { from: peerIdRef.current, kind: "bye" },
        });
      } catch {
        /* channel already gone */
      }
      supabase.removeChannel(channel);
    }
    closePeer();
    stopLocalMedia();
    remotePeerRef.current = null;
  }, [closePeer, stopLocalMedia]);

  const retry = useCallback(() => {
    leftRef.current = false;
    setErrorMessage(null);
    setState("initializing");
    setRetryToken((n) => n + 1);
  }, []);

  /* ---------- main lifecycle ---------- */

  useEffect(() => {
    if (!enabled || !meetingId) return;
    leftRef.current = false;
    peerIdRef.current = newPeerId();

    let cancelled = false;
    let channel: RealtimeChannel | null = null;

    const send = (payload: Record<string, unknown>) => {
      channelRef.current?.send({
        type: "broadcast",
        event: "signal",
        payload: { from: peerIdRef.current, ...payload },
      });
    };

    const ensurePeer = () => {
      if (pcRef.current) return pcRef.current;
      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      localStreamRef.current
        ?.getTracks()
        .forEach((track) => pc.addTrack(track, localStreamRef.current!));

      pc.onicecandidate = (e) => {
        if (e.candidate) send({ kind: "ice", candidate: e.candidate.toJSON() });
      };

      pc.ontrack = (e) => {
        const [stream] = e.streams;
        if (stream) setRemoteStream(stream);
      };

      pc.onconnectionstatechange = () => {
        if (leftRef.current) return;
        switch (pc.connectionState) {
          case "connected":
            setState("connected");
            break;
          case "connecting":
            setState((s) => (s === "connected" ? s : "connecting"));
            break;
          case "disconnected":
            setState("reconnecting");
            break;
          case "failed":
            setState("reconnecting");
            // Full ICE restart — the impolite peer drives it.
            if (remotePeerRef.current && peerIdRef.current > remotePeerRef.current) {
              void negotiate(true);
            }
            break;
          default:
            break;
        }
      };

      return pc;
    };

    const negotiate = async (iceRestart = false) => {
      const pc = ensurePeer();
      if (makingOfferRef.current) return;
      try {
        makingOfferRef.current = true;
        const offer = await pc.createOffer({ iceRestart });
        await pc.setLocalDescription(offer);
        send({ kind: "offer", sdp: pc.localDescription });
        setState((s) => (s === "connected" ? s : "connecting"));
      } catch (err) {
        console.error("[meeting] negotiation failed", err);
      } finally {
        makingOfferRef.current = false;
      }
    };

    const flushIce = async (pc: RTCPeerConnection) => {
      const queued = pendingIceRef.current;
      pendingIceRef.current = [];
      for (const c of queued) {
        try {
          await pc.addIceCandidate(c);
        } catch (err) {
          console.warn("[meeting] ice candidate rejected", err);
        }
      }
    };

    const start = async () => {
      // 1. Local media
      setState("waiting-for-permission");
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err) {
        const name = (err as DOMException)?.name;
        console.error("[meeting] getUserMedia failed", err);
        if (name === "NotAllowedError" || name === "SecurityError") {
          setErrorMessage(
            "Camera and microphone access is required for video conversations. Please allow access in your browser settings and try again.",
          );
          setState("permission-denied");
        } else if (name === "NotFoundError" || name === "OverconstrainedError") {
          setErrorMessage(
            "We couldn't find a working camera or microphone on this device. Please connect one and try again.",
          );
          setState("error");
        } else {
          setErrorMessage("We couldn't start your camera and microphone. Please try again.");
          setState("error");
        }
        return;
      }
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      localStreamRef.current = stream;
      setLocalStream(stream);
      setMicOn(true);
      setCameraOn(true);
      setState("waiting-for-participant");

      // 2. Signalling channel
      channel = supabase.channel(`meeting:${meetingId}`, {
        config: {
          broadcast: { self: false },
          presence: { key: peerIdRef.current },
        },
      });
      channelRef.current = channel;

      channel.on("broadcast", { event: "signal" }, async ({ payload }) => {
        const msg = payload as {
          from: string;
          kind: string;
          sdp?: RTCSessionDescriptionInit;
          candidate?: RTCIceCandidateInit;
          on?: boolean;
        };
        if (!msg || msg.from === peerIdRef.current) return;
        if (remotePeerRef.current && msg.from !== remotePeerRef.current) return;

        if (msg.kind === "bye") {
          remotePeerRef.current = null;
          closePeer();
          setRemoteVideoOn(true);
          setState("participant-left");
          return;
        }

        if (msg.kind === "video-state") {
          setRemoteVideoOn(Boolean(msg.on));
          return;
        }

        const pc = ensurePeer();

        try {
          if (msg.kind === "offer" && msg.sdp) {
            await pc.setRemoteDescription(msg.sdp);
            await flushIce(pc);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            send({ kind: "answer", sdp: pc.localDescription });
            setState((s) => (s === "connected" ? s : "connecting"));
          } else if (msg.kind === "answer" && msg.sdp) {
            if (pc.signalingState === "have-local-offer") {
              await pc.setRemoteDescription(msg.sdp);
              await flushIce(pc);
            }
          } else if (msg.kind === "ice" && msg.candidate) {
            if (pc.remoteDescription) await pc.addIceCandidate(msg.candidate);
            else pendingIceRef.current.push(msg.candidate);
          }
        } catch (err) {
          console.error("[meeting] signalling error", err);
        }
      });

      channel.on("presence", { event: "sync" }, () => {
        if (leftRef.current) return;
        const stateMap = channel!.presenceState<PresenceMeta>();
        const peers = Object.values(stateMap)
          .flat()
          .filter((p): p is PresenceMeta & { presence_ref: string } => Boolean(p?.peerId))
          .sort((a, b) => a.joinedAt - b.joinedAt || a.peerId.localeCompare(b.peerId));

        const seatIndex = peers.findIndex((p) => p.peerId === peerIdRef.current);
        if (seatIndex > 1) {
          setState("room-full");
          closePeer();
          stopLocalMedia();
          return;
        }

        const other = peers.find((p) => p.peerId !== peerIdRef.current);
        if (!other) {
          if (remotePeerRef.current) {
            remotePeerRef.current = null;
            closePeer();
            setRemoteVideoOn(true);
            setState("participant-left");
          }
          return;
        }

        setRemoteName(other.name);
        if (remotePeerRef.current === other.peerId) return;

        // New (or refreshed) partner — restart the peer connection cleanly.
        remotePeerRef.current = other.peerId;
        closePeer();
        setState("connecting");
        if (peerIdRef.current > other.peerId) void negotiate();
        else ensurePeer();
      });

      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel!.track({
            peerId: peerIdRef.current,
            name: selfName,
            joinedAt: Date.now(),
          } satisfies PresenceMeta);
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          if (!leftRef.current) setState("reconnecting");
        }
      });
    };

    void start();

    return () => {
      cancelled = true;
      leftRef.current = true;
      const ch = channelRef.current;
      channelRef.current = null;
      if (ch) supabase.removeChannel(ch);
      closePeer();
      stopLocalMedia();
      remotePeerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId, enabled, retryToken]);

  /* ---------- controls ---------- */

  const toggleMic = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  }, []);

  const toggleCamera = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
    channelRef.current?.send({
      type: "broadcast",
      event: "signal",
      payload: { from: peerIdRef.current, kind: "video-state", on: track.enabled },
    });
  }, []);

  return {
    state,
    errorMessage,
    localStream,
    remoteStream,
    remoteName,
    remoteVideoOn,
    micOn,
    cameraOn,
    toggleMic,
    toggleCamera,
    leave,
    retry,
  };
}
