import { statusVisual } from "@/lib/restaurant-status";

export function StatusBadge({
  status,
  className = "",
}: {
  status: string | null;
  className?: string;
}) {
  const visual = statusVisual(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${visual.badgeClasses} ${className}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${visual.dotClasses}`} aria-hidden />
      {visual.label}
    </span>
  );
}
