import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { uid, type Difficulty, type Tutorial, type TutorialStep } from "@/lib/elderskill/store";

const emptyTutorial = (): Tutorial => ({
  id: uid(),
  title: "",
  videoUrl: "",
  thumbnailUrl: "",
  description: "",
  learnings: [],
  steps: [],
  durationMin: 20,
  difficulty: "Beginner",
  language: "English",
  priceCents: 0,
  status: "Draft",
});

export function TutorialDialog({
  open,
  onOpenChange,
  tutorial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tutorial?: Tutorial | null;
  onSave: (t: Tutorial) => void;
}) {
  const [draft, setDraft] = useState<Tutorial>(emptyTutorial);
  const [learnText, setLearnText] = useState("");
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const base = tutorial ? { ...tutorial } : emptyTutorial();
    setDraft(base);
    setLearnText(base.learnings.join("\n"));
    setPaid(base.priceCents > 0);
    setError(null);
  }, [open, tutorial]);

  const set = <K extends keyof Tutorial>(key: K, value: Tutorial[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const setStep = (id: string, patch: Partial<TutorialStep>) =>
    setDraft((d) => ({
      ...d,
      steps: d.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));

  const moveStep = (index: number, dir: -1 | 1) =>
    setDraft((d) => {
      const steps = [...d.steps];
      const target = index + dir;
      if (target < 0 || target >= steps.length) return d;
      [steps[index], steps[target]] = [steps[target]!, steps[index]!];
      return { ...d, steps };
    });

  function save(status: Tutorial["status"]) {
    if (!draft.title.trim()) {
      setError("Please give your tutorial a title so people know what it teaches.");
      return;
    }
    if (!draft.description.trim()) {
      setError("Please add a short description of your tutorial.");
      return;
    }
    onSave({
      ...draft,
      status,
      learnings: learnText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      priceCents: paid ? draft.priceCents : 0,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {tutorial ? "Edit tutorial" : "Add a tutorial"}
          </DialogTitle>
          <DialogDescription className="text-base">
            Take your time. You can save it as a draft and finish later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="t-title" className="text-base">Title</Label>
            <Input
              id="t-title"
              className="h-12 text-base"
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Sharpening a chisel the old way"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="t-video" className="text-base">Video link</Label>
              <Input
                id="t-video"
                className="h-12 text-base"
                value={draft.videoUrl}
                onChange={(e) => set("videoUrl", e.target.value)}
                placeholder="Paste a video link"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-thumb" className="text-base">Thumbnail image link</Label>
              <Input
                id="t-thumb"
                className="h-12 text-base"
                value={draft.thumbnailUrl}
                onChange={(e) => set("thumbnailUrl", e.target.value)}
                placeholder="Paste an image link"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="t-desc" className="text-base">Short description</Label>
            <Textarea
              id="t-desc"
              className="min-h-24 text-base"
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="t-learn" className="text-base">What learners will learn</Label>
            <Textarea
              id="t-learn"
              className="min-h-24 text-base"
              value={learnText}
              onChange={(e) => setLearnText(e.target.value)}
              placeholder={"One point per line"}
            />
            <p className="text-sm text-muted-foreground">Write one point on each line.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="t-dur" className="text-base">Duration (minutes)</Label>
              <Input
                id="t-dur"
                type="number"
                min={1}
                className="h-12 text-base"
                value={draft.durationMin}
                onChange={(e) => set("durationMin", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Difficulty</Label>
              <Select
                value={draft.difficulty}
                onValueChange={(v) => set("difficulty", v as Difficulty)}
              >
                <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-lang" className="text-base">Language</Label>
              <Input
                id="t-lang"
                className="h-12 text-base"
                value={draft.language}
                onChange={(e) => set("language", e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-secondary/50 p-4">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="t-paid" className="text-base">Charge for this tutorial</Label>
              <Switch id="t-paid" checked={paid} onCheckedChange={setPaid} />
            </div>
            {paid && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="t-price" className="text-base">Price in dollars</Label>
                <Input
                  id="t-price"
                  type="number"
                  min={1}
                  className="h-12 max-w-40 text-base"
                  value={draft.priceCents / 100}
                  onChange={(e) => set("priceCents", Math.round(Number(e.target.value) * 100))}
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Step-by-step instructions</h3>
            {draft.steps.length === 0 && (
              <p className="text-base text-muted-foreground">No steps added yet.</p>
            )}
            {draft.steps.map((step, i) => (
              <div key={step.id} className="space-y-3 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-semibold">Step {i + 1}</span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Move step ${i + 1} up`}
                      onClick={() => moveStep(i, -1)}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Move step ${i + 1} down`}
                      onClick={() => moveStep(i, 1)}
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete step ${i + 1}`}
                      onClick={() =>
                        setDraft((d) => ({ ...d, steps: d.steps.filter((s) => s.id !== step.id) }))
                      }
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <Input
                  className="h-12 text-base"
                  aria-label={`Step ${i + 1} title`}
                  placeholder="Step title"
                  value={step.title}
                  onChange={(e) => setStep(step.id, { title: e.target.value })}
                />
                <Textarea
                  className="text-base"
                  aria-label={`Step ${i + 1} description`}
                  placeholder="What to do in this step"
                  value={step.description}
                  onChange={(e) => setStep(step.id, { description: e.target.value })}
                />
                <Input
                  className="h-12 text-base"
                  aria-label={`Step ${i + 1} image or video link`}
                  placeholder="Optional image or video link"
                  value={step.mediaUrl ?? ""}
                  onChange={(e) => setStep(step.id, { mediaUrl: e.target.value })}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="h-12 text-base"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  steps: [...d.steps, { id: uid(), title: "", description: "" }],
                }))
              }
            >
              <Plus /> Add step
            </Button>
          </div>

          {error && (
            <p role="alert" className="text-base font-medium text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="h-12 text-base" onClick={() => save("Draft")}>
            Save as draft
          </Button>
          <Button className="h-12 text-base" onClick={() => save("Published")}>
            Publish tutorial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
