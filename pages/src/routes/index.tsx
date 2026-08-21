import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-semibold sm:text-6xl">
        Share a lifetime of skill.
      </h1>
      <p className="mt-5 max-w-2xl text-xl text-muted-foreground">
        SilverHands connects experienced people with those who want to learn from them — or hire
        them. Start with a free 30-minute conversation.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild className="h-14 text-base">
          <Link to="/their-expertise">Explore their expertise</Link>
        </Button>
        <Button asChild variant="outline" className="h-14 text-base">
          <Link to="/teach-and-share">Teach &amp; share</Link>
        </Button>
      </div>
    </div>
  );
}
