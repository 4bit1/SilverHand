import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { signIn, completeOnboarding } from "@/lib/store";
import { fetchProfileByUserId } from "@/lib/elderskill";

/**
 * ElderSkill callback handler.
 *
 * This route is hit when ElderSkill redirects back to Silver Hands after
 * the user completes auth + voice interview. The flow:
 *
 *   ElderSkill (interview complete)
 *     → /elder/callback?elderskill_user_id=<uuid>
 *     → fetch profile from ElderSkill API
 *     → map to Silver Hands seller profile (localStorage)
 *     → signIn + completeOnboarding
 *     → redirect to /seller
 */
export const Route = createFileRoute("/elder/callback")({
  head: () => ({ meta: [{ title: "Syncing your profile…" }] }),
  component: ElderCallback,
});

function ElderCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handle() {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("elderskill_user_id");

      // Recover the name the user entered on Silver Hands before leaving
      const pendingName = window.localStorage.getItem("silverhands.pending_name") || "Seller";

      if (!userId) {
        // No user ID — something went wrong. Send back to login.
        navigate({ to: "/login", search: { role: "seller" } });
        return;
      }

      // ── 1. Store the stable ElderSkill identity mapping ──
      try {
        window.localStorage.setItem("silverhands.elderskill_user_id", userId);
      } catch {}

      // ── 2. Fetch profile from ElderSkill API ──
      let profileName = pendingName;
      try {
        const profile = await fetchProfileByUserId(userId);

        if (profile) {
          // Use ElderSkill's name if available
          if (profile.full_name) profileName = profile.full_name;

          // Map ElderSkill profile fields → Silver Hands profile format
          const shProfile: Record<string, string> = {
            about: profile.profile?.summary || "",
            skills: profile.profile?.primary_skill || "",
            location: profile.profile?.location_city || "",
            languages: "",
          };

          // Merge with any existing Silver Hands profile (don't overwrite
          // unrelated fields that the user may have filled manually)
          try {
            const existingRaw = window.localStorage.getItem("silverhands.profile");
            if (existingRaw) {
              const existing = JSON.parse(existingRaw);
              for (const [key, value] of Object.entries(shProfile)) {
                // Only overwrite if ElderSkill actually has data for this field
                if (value) {
                  existing[key] = value;
                }
              }
              window.localStorage.setItem("silverhands.profile", JSON.stringify(existing));
            } else {
              window.localStorage.setItem("silverhands.profile", JSON.stringify(shProfile));
            }
          } catch {
            window.localStorage.setItem("silverhands.profile", JSON.stringify(shProfile));
          }

          // Store ElderSkill email for reference
          if (profile.email) {
            try {
              window.localStorage.setItem("silverhands.elderskill_email", profile.email);
            } catch {}
          }
        }
      } catch (e) {
        console.warn("Failed to fetch ElderSkill profile — proceeding with local data:", e);
      }

      // ── 3. Establish Silver Hands session ──
      signIn(profileName, "seller");
      completeOnboarding();

      // ── 4. Cleanup ──
      try {
        window.localStorage.removeItem("silverhands.pending_name");
      } catch {}

      // ── 5. Redirect to Silver Hands Seller View ──
      navigate({ to: "/seller" });
    }

    handle();
  }, [navigate]);

  // Brief loading state while the profile sync happens
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="mx-auto size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Syncing your profile from ElderSkill…</p>
      </div>
    </div>
  );
}
