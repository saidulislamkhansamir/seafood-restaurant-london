import { statusVisual, isActive } from "@/lib/restaurant-status";
import type { LiveStatus } from "@/lib/opening-hours";

export function StatusBadge({
  status,
  liveStatus,
  className = "",
}: {
  status: string | null;
  liveStatus?: LiveStatus | null;
  className?: string;
}) {
  const visual = statusVisual(status);
  // For active listings with parseable hours, show real-time open/closed-now
  // instead of the static "Open" label — that's what a reader at the top of
  // the page actually wants to know. Falls back to the plain status badge
  // when hours can't be parsed, and never applies to closed statuses.
  const showLive = isActive(status) && liveStatus;
  const label = showLive ? (liveStatus.open ? "Open now" : "Closed now") : visual.label;
  const badgeClasses = showLive && !liveStatus.open
    ? "bg-red-50 text-red-700 border-red-200"
    : visual.badgeClasses;
  const dotClasses = showLive && !liveStatus.open ? "bg-red-500" : visual.dotClasses;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${badgeClasses} ${className}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClasses}`} aria-hidden />
      {label}
    </span>
  );
}
