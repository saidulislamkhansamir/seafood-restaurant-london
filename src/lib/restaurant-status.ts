// Central source of truth for restaurant listing_status values and how they
// affect visibility and display across the site.

export const ACTIVE = "Active";
export const TEMPORARILY_CLOSED = "Temporarily Closed";
export const PERMANENTLY_CLOSED = "Permanently Closed";
export const NOT_A_RESTAURANT = "Not a Restaurant";

// Statuses that should still appear in browse/search listings, category and
// borough pages, and the sitemap. Permanently closed restaurants are
// deliberately excluded — their profile page stays reachable directly, but
// they won't be served to someone browsing.
export const LISTABLE_STATUSES = [ACTIVE, TEMPORARILY_CLOSED];

type StatusVisual = {
  label: string;
  badgeClasses: string;
  dotClasses: string;
};

const STATUS_VISUALS: Record<string, StatusVisual> = {
  [ACTIVE]: {
    label: "Open",
    badgeClasses: "bg-green-50 text-green-700 border-green-200",
    dotClasses: "bg-green-500",
  },
  [TEMPORARILY_CLOSED]: {
    label: "Temporarily Closed",
    badgeClasses: "bg-amber-50 text-amber-800 border-amber-200",
    dotClasses: "bg-amber-500",
  },
  [PERMANENTLY_CLOSED]: {
    label: "Permanently Closed",
    badgeClasses: "bg-gray-100 text-gray-600 border-gray-300",
    dotClasses: "bg-gray-400",
  },
};

export function statusVisual(status: string | null): StatusVisual {
  return STATUS_VISUALS[status ?? ACTIVE] ?? STATUS_VISUALS[ACTIVE];
}

export function isActive(status: string | null): boolean {
  return (status ?? ACTIVE) === ACTIVE;
}

const STATUS_BANNER: Record<string, { message: string; classes: string }> = {
  [TEMPORARILY_CLOSED]: {
    message:
      "This restaurant has been reported as temporarily closed. Details below may be out of date — call ahead before visiting.",
    classes: "border-amber-200 bg-amber-50 text-amber-800",
  },
  [PERMANENTLY_CLOSED]: {
    message:
      "This restaurant appears to be permanently closed. We're keeping this page for reference, but the information below may no longer be accurate.",
    classes: "border-gray-200 bg-gray-50 text-gray-600",
  },
};

export function statusBannerMessage(status: string | null): string | null {
  if (!status) return null;
  return STATUS_BANNER[status]?.message ?? null;
}

export function statusBannerClasses(status: string | null): string {
  if (!status) return STATUS_BANNER[TEMPORARILY_CLOSED].classes;
  return STATUS_BANNER[status]?.classes ?? STATUS_BANNER[TEMPORARILY_CLOSED].classes;
}
