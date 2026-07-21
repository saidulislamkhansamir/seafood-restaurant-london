import { supabase } from "./supabase";
import type { Tables } from "./database.types";
import { slugify, primaryAreaName } from "./utils";
import { ACTIVE, LISTABLE_STATUSES, NOT_A_RESTAURANT } from "./restaurant-status";

export type Restaurant = Tables<"restaurants">;

export async function getRestaurantsCount(): Promise<number> {
  const { count } = await supabase
    .from("restaurants")
    .select("*", { count: "exact", head: true })
    .in("listing_status", LISTABLE_STATUSES);
  return count ?? 0;
}

export async function getFeaturedRestaurants(limit = 6): Promise<Restaurant[]> {
  // Featured spots are strictly Active — a temporarily closed restaurant
  // shouldn't be promoted, even though it still shows up in normal browsing.
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("listing_status", ACTIVE)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false })
    .limit(limit);
  return data ?? [];
}

type RestaurantFilters = {
  category?: string;
  borough?: string;
  area?: string;
  q?: string;
};

export async function getAllRestaurants(filters?: RestaurantFilters): Promise<Restaurant[]> {
  let query = supabase.from("restaurants").select("*").in("listing_status", LISTABLE_STATUSES);

  if (filters?.category) query = query.ilike("primary_category", filters.category);
  if (filters?.borough) query = query.ilike("borough", filters.borough);
  if (filters?.area) query = query.ilike("location_area", filters.area);
  if (filters?.q) {
    query = query.or(
      `name.ilike.%${filters.q}%,description.ilike.%${filters.q}%,location_area.ilike.%${filters.q}%`
    );
  }

  const { data } = await query.order("rating", { ascending: false });
  return data ?? [];
}

