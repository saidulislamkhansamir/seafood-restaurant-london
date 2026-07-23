import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SearchBar } from "@/components/SearchBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Pagination } from "@/components/Pagination";
import { getRestaurantsPage, getAllRestaurants, getCategories, getBoroughs } from "@/lib/data";
import { faqJsonLd } from "@/lib/seo";
import { getLiveStatus } from "@/lib/opening-hours";
import { isActive } from "@/lib/restaurant-status";

export const revalidate = 3600;

const PAGE_SIZE = 24;

type SearchParams = { q?: string; category?: string; borough?: string; page?: string; open?: string };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Boolean(params.q || params.category || params.borough);
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
  const hasFilters = Boolean(params.q || params.category || params.borough || openOnly);
  const showEditorial = !hasFilters && page === 1;
  const filters = { q: params.q, category: params.category, borough: params.borough };

  const [pageResult, categories, boroughs] = await Promise.all([
    // "Open now" isn't a stored column (it depends on the current time), so
    // it can't be filtered at the database level — fetch every matching
    // restaurant, filter by live status, then paginate the filtered list in
    // memory. Only paid for when this filter is actually on; the normal
    // path still uses efficient DB-level pagination.
    openOnly ? getAllRestaurants(filters) : getRestaurantsPage(filters, page, PAGE_SIZE),
    getCategories(),
    getBoroughs(),
  ]);

  let restaurants: Awaited<ReturnType<typeof getAllRestaurants>>;
  let total: number;
  let pageSize: number;
  if (openOnly) {
    const allOpenNow = (pageResult as Awaited<ReturnType<typeof getAllRestaurants>>).filter(
      (r) => isActive(r.listing_status) && getLiveStatus(r.opening_hours)?.open
    );
    total = allOpenNow.length;
    pageSize = PAGE_SIZE;
    restaurants = allOpenNow.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  } else {
    const paged = pageResult as Awaited<ReturnType<typeof getRestaurantsPage>>;
    restaurants = paged.restaurants;
    total = paged.total;
    pageSize = paged.pageSize;
  }
  const totalPages = Math.ceil(total / pageSize);

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
        {total} restaurant{total === 1 ? "" : "s"} {openOnly ? "open right now" : "found"}
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

      <div className="mt-4">
        <Link
          href={(() => {
            const qs = new URLSearchParams();
            if (params.q) qs.set("q", params.q);
            if (params.category) qs.set("category", params.category);
            if (params.borough) qs.set("borough", params.borough);
            if (!openOnly) qs.set("open", "true");
            const s = qs.toString();
            return `/restaurants${s ? `?${s}` : ""}`;
          })()}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            openOnly
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-foreground/70 hover:border-primary hover:text-primary"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${openOnly ? "bg-white" : "bg-green-500"}`} aria-hidden />
          {openOnly ? "Showing open now — clear" : "Show only open now"}
        </Link>
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
        <>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} searchParams={params} />
        </>
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
