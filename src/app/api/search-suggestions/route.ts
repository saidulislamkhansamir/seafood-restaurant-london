import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 60);

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Strip characters with special meaning in PostgREST filter syntax (`,` separates
  // or() conditions, `(` `)` group them) and ilike wildcards, so user input can't
  // inject extra filter clauses or unexpected wildcard matches.
  const safe = q.replace(/[,()%_]/g, " ").trim();
  if (!safe) {
    return NextResponse.json({ results: [] });
  }

  const { data } = await supabase
    .from("restaurants")
    .select("slug, name, primary_category, location_area, borough, rating, review_count")
    .eq("listing_status", "Active")
    .or(`name.ilike.%${safe}%,location_area.ilike.%${safe}%,primary_category.ilike.%${safe}%`)
    .order("rating", { ascending: false })
    .limit(6);

  return NextResponse.json({ results: data ?? [] });
}
