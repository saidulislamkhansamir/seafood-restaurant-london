export function StarRating({ rating, reviewCount }: { rating: number | null; reviewCount?: number | null }) {
  if (!rating) return <span className="text-sm text-foreground/50">Not yet rated</span>;
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-center gap-0.5 text-coral">
        {"★".repeat(Math.round(rating))}
        <span className="text-border">{"★".repeat(5 - Math.round(rating))}</span>
      </span>
      <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
      {reviewCount ? (
        <span className="text-sm text-foreground/60">({reviewCount.toLocaleString()})</span>
      ) : null}
    </div>
  );
}
