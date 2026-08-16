import { Star } from "lucide-react";

export function Stars({
  rating,
  reviews,
  className = "",
}: {
  rating: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
      <Star className="size-4 fill-accent text-accent" aria-hidden />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-muted-foreground">({reviews})</span>
      )}
      <span className="sr-only">
        rated {rating} out of 5{reviews !== undefined ? ` from ${reviews} reviews` : ""}
      </span>
    </span>
  );
}
