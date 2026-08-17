import { createFileRoute } from "@tanstack/react-router";
import { Camera, RefreshCcw, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/Cards";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchProfileByUserId } from "@/lib/elderskill";

export const Route = createFileRoute("/seller/profile")({
  head: () => ({
    meta: [
      { title: "Seller profile | SilverHands" },
      {
        name: "description",
        content: "Build a profile that shows your experience, languages and craft.",
      },
      { property: "og:title", content: "Seller profile | SilverHands" },
      { property: "og:description", content: "Show buyers your experience, languages and craft." },
    ],
  }),
  component: SellerProfile,
});

function SellerProfile() {
  const [name, setName] = useState("");
  const [languages, setLanguages] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [elderSkillLinked, setElderSkillLinked] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("silverhands.profile");
      if (raw) {
        const p = JSON.parse(raw);
        setAbout(p.about || "");
        setSkills(p.skills || "");
        setLocation(p.location || "");
        setLanguages(p.languages || "");
      }
      const sessRaw = window.localStorage.getItem("silverhands.session");
      if (sessRaw) {
        const s = JSON.parse(sessRaw);
        if (s?.name) setName(s.name);
      }
      const esUserId = window.localStorage.getItem("silverhands.elderskill_user_id");
      if (esUserId) setElderSkillLinked(true);
    } catch {}
  }, []);

  async function resyncFromElderSkill() {
    const userId = window.localStorage.getItem("silverhands.elderskill_user_id");
    if (!userId) {
      toast.error("No SilverHands account linked. Complete a voice interview first.");
      return;
    }
    setSyncing(true);
    try {
      const profile = await fetchProfileByUserId(userId);
      if (profile) {
        if (profile.full_name) setName(profile.full_name);
        if (profile.profile?.summary) setAbout(profile.profile.summary);
        if (profile.profile?.primary_skill) setSkills(profile.profile.primary_skill);
        if (profile.profile?.location_city) setLocation(profile.profile.location_city);
        if (profile.profile?.years_of_experience) {
          setExperience(`${profile.profile.years_of_experience} years`);
        }
        // Persist
        const p = {
          about: profile.profile?.summary || about,
          skills: profile.profile?.primary_skill || skills,
          location: profile.profile?.location_city || location,
          languages,
        };
        window.localStorage.setItem("silverhands.profile", JSON.stringify(p));
        toast.success("Profile synced from SilverHands!");
      } else {
        toast.error("Could not fetch profile from SilverHands.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Sync failed — SilverHands may not be running.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <SectionHeading eyebrow="Your story" title="Seller profile" />

      {/* ElderSkill sync status */}
      {elderSkillLinked ? (
        <div className="surface mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </span>
            <div>
              <p className="text-sm font-semibold">SilverHands account linked</p>
              <p className="text-xs text-muted-foreground">
                Profile data synced from your voice interview
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resyncFromElderSkill}
            disabled={syncing}
          >
            <RefreshCcw className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing…" : "Re-sync"}
          </Button>
        </div>
      ) : (
        <div className="surface mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-semibold">Want AI to write your profile?</p>
            <p className="text-xs text-muted-foreground">
              Complete a voice interview on SilverHands to auto-fill your profile.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const base = (import.meta as any).env?.VITE_VOICE_API || "http://localhost:8000";
              const callbackUrl = `${window.location.origin}/elder/callback`;
              window.location.href = `${base}/auth?return_to=${encodeURIComponent(callbackUrl)}`;
            }}
          >
            <ExternalLink /> Start voice interview
          </Button>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const profile = { about, skills, location, languages };
            window.localStorage.setItem("silverhands.profile", JSON.stringify(profile));
          } catch {}
          toast.success("Profile updated");
        }}
        className="surface space-y-7 p-8 lg:p-10"
      >
        <div className="flex flex-wrap items-center gap-5">
          <span className="grid size-24 place-items-center rounded-full bg-primary-soft text-primary">
            <Camera className="size-8" aria-hidden />
          </span>
          <Button type="button" variant="outline">
            Upload profile photo
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sname">Name</Label>
            <Input id="sname" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slang">Languages</Label>
            <Input id="slang" value={languages} onChange={(e) => setLanguages(e.target.value)} className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sloc">Location</Label>
            <Input id="sloc" value={location} onChange={(e) => setLocation(e.target.value)} className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sexp">Experience</Label>
            <Input id="sexp" value={experience} onChange={(e) => setExperience(e.target.value)} className="h-12 rounded-xl" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sskills">Skills</Label>
          <Input id="sskills" value={skills} onChange={(e) => setSkills(e.target.value)} className="h-12 rounded-xl" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sabout">About me</Label>
          <Textarea
            id="sabout"
            rows={5}
            className="rounded-xl"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => toast("Hansa AI suggested a warmer opening line")}
          >
            <Sparkles /> Improve bio with AI
          </Button>
        </div>

        <Button type="submit" size="lg">
          Save profile
        </Button>
      </form>
    </div>
  );
}
