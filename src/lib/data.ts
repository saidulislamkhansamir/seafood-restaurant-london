import { supabase } from "./supabase";
import type { Tables } from "./database.types";
import { slugify } from "./utils";

export type Restaurant = Tables<"restaurants">;

const ACTIVE = "Active";

export async function getFeaturedRestaurants(limit = 6): Promise<Restaurant[]> {
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("listing_status", ACTIVE)
    .order("is_featured", { ascending: false })
    .order("rating", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getAllRestaurants(filters?: {
  category?: string;
  borough?: string;
  area?: string;
  q?: string;
}): Promise<Restaurant[]> {
  let query = supabase.from("restaurants").select("*").eq("listing_status", ACTIVE);

  if (filters?.category) {
    query = query.ilike("primary_category", filters.category);
  }
  if (filters?.borough) {
    query = query.ilike("borough", filters.borough);
  }
  if (filters?.area) {
    query = query.ilike("location_area", filters.area);
  }
  if (filters?.q) {
    query = query.or(
      `name.ilike.%${filters.q}%,description.ilike.%${filters.q}%,location_area.ilike.%${filters.q}%`
    );
  }

  const { data } = await query.order("rating", { ascending: false });
  return data ?? [];
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("listing_status", ACTIVE)
    .maybeSingle();
  return data;
}

export async function getCategories(): Promise<{ name: string; slug: string; count: number }[]> {
  const { data } = await supabase
    .from("restaurants")
    .select("primary_category")
    .eq("listing_status", ACTIVE);
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
  const { data } = await supabase.from("restaurants").select("borough").eq("listing_status", ACTIVE);
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

export async function submitRestaurant(input: {
  restaurant_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  category?: string;
  address?: string;
  message?: string;
}) {
  const { error } = await supabase.from("submissions").insert(input);
  if (error) throw new Error(error.message);
}
