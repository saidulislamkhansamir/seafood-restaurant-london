import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { RestaurantCard } from "@/components/RestaurantCard";
import {
  getBoroughs,
  getCategories,
  getRestaurantsByBoroughAndCategorySlug,
  getRestaurantsByBoroughAndAreaSlug,
} from "@/lib/data";

export const revalidate = 3600;

type Props = { params: Promise<{ borough: string; slug: string }> };

async function resolve(boroughSlug: string, slug: string) {
  const [boroughs, categories] = await Promise.all([getBoroughs(), getCategories()]);
  if (!boroughs.some((b) => b.slug === boroughSlug)) return null;

  if (categories.some((c) => c.slug === slug)) {
    const result = await getRestaurantsByBoroughAndCategorySlug(boroughSlug, slug);
    if (result.borough && result.category) {
      return { kind: "category" as const, label: `${result.category}s in ${result.borough}`, ...result };
    }
  }

  const areaResult = await getRestaurantsByBoroughAndAreaSlug(boroughSlug, slug);
  if (areaResult.borough && areaResult.area) {
    return { kind: "area" as const, label: `Restaurants in ${areaResult.area}, ${areaResult.borough}`, ...areaResult };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { borough, slug } = await params;
  const result = await resolve(borough, slug);
  if (!result) return {};
  return {
    title: result.label,
    description: `${result.label} — ratings, hours, menus and booking links.`,
  };
}

export default async function BoroughComboPage({ params }: Props) {
  const { borough, slug } = await params;
  const result = await resolve(borough, slug);
  if (!result) notFound();

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">{result.label}</h1>
      <p className="mt-2 text-foreground/60">{result.restaurants.length} restaurants found</p>

      {result.restaurants.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-foreground/60">No restaurants listed here yet.</p>
      )}
    </Container>
  );
}
