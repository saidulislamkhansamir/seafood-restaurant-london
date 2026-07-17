import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { StarRating } from "@/components/StarRating";
import { MapEmbed } from "@/components/MapEmbed";
import { SuggestPhotoForm } from "@/components/SuggestPhotoForm";
import { categoryGradient } from "@/lib/category-icon";
import { getRestaurantBySlug } from "@/lib/data";
import { slugify } from "@/lib/utils";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) return {};
  const title = `${restaurant.name}${restaurant.location_area ? `, ${restaurant.location_area}` : ""}`;
  return {
    title,
    description:
      restaurant.description ??
      `${restaurant.name} is a ${restaurant.primary_category ?? "restaurant"} in ${
        restaurant.borough ?? "London"
      }. See hours, menu, rating and booking details.`,
    alternates: { canonical: `/restaurants/${slug}` },
  };
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    servesCuisine: restaurant.cuisine_tags ?? undefined,
    address: restaurant.full_address ?? undefined,
    telephone: restaurant.phone ?? undefined,
    url: restaurant.website_url ?? undefined,
    priceRange: restaurant.price_range ?? undefined,
    image: restaurant.photo_url ?? undefined,
    aggregateRating: restaurant.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: restaurant.rating,
          reviewCount: restaurant.review_count ?? undefined,
        }
      : undefined,
    geo:
      restaurant.lat && restaurant.lng
        ? { "@type": "GeoCoordinates", latitude: restaurant.lat, longitude: restaurant.lng }
        : undefined,
  };

  const links: { label: string; href: string }[] = [];
  if (restaurant.booking_link) links.push({ label: "Book a Table", href: restaurant.booking_link });
  if (restaurant.menu_link) links.push({ label: "View Menu", href: restaurant.menu_link });
  for (const platform of restaurant.delivery_platforms ?? []) {
    links.push({ label: "Order Delivery", href: platform });
  }
  if (restaurant.website_url) links.push({ label: "Visit Website", href: restaurant.website_url });

  const breadcrumb = breadcrumbJsonLd([
    { name: "All Restaurants", path: "/restaurants" },
    ...(restaurant.borough
      ? [{ name: restaurant.borough, path: `/${slugify(restaurant.borough)}` }]
      : []),
    { name: restaurant.name, path: `/restaurants/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {restaurant.photo_url ? (
        <div className="relative h-48 w-full sm:h-64">
          <Image
            src={restaurant.photo_url}
            alt={restaurant.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div
          className={`flex h-48 items-center justify-center bg-gradient-to-br ${categoryGradient(
            restaurant.primary_category ?? restaurant.name
          )}`}
        >
          <Image
            src="/logo/brand-icon.png"
            alt=""
            aria-hidden
            width={250}
            height={175}
            className="h-24 w-auto opacity-90 brightness-0 invert"
          />
        </div>
      )}

      <Container className="py-10">
        <nav className="mb-4 text-sm text-foreground/50">
          <Link href="/restaurants" className="hover:text-primary">All Restaurants</Link>
          {restaurant.borough ? (
            <>
              {" / "}
              <Link href={`/${slugify(restaurant.borough)}`} className="hover:text-primary">
                {restaurant.borough}
              </Link>
            </>
          ) : null}
        </nav>

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <div className="mt-3">
              <StarRating rating={restaurant.rating} reviewCount={restaurant.review_count} />
            </div>
            <p className="mt-2 text-foreground/60">
              {restaurant.primary_category}
              {restaurant.location_area ? ` · ${restaurant.location_area}` : ""}
              {restaurant.price_range ? ` · ${restaurant.price_range}` : ""}
            </p>

            {restaurant.description ? (
              <p className="mt-6 text-foreground/80 leading-relaxed">{restaurant.description}</p>
            ) : null}

            {restaurant.specialities ? (
              <div className="mt-6">
                <h2 className="font-semibold">Specialities</h2>
                <p className="mt-1 text-foreground/70">{restaurant.specialities}</p>
              </div>
            ) : null}

            {restaurant.cuisine_tags && restaurant.cuisine_tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {restaurant.cuisine_tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-sm text-foreground/70">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {restaurant.attributes && restaurant.attributes.length > 0 ? (
              <div className="mt-6">
                <h2 className="font-semibold">Features</h2>
                <ul className="mt-2 grid grid-cols-2 gap-y-1 text-sm text-foreground/70 sm:grid-cols-3">
                  {restaurant.attributes.map((a) => (
                    <li key={a}>✓ {a}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-white p-6">
            {restaurant.lat && restaurant.lng ? (
              <div className="mb-6">
                <MapEmbed lat={restaurant.lat} lng={restaurant.lng} label={restaurant.name} />
              </div>
            ) : null}

            {links.length > 0 ? (
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <a
                    key={link.label + link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}

            <dl className="mt-6 space-y-4 text-sm">
              {restaurant.full_address ? (
                <div>
                  <dt className="font-semibold text-foreground/50">Address</dt>
                  <dd className="mt-1">{restaurant.full_address}</dd>
                </div>
              ) : null}
              {restaurant.phone ? (
                <div>
                  <dt className="font-semibold text-foreground/50">Phone</dt>
                  <dd className="mt-1">
                    <a href={`tel:${restaurant.phone}`} className="hover:text-primary">
                      {restaurant.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {restaurant.opening_hours ? (
                <div>
                  <dt className="font-semibold text-foreground/50">Opening Hours</dt>
                  <dd className="mt-1 whitespace-pre-line">{restaurant.opening_hours.replace(/\s\|\s/g, "\n")}</dd>
                </div>
              ) : null}
              {restaurant.google_maps_url ? (
                <div>
                  <a
                    href={restaurant.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:text-primary-dark"
                  >
                    View on Google Maps →
                  </a>
                </div>
              ) : null}
            </dl>

            {!restaurant.photo_url ? <SuggestPhotoForm restaurantId={restaurant.id} /> : null}
          </aside>
        </div>
      </Container>
    </>
  );
}
