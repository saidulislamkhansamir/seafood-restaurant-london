import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { StarRating } from "@/components/StarRating";
import { MapEmbed } from "@/components/MapEmbed";
import { SuggestPhotoForm } from "@/components/SuggestPhotoForm";
import { ReportInfoForm } from "@/components/ReportInfoForm";
import { RestaurantCard } from "@/components/RestaurantCard";
import { NearbyStations } from "@/components/NearbyStations";
import { NearbyParking } from "@/components/NearbyParking";
import { StatusBadge } from "@/components/StatusBadge";
import { SaveButton } from "@/components/SaveButton";
import { ShareButton } from "@/components/ShareButton";
import { PhotoGallery } from "@/components/PhotoGallery";
import { WriteReviewForm } from "@/components/WriteReviewForm";
import { ClaimListingForm } from "@/components/ClaimListingForm";
import { categoryGradient } from "@/lib/category-icon";
import { getRestaurantBySlug, getRelatedRestaurants, getRestaurantPhotos, getRestaurantReviews } from "@/lib/data";
import { slugify } from "@/lib/utils";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { groupAttributes } from "@/lib/attribute-groups";
import { buildRestaurantFaqs } from "@/lib/restaurant-faq";
import { isActive, statusBannerMessage, statusBannerClasses } from "@/lib/restaurant-status";
import { getLiveStatus } from "@/lib/opening-hours";
import { SITE_URL } from "@/lib/site-config";

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

  const related = await getRelatedRestaurants(restaurant);
  const galleryPhotos = await getRestaurantPhotos(restaurant.id);
  const { reviews, averageRating, count: reviewCount } = await getRestaurantReviews(restaurant.id);
  const restaurantUrl = `${SITE_URL}/restaurants/${slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(restaurantUrl)}`;
  const attributeGroups = groupAttributes(restaurant.attributes ?? []);
  const faqs = buildRestaurantFaqs(restaurant, attributeGroups);
  const liveStatus = isActive(restaurant.listing_status) ? getLiveStatus(restaurant.opening_hours) : null;

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

      {galleryPhotos.length > 0 ? (
        <Container className="pt-4">
          <PhotoGallery photos={galleryPhotos} />
        </Container>
      ) : null}

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

        {!isActive(restaurant.listing_status) ? (
          <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${statusBannerClasses(restaurant.listing_status)}`}>
            {statusBannerMessage(restaurant.listing_status)}
          </div>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <StatusBadge status={restaurant.listing_status} liveStatus={liveStatus} detailed />
              {restaurant.owner_claimed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 whitespace-nowrap">
                  ✓ Verified Owner
                </span>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <SaveButton restaurantId={restaurant.id} label />
              <ShareButton title={restaurant.name} />
            </div>
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

            {attributeGroups.length > 0 ? (
              <div className="mt-8 space-y-6">
                {attributeGroups.map((group) => (
                  <div key={group.label}>
                    <h2 className="font-semibold">{group.label}</h2>
                    <ul className="mt-2 grid grid-cols-2 gap-y-1 text-sm text-foreground/70 sm:grid-cols-3">
                      {group.items.map((a) => (
                        <li key={a}>✓ {a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
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
              <div className="mb-6 flex flex-col gap-2">
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

            {restaurant.full_address || restaurant.phone || restaurant.opening_hours ? (
              <dl className="mb-6 space-y-4 text-sm">
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
                    {restaurant.opening_hours_checked_at ? (
                      <p className="mt-1 text-xs text-foreground/40">
                        Checked{" "}
                        {new Date(restaurant.opening_hours_checked_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </dl>
            ) : null}

            <NearbyStations data={restaurant.nearby_stations} />
            <NearbyParking data={restaurant.nearby_parking} />

            {restaurant.google_maps_url ? (
              <a
                href={restaurant.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:text-primary-dark"
              >
                View on Google Maps →
              </a>
            ) : null}

            {!restaurant.photo_url ? <SuggestPhotoForm restaurantId={restaurant.id} /> : null}
            <ReportInfoForm restaurantId={restaurant.id} />

            <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- external QR image, not an optimizable local asset */}
              <img
                src={qrCodeUrl}
                alt={`QR code linking to ${restaurant.name}'s page`}
                width={72}
                height={72}
                loading="lazy"
                className="h-[72px] w-[72px] shrink-0 rounded-lg border border-border"
              />
              <p className="text-xs text-foreground/60">
                Scan to open this page on your phone — handy for menus, table cards or flyers.
              </p>
            </div>

            {!restaurant.owner_claimed ? <ClaimListingForm restaurantId={restaurant.id} /> : null}
          </aside>
        </div>

        <div className="mt-16 max-w-3xl border-t border-border pt-10">
          <h2 className="text-xl font-bold">Reviews from Visitors</h2>
          {reviewCount > 0 ? (
            <p className="mt-1 text-sm text-foreground/60">
              <span className="font-semibold text-foreground">{averageRating!.toFixed(1)} ★</span> average from{" "}
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </p>
          ) : (
            <p className="mt-1 text-sm text-foreground/60">No reviews yet — be the first to leave one.</p>
          )}

          {reviews.length > 0 ? (
            <div className="mt-6 divide-y divide-border">
              {reviews.map((review) => (
                <div key={review.id} className="py-4 first:pt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-coral">
                      {"★".repeat(review.rating)}
                      <span className="text-border">{"★".repeat(5 - review.rating)}</span>
                    </span>
                    <span className="text-xs text-foreground/50">
                      {new Date(review.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {review.comment ? <p className="mt-1.5 text-sm text-foreground/80">{review.comment}</p> : null}
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-6 border-t border-border pt-6">
            <h3 className="text-sm font-semibold">Leave a review</h3>
            <div className="mt-3">
              <WriteReviewForm restaurantId={restaurant.id} />
            </div>
          </div>
        </div>

        {faqs.length >= 2 ? (
          <div className="mt-16 border-t border-border pt-10">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
            />
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            <div className="mt-4 max-w-3xl divide-y divide-border">
              {faqs.map((faq) => (
                <div key={faq.question} className="py-4 first:pt-0">
                  <h3 className="text-sm font-semibold">{faq.question}</h3>
                  <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {related.length > 0 ? (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl font-bold">You Might Also Like</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </>
  );
}
