import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getRestaurantsByFeatureSlug } from "@/lib/data";

export const revalidate = 3600;

type Props = { params: Promise<{ feature: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { feature } = await params;
  const { feature: name } = await getRestaurantsByFeatureSlug(feature);
  if (!name) return {};
  return {
    title: `${name} Restaurants in London`,
    description: `London restaurants offering ${name.toLowerCase()} — ratings, hours and booking links.`,
  };
}

export default async function FeaturePage({ params }: Props) {
  const { feature } = await params;
  const { feature: name, restaurants } = await getRestaurantsByFeatureSlug(feature);
  if (!name) notFound();

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">{name} Restaurants in London</h1>
      <p className="mt-2 text-foreground/60">{restaurants.length} restaurants found</p>

      {restaurants.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-foreground/60">No restaurants found for this feature yet.</p>
      )}
    </Container>
  );
}