export async function getRestaurantsPage(
  filters: RestaurantFilters | undefined,
  page = 1,
  pageSize = 24
): Promise<{ restaurants: Restaurant[]; total: number; page: number; pageSize: number }> {
  let query = supabase
    .from("restaurants")
    .select("*", { count: "exact" })
    .in("listing_status", LISTABLE_STATUSES);

  if (filters?.category) query = query.ilike("primary_category", filters.category);
  if (filters?.borough) query = query.ilike("borough", filters.borough);
  if (filters?.area) query = query.ilike("location_area", filters.area);
  if (filters?.q) {
    query = query.or(
      `name.ilike.%${filters.q}%,description.ilike.%${filters.q}%,location_area.ilike.%${filters.q}%`
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count } = await query.order("rating", { ascending: false }).range(from, to);
  return { restaurants: data ?? [], total: count ?? 0, page, pageSize };
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  // Permanently/temporarily closed pages stay reachable directly (e.g. from
  // a search engine that already indexed them) even though they're excluded
  // from listings — only "Not a Restaurant" rows are fully hidden.
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .neq("listing_status", NOT_A_RESTAURANT)
    .maybeSingle();
  return data;
}

export async function getRelatedRestaurants(restaurant: Restaurant, limit = 6): Promise<Restaurant[]> {
  const results: Restaurant[] = [];
  const seen = new Set<string>([restaurant.id]);

  async function addFrom(query: PromiseLike<{ data: Restaurant[] | null }>) {
    if (results.length >= limit) return;
    const { data } = await query;
    for (const r of data ?? []) {
      if (results.length >= limit) break;
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      results.push(r);
    }
  }

  if (restaurant.borough && restaurant.primary_category) {
    await addFrom(
      supabase
        .from("restaurants")
        .select("*")
        .eq("listing_status", ACTIVE)
        .eq("borough", restaurant.borough)
        .eq("primary_category", restaurant.primary_category)
        .neq("id", restaurant.id)
        .order("rating", { ascending: false })
        .limit(limit)
    );
  }

  if (restaurant.borough) {
    await addFrom(
      supabase
        .from("restaurants")
        .select("*")
        .eq("listing_status", ACTIVE)
        .eq("borough", restaurant.borough)
        .neq("id", restaurant.id)
        .order("rating", { ascending: false })
        .limit(limit)
    );
  }

  if (restaurant.primary_category) {
    await addFrom(
      supabase
        .from("restaurants")
        .select("*")
        .eq("listing_status", ACTIVE)
        .eq("primary_category", restaurant.primary_category)
        .neq("id", restaurant.id)
        .order("rating", { ascending: false })
        .limit(limit)
    );
  }

  return results.slice(0, limit);
}

export async function getCategories(): Promise<{ name: string; slug: string; count: number }[]> {
  const { data } = await supabase
    .from("restaurants")
    .select("primary_category")
    .in("listing_status", LISTABLE_STATUSES);
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.primary_category) continue;
    counts.set(row.primary_category, (counts.get(row.primary_category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

export async function getRestaurantsByCategorySlug(categorySlug: string): Promise<{
  category: string | null;
  restaurants: Restaurant[];
}> {
  const categories = await getCategories();
  const match = categories.find((c) => c.slug === categorySlug);
  if (!match) return { category: null, restaurants: [] };
  const restaurants = await getAllRestaurants({ category: match.name });
  return { category: match.name, restaurants };
}

export async function getBoroughs(): Promise<{ name: string; slug: string; count: number }[]> {
  const { data } = await supabase
    .from("restaurants")
    .select("borough")
    .in("listing_status", LISTABLE_STATUSES);
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.borough) continue;
    counts.set(row.borough, (counts.get(row.borough) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

export async function getRestaurantsByBoroughSlug(boroughSlug: string): Promise<{
  borough: string | null;
  restaurants: Restaurant[];
}> {
  const boroughs = await getBoroughs();
  const match = boroughs.find((b) => b.slug === boroughSlug);
  if (!match) return { borough: null, restaurants: [] };
  const restaurants = await getAllRestaurants({ borough: match.name });
  return { borough: match.name, restaurants };
}

export async function getRestaurantsByBoroughAndCategorySlug(
  boroughSlug: string,
  categorySlug: string
): Promise<{ borough: string | null; category: string | null; restaurants: Restaurant[] }> {
  const [boroughs, categories] = await Promise.all([getBoroughs(), getCategories()]);
  const borough = boroughs.find((b) => b.slug === boroughSlug);
  const category = categories.find((c) => c.slug === categorySlug);
  if (!borough || !category) return { borough: null, category: null, restaurants: [] };
  const restaurants = await getAllRestaurants({ borough: borough.name, category: category.name });
  return { borough: borough.name, category: category.name, restaurants };
}

export type Area = { name: string; slug: string; borough: string; boroughSlug: string; count: number };

export async function getAreas(): Promise<Area[]> {
  const { data } = await supabase
    .from("restaurants")
    .select("location_area, borough")
    .in("listing_status", LISTABLE_STATUSES);

  const counts = new Map<string, Area>();
  for (const row of data ?? []) {
    if (!row.location_area || !row.borough) continue;
    const name = primaryAreaName(row.location_area);
    const boroughSlug = slugify(row.borough);
    const slug = slugify(name);
    if (slug === boroughSlug) continue; // skip areas that just duplicate the borough itself
    const key = `${boroughSlug}/${slug}`;
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { name, slug, borough: row.borough, boroughSlug, count: 1 });
    }
  }
  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

export async function getRestaurantsByBoroughAndAreaSlug(
  boroughSlug: string,
  areaSlug: string
): Promise<{ borough: string | null; area: string | null; restaurants: Restaurant[] }> {
  const areas = await getAreas();
  const match = areas.find((a) => a.boroughSlug === boroughSlug && a.slug === areaSlug);
  if (!match) return { borough: null, area: null, restaurants: [] };
  const boroughRestaurants = await getAllRestaurants({ borough: match.borough });
  const restaurants = boroughRestaurants.filter(
    (r) => r.location_area && slugify(primaryAreaName(r.location_area)) === areaSlug
  );
  return { borough: match.borough, area: match.name, restaurants };
}

export async function getFeatures(): Promise<{ name: string; slug: string; count: number }[]> {
  const { data } = await supabase
    .from("restaurants")
    .select("attributes")
    .in("listing_status", LISTABLE_STATUSES);
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    for (const attr of row.attributes ?? []) {
      counts.set(attr, (counts.get(attr) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

export async function getRestaurantsByFeatureSlug(featureSlug: string): Promise<{
  feature: string | null;
  restaurants: Restaurant[];
}> {
  const features = await getFeatures();
  const match = features.find((f) => f.slug === featureSlug);
  if (!match) return { feature: null, restaurants: [] };
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .in("listing_status", LISTABLE_STATUSES)
    .contains("attributes", [match.name])
    .order("rating", { ascending: false });
  return { feature: match.name, restaurants: data ?? [] };
}

export async function submitRestaurant(input: {
  restaurant_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  category?: string;
  address?: string;
  message?: string;
  photo_storage_path?: string;
}) {
  const { error } = await supabase.from("submissions").insert(input);
  if (error) throw new Error(error.message);
}

export async function submitRestaurantPhoto(input: { restaurant_id: string; storage_path: string }) {
  const { error } = await supabase.from("photo_submissions").insert(input);
  if (error) throw new Error(error.message);
}
