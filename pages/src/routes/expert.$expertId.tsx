import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExpertProfileDetail } from "@/components/elderskill/ExpertProfileDetail";
import { fetchExpert } from "@/lib/elderskill/experts";

export const Route = createFileRoute("/expert/$expertId")({
  head: () => ({
    meta: [
      { title: "Expert profile — SilverHands" },
      {
        name: "description",
        content:
          "See an experienced maker's background, services and tutorials, then book a free 30-minute conversation.",
      },
      { property: "og:title", content: "Expert profile — SilverHands" },
      {
        property: "og:description",
        content: "Background, services and tutorials — and a free 30-minute conversation.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ExpertPage,
  errorComponent: ({ error }) => (
    <p role="alert" className="mx-auto max-w-5xl px-4 py-16 text-lg">
      {error.message}
    </p>
  ),
  notFoundComponent: () => (
    <p className="mx-auto max-w-5xl px-4 py-16 text-lg">This expert could not be found.</p>
  ),
});

function ExpertPage() {
  const { expertId } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["expert", expertId],
    queryFn: () => fetchExpert(expertId),
  });

  return (
    <div>
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <Button asChild variant="ghost" className="h-11 pl-2 text-base">
          <Link to="/their-expertise">
            <ArrowLeft className="size-5" aria-hidden />
            Back to experts
          </Link>
        </Button>
      </div>

      {isLoading && (
        <p className="mx-auto max-w-5xl px-4 py-16 text-lg text-muted-foreground">
          Loading profile…
        </p>
      )}
      {error && (
        <p role="alert" className="mx-auto max-w-5xl px-4 py-16 text-lg">
          We could not load this profile. Please try again.
        </p>
      )}
      {!isLoading && !error && !data && (
        <p className="mx-auto max-w-5xl px-4 py-16 text-lg">This expert could not be found.</p>
      )}
      {data && <ExpertProfileDetail expert={data} />}
    </div>
  );
}
