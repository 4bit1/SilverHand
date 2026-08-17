import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { completeOnboarding, useSession } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/seller/onboarding")({
  head: () => ({
    meta: [{ title: "Create your profile | SilverHands" }],
  }),
  component: SellerOnboarding,
});

const steps = ["Tell us about yourself", "Your details", "Review"] as const;

function SellerOnboarding() {
  const session = useSession();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState("");

  // Pre-populate from any ElderSkill-synced profile data
  useState(() => {
    try {
      const raw = window.localStorage.getItem("silverhands.profile");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.about) setAbout(p.about);
        if (p.skills) setSkills(p.skills);
        if (p.location) setLocation(p.location);
        if (p.languages) setLanguages(p.languages);
      }
    } catch {}
  });

  function finish() {
    // persist profile draft so seller pages can read it
    try {
      const profile = { about, skills, location, languages };
      window.localStorage.setItem("silverhands.profile", JSON.stringify(profile));
    } catch {}
    completeOnboarding();
    toast.success("Profile created — welcome to SilverHands!");
    navigate({ to: "/seller" });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10 flex items-center justify-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-9 place-items-center rounded-full text-sm font-semibold",
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            {i < steps.length - 1 && (
              <span className={cn("h-0.5 w-10", i < step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="surface space-y-6 p-8 text-center lg:p-10">
          <h1 className="text-3xl">
            {session?.name ? `Welcome, ${session.name}` : "Tell us about yourself"}
          </h1>
          <p className="text-muted-foreground">
            Describe your skills and experience below, or use the{" "}
            <a
              href={`${(import.meta as any).env?.VITE_VOICE_API || "http://localhost:8000"}/auth?return_to=${encodeURIComponent(window.location.origin + "/elder/callback")}`}
              className="font-semibold text-primary underline underline-offset-4"
            >
              SilverHands voice interview
            </a>{" "}
            to have AI write your profile for you.
          </p>

          <Textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={5}
            placeholder="e.g. I've been making Bengali pickles and snacks for my family for 30 years, and I'd love to sell them..."
            className="rounded-xl text-left"
          />

          <Button
            size="lg"
            className="w-full"
            disabled={!about.trim()}
            onClick={() => setStep(1)}
          >
            Continue <ArrowRight />
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="surface space-y-6 p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-5">
            <span className="grid size-20 place-items-center rounded-full bg-primary-soft text-primary">
              <Camera className="size-7" aria-hidden />
            </span>
            <Button type="button" variant="outline">
              Upload profile photo
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ob-location">Location</Label>
              <Input
                id="ob-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Salt Lake, Kolkata"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ob-languages">Languages</Label>
              <Input
                id="ob-languages"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="e.g. Bengali, Hindi, English"
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ob-skills">Skills</Label>
            <Input
              id="ob-skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Bengali cuisine, pickling, tiffin planning"
              className="h-12 rounded-xl"
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep(2)} className="flex-1">
              Continue <ArrowRight />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="surface space-y-6 p-8 lg:p-10">
          <h2 className="text-2xl">Here's your profile</h2>
          <div className="space-y-4 rounded-xl border border-border p-5">
            <p className="font-semibold">{session?.name ?? "Your name"}</p>
            {location && <p className="text-sm text-muted-foreground">{location}</p>}
            {languages && <p className="text-sm text-muted-foreground">Speaks: {languages}</p>}
            {skills && <p className="text-sm text-muted-foreground">Skills: {skills}</p>}
            <p className="text-sm leading-relaxed">{about}</p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button onClick={finish} className="flex-1">
              Publish my profile
            </Button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={finish}
        className="mx-auto mt-6 block text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Skip for now
      </button>
    </div>
  );
}
