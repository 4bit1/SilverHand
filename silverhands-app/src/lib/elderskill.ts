/**
 * ElderSkill integration client.
 *
 * ElderSkill is a separate application (FastAPI on :8000) that owns
 * the entire voice interview experience. Silver Hands only needs to:
 *   1. Redirect users TO ElderSkill for auth + voice interview
 *   2. Fetch profile data FROM ElderSkill after completion
 *
 * No synthetic user creation. No embedded voice UI. No duplicated auth.
 */

export type ESProfile = {
  id?: string;
  email?: string;
  full_name?: string;
  profile?: {
    summary?: string;
    primary_skill?: string;
    location_city?: string;
    years_of_experience?: number;
    profile_completeness?: number;
    interview_count?: number;
  };
  skills?: Array<{ skill_name: string }>;
};

function baseUrl(): string {
  return (import.meta as any).env?.VITE_VOICE_API || "http://localhost:8000";
}

/**
 * Fetch a user's complete profile from ElderSkill by their user ID.
 * Used by the callback handler after the user returns from ElderSkill.
 */
export async function fetchProfileByUserId(userId: string): Promise<ESProfile | null> {
  try {
    const res = await fetch(`${baseUrl()}/api/auth/users/${userId}`);
    if (!res.ok) return null;
    const j = await res.json();
    return j?.data ?? null;
  } catch (e) {
    console.error("ElderSkill profile fetch failed:", e);
    return null;
  }
}

/**
 * Build the URL to ElderSkill's auth page with a return_to callback.
 */
export function authUrl(callbackUrl: string): string {
  return `${baseUrl()}/auth?return_to=${encodeURIComponent(callbackUrl)}`;
}

export default { fetchProfileByUserId, authUrl };
