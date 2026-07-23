import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { StarRating } from "@/components/StarRating";
import { getRestaurantsByIds } from "@/lib/data";
import { categoryGradient } from "@/lib/category-icon";

export const metadata: Metadata = {
  title: "Compare Restaurants",
  robots: { index: false, follow: true },
};

type Row = {
  label: string;
  render: (r: Awaited<ReturnType<typeof getRestaurantsByIds>>[number]) => React.ReactNode;
};

const ROWS: Row[] = [
  { label: "Rating", render: (r) => <StarRating rating={r.rating} reviewCount={r.review_count} /> },
  { label: "Price", render: (r) => r.price_range ?? "—" },
  { label: "Cuisine", render: (r) => r.primary_category ?? "—" },
  { label: "Area", render: (r) => r.location_area ?? r.borough ?? "—" },
  { label: "Member discount", render: (r) => r.member_discount ?? "—" },
  {
    label: "Address",
    render: (r) => r.full_address ?? "—",
  },
  {
    label: "Phone",
    render: (r) => (r.phone ? <a href={`tel:${r.phone}`} className="hover:text-primary">{r.phone}</a> : "—"),
  },
  {
    label: "Opening hours",
    render: (r) =>
      r.opening_hours ? (
        <span className="whitespace-pre-line">{r.opening_hours.replace(/\s\|\s/g, "\n")}</span>
      ) : (
        "—"
      ),
  },
];

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids: idsParam } = await searchParams;
  const ids = (idsParam ?? "").split(",").filter(Boolean).slice(0, 3);
  const restaurants = ids.length > 0 ? await getRestaurantsByIds(ids) : [];

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold">Compare Restaurants</h1>

      {restaurants.length < 2 ? (
        <div className="mt-6">
          <p className="text-foreground/60">
            Pick at least 2 restaurants to compare — use the &quot;Compare&quot; button on any restaurant
            card while browsing.
          </p>
          <Link href="/restaurants" className="mt-4 inline-block font-semibold text-primary hover:text-primary-dark">
            Browse restaurants →
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-32" />
                {restaurants.map((r) => (
                  <th key={r.id} className="w-64 pb-4 text-left align-top">
                    <Link href={`/restaurants/${r.slug}`} className="group block">
                      {r.photo_url ? (
                        <div className="relative h-28 w-full overflow-hidden rounded-xl">
                          <Image src={r.photo_url} alt={r.name} fill sizes="256px" className="object-cover" />
                        </div>
                      ) : (
                        <div
                          className={`h-28 w-full rounded-xl bg-gradient-to-br ${categoryGradient(
                            r.primary_category ?? r.name
                          )}`}
                        />
                      )}
                      <p className="mt-2 font-semibold leading-snug group-hover:text-primary transition-colors">
                        {r.name}
                      </p>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th className="py-3 pr-4 text-left align-top text-xs font-semibold uppercase tracking-wide text-foreground/50">
                    {row.label}
                  </th>
                  {restaurants.map((r) => (
                    <td key={r.id} className="py-3 pr-6 align-top text-foreground/80">
                      {row.render(r)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
