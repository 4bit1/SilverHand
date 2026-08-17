import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

/**
 * Legacy route — the embedded voice interview has been removed.
 *
 * The voice experience is now entirely owned by ElderSkill (separate app).
 * If a user somehow reaches this route, redirect them to ElderSkill's
 * auth page so they can go through the real voice application.
 */
export const Route = createFileRoute("/seller/interview")({
  head: () => ({ meta: [{ title: "Redirecting to SilverHands..." }] }),
  component: SellerInterviewRedirect,
});

function SellerInterviewRedirect() {
  useEffect(() => {
    const base = (import.meta as any).env?.VITE_VOICE_API || "http://localhost:8000";
    const callbackUrl = `${window.location.origin}/elder/callback`;
    window.location.href = `${base}/auth?return_to=${encodeURIComponent(callbackUrl)}`;
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-muted-foreground">Redirecting to SilverHands voice application…</p>
    </div>
  );
}
