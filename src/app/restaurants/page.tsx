import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SearchBar } from "@/components/SearchBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Pagination } from "@/components/Pagination";
import { NearMeButton } from "@/components/NearMeButton";
import { RestaurantsMap } from "@/components/RestaurantsMap";
import { getRestaurantsPage, getAllRestaurants, getCategories, getBoroughs, type Restaurant } from "@/lib/data";
import { faqJsonLd } from "@/lib/seo";
import { getLiveStatus } from "@/lib/opening-hours";
import { isActive } from "@/lib/restaurant-status";
import { distanceMiles } from "@/lib/geo";

export const revalidate = 3600;

const PAGE_SIZE = 24;
const PRICES = ["£", "££", "£££", "££££"];
// Curated from the most common real attribute values in the data — not an
// exhaustive list of everything in the `attributes` column, just the ones
// common and clear-cut enough to be useful as filters.
const ATTRIBUTES = [
  "Takeaway",
  "Delivery",
  "Reservations",
  "Wheelchair accessible",
  "Outdoor seating",
  "Family friendly",
  "Dog friendly",
  "Vegetarian options",
  "Vegan options",
  "Gluten-free options",
  "Halal options",
];

type SearchParams = {
  q?: string;
  category?: string;
  borough?: string;
  page?: string;
  open?: string;
  price?: string;
  attrs?: string;
  lat?: string;
  lng?: string;
  sort?: string;
  view?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Boolean(params.q || params.category || params.borough || params.price || params.attrs);
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const canonical = hasFilters || page <= 1 ? "/restaurants" : `/restaurants?page=${page}`;
  return {
    title: "All Restaurants",
    description: "Browse every restaurant listed on Seafood Restaurant London, filterable by cuisine, borough and area.",
    alternates: { canonical },
  };
}

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const openOnly = params.open === "true";
  const mapView = params.view === "map";
  const lat = params.lat ? Number.parseFloat(params.lat) : null;
  const lng = params.lng ? Number.parseFloat(params.lng) : null;
  const sortByDistance = params.sort === "distance" && lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng);
  const selectedAttrs = params.attrs ? params.attrs.split(",").filter(Boolean) : [];
  const hasFilters = Boolean(
    params.q || params.category || params.borough || params.price || openOnly || selectedAttrs.length > 0
  );
  const showEditorial = !hasFilters && page === 1 && !sortByDistance;
  const filters = {
    q: params.q,
    category: params.category,
    borough: params.borough,
    price: params.price,
    attrs: selectedAttrs,
  };

  // "Open now" and "near me" both need every matching row up front (the
  // former depends on the current time, the latter on distance from the
  // visitor) — neither can be filtered/sorted at the database level, so
  // fetch-all-then-filter-in-memory-then-paginate is used for both. The
  // normal path still uses efficient DB-level pagination.
  const needsAll = openOnly || sortByDistance || mapView;

  const [pageResult, categories, boroughs] = await Promise.all([
    needsAll ? getAllRestaurants(filters) : getRestaurantsPage(filters, page, PAGE_SIZE),
    getCategories(),
    getBoroughs(),
  ]);

  let restaurants: Restaurant[];
  let total: number;
  let pageSize: number;
  let distanceById: Map<string, number> | null = null;

  if (needsAll) {
    let list = pageResult as Restaurant[];
    if (openOnly) {
      list = list.filter((r) => isActive(r.listing_status) && getLiveStatus(r.opening_hours)?.open);
    }
    if (sortByDistance && lat != null && lng != null) {
      distanceById = new Map(
        list
          .filter((r) => r.lat != null && r.lng != null)
          .map((r) => [r.id, distanceMiles(lat, lng, r.lat!, r.lng!)])
      );
      list = [...list].sort((a, b) => {
        const da = distanceById!.get(a.id) ?? Infinity;
        const db = distanceById!.get(b.id) ?? Infinity;
        return da - db;
      });
    }
    total = list.length;
    pageSize = mapView ? total || 1 : PAGE_SIZE;
    restaurants = mapView ? list : list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  } else {
    const paged = pageResult as Awaited<ReturnType<typeof getRestaurantsPage>>;
    restaurants = paged.restaurants;
    total = paged.total;
    pageSize = paged.pageSize;
  }
  const totalPages = mapView ? 1 : Math.ceil(total / pageSize);

  function withParams(overrides: Record<string, string | undefined>): string {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.category) qs.set("category", params.category);
    if (params.borough) qs.set("borough", params.borough);
    if (params.price) qs.set("price", params.price);
    if (selectedAttrs.length > 0) qs.set("attrs", selectedAttrs.join(","));
    if (openOnly) qs.set("open", "true");
    if (sortByDistance && lat != null && lng != null) {
      qs.set("lat", String(lat));
      qs.set("lng", String(lng));
      qs.set("sort", "distance");
    }
    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined) qs.delete(key);
      else qs.set(key, value);
    }
    const s = qs.toString();
    return `/restaurants${s ? `?${s}` : ""}`;
  }

  function hrefToggleAttr(attr: string): string {
    const next = selectedAttrs.includes(attr)
      ? selectedAttrs.filter((a) => a !== attr)
      : [...selectedAttrs, attr];
    return withParams({ attrs: next.length > 0 ? next.join(",") : undefined, page: undefined });
  }

  const faqs = [
    {
      question: "How is this restaurant list sorted?",
      answer:
        "By default you're seeing our full directory in listing order. Use the search bar to find a name or dish, or jump to a specific cuisine or borough page for a shorter, more targeted list.",
    },
    {
      question: "Can I filter by borough and cuisine at the same time?",
      answer:
        "Yes. Combine a category and borough filter in the URL, or start from a specific cuisine or borough page and narrow down from there, to see only restaurants that match both.",
    },
    {
      question: "How up to date are the ratings, hours and contact details?",
      answer:
        "We verify listings against restaurant websites and public sources rather than auto-generating them, so hours, ratings and emails reflect what each restaurant has actually published, not estimates.",
    },
    {
      question: "A restaurant is missing or listed incorrectly. What do I do?",
      answer: "Get in touch through our Contact page and we'll check it and update the listing.",
    },
  ];

  return (
    <Container className="py-12">
      {showEditorial ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
      ) : null}
      <h1 className="text-3xl font-bold">All Restaurants</h1>
      <p className="mt-2 text-foreground/60">
        {total} restaurant{total === 1 ? "" : "s"}{" "}
        {openOnly ? "open right now" : sortByDistance ? "found, nearest first" : "found"}
      </p>
      {showEditorial ? (
        <p className="mt-4 text-foreground/70 leading-relaxed">
          This is the full Seafood Restaurant London directory: every seafood restaurant, fish and
          chip shop and seafood takeaway we&apos;ve listed across Greater London, in one searchable
          page. Search by name or dish below, or narrow things down by cuisine or borough if you
          already know what you&apos;re after.
        </p>
      ) : null}

      <div className="mt-6">
        <SearchBar initialQuery={params.q} initialCategory={params.category} initialBorough={params.borough} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={withParams({ open: openOnly ? undefined : "true", page: undefined })}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            openOnly
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-foreground/70 hover:border-primary hover:text-primary"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${openOnly ? "bg-white" : "bg-green-500"}`} aria-hidden />
          {openOnly ? "Showing open now — clear" : "Show only open now"}
        </Link>

        {PRICES.map((price) => (
          <Link
            key={price}
            href={withParams({ price: params.price === price ? undefined : price, page: undefined })}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              params.price === price
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-foreground/70 hover:border-primary hover:text-primary"
            }`}
          >
            {price}
          </Link>
        ))}

        <NearMeButton active={sortByDistance} />

        <Link
          href={withParams({ view: mapView ? undefined : "map", page: undefined })}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            mapView
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-foreground/70 hover:border-primary hover:text-primary"
          }`}
        >
          {mapView ? "☰ List view" : "🗺️ Map view"}
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {ATTRIBUTES.map((attr) => {
          const active = selectedAttrs.includes(attr);
          return (
            <Link
              key={attr}
              href={hrefToggleAttr(attr)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-foreground/70 hover:border-primary hover:text-primary"
              }`}
            >
              {active ? "✓ " : ""}
              {attr}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {categories.slice(0, 10).map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary transition"
          >
            {cat.name}
          </Link>
        ))}
        <Link href="/cuisines" className="text-xs font-semibold text-primary hover:underline">
          All cuisines →
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {boroughs.slice(0, 8).map((b) => (
          <Link
            key={b.slug}
            href={`/${b.slug}`}
            className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-primary transition"
          >
            {b.name}
          </Link>
        ))}
        <Link href="/areas" className="text-xs font-semibold text-primary hover:underline">
          All areas →
        </Link>
      </div>

      {restaurants.length > 0 ? (
        mapView ? (
          <div className="mt-10">
            <RestaurantsMap restaurants={restaurants} />
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} distanceMiles={distanceById?.get(r.id)} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} searchParams={params} />
          </>
        )
      ) : (
        <p className="mt-10 text-foreground/60">No restaurants match that search yet. Try a different term.</p>
      )}

      {showEditorial ? (
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="text-xl font-bold">About This Directory</h2>
          <div className="mt-4 space-y-4 text-sm text-foreground/70 leading-relaxed">
            <p>
              We built this list one restaurant at a time rather than scraping a single dataset and
              publishing it as-is. That means checking each restaurant&apos;s own website and public
              listings for opening hours, contact emails and ratings, and leaving a field blank rather
              than guessing when the information isn&apos;t clearly available. It also means the
              directory is still growing borough by borough, so if an area looks light on options
              today, expect more listings there over time.
            </p>
            <p>
              If you&apos;d rather browse a shorter, curated list,{" "}
              <Link href="/cuisines" className="font-semibold text-primary hover:text-primary-dark">
                Browse by Cuisine
              </Link>{" "}
              and{" "}
              <Link href="/areas" className="font-semibold text-primary hover:text-primary-dark">
                Explore by Borough
              </Link>{" "}
              both link through to focused pages for a specific cuisine or part of London.
            </p>
          </div>

          <h2 className="mt-10 text-xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-4 divide-y divide-border">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-4 first:pt-0">
                <h3 className="text-sm font-semibold">{faq.question}</h3>
                <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Container>
  );
}
