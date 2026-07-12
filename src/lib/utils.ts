export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function unslugify(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatCategory(category: string): string {
  return category.replace(/\bshop\b/i, "").trim();
}

// "Soho / West End" -> "Soho" — the scraped location_area column stores compound
// labels; neighbourhood pages need one clean primary name per area.
export function primaryAreaName(locationArea: string): string {
  return locationArea.split("/")[0].trim();
}
