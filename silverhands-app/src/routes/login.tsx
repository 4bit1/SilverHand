import { useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { Briefcase, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signIn, type Role } from "@/lib/store";
import { useT } from "@/lib/i18n";

type LoginSearch = { role?: Role; redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const rawRole = search["role"];
    const role: Role | undefined =
      rawRole === "seller" ? "seller" : rawRole === "buyer" ? "buyer" : undefined;
    const rawRedirect = search["redirect"];
    const redirect = typeof rawRedirect === "string" ? rawRedirect : undefined;
    return { ...(role ? { role } : {}), ...(redirect ? { redirect } : {}) };
  },
  head: () => ({
    meta: [{ title: "Sign in | SilverHands" }],
  }),
  component: Login,
});

function Login() {
  const { role: initialRole, redirect } = useSearch({ from: "/login" });
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(initialRole ?? "buyer");
  const [name, setName] = useState("");
  const t = useT();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name to continue");
      return;
    }
    if (role === "seller") {
      try { window.localStorage.setItem('silverhands.pending_name', name.trim()); } catch {}
      // Redirect to ElderSkill's own auth page — ElderSkill owns the entire
      // voice experience. After auth → interview → completion, ElderSkill
      // redirects back to /elder/callback with the user ID.
      const base = (import.meta as any).env?.VITE_VOICE_API || "http://localhost:8000";
      const callbackUrl = `${window.location.origin}/elder/callback`;
      window.location.href = `${base}/auth?return_to=${encodeURIComponent(callbackUrl)}`;
      return;
    }

    // default buyer flow
    signIn(name, role);
    toast.success(`Welcome, ${name.trim()}!`);
    if (redirect) {
      navigate({ to: redirect });
    } else {
      navigate({ to: "/buyer" });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <div className="surface w-full max-w-md p-8 lg:p-10">
        <div className="text-center">
          <span className="font-display text-2xl font-semibold tracking-tight">SilverHands</span>
          <h1 className="mt-4 text-3xl">{t("login.welcomeBack")}</h1>
          <p className="mt-2 text-muted-foreground">
            {redirect
              ? "Sign in to continue — no password needed for this demo."
              : t("login.subhead")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Continue as">
            {(
              [
                { value: "buyer" as const, label: "Buyer", icon: ShoppingBag },
                { value: "seller" as const, label: "Seller", icon: Briefcase },
              ]
            ).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={role === value}
                onClick={() => setRole(value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-sm font-semibold transition-colors",
                  role === value
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40",
                )}
              >
                <Icon className="size-6" aria-hidden />
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-name">Your name</Label>
            <Input
              id="login-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anjali Sen"
              className="h-12 rounded-xl text-base"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            Continue as {role === "buyer" ? "Buyer" : "Seller"}
          </Button>
        </form>
      </div>
    </div>
  );
}
