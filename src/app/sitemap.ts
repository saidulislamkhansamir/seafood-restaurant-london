import type { MetadataRoute } from "next";
import { getAllRestaurants, getCategories, getBoroughs, getFeatures } from "@/lib/data";
import { POSTS } from "@/lib/posts";
import { slugify, primaryAreaName } from "@/lib/utils";

const siteUrl = "https://seafoodrestaurantlondon.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [restaurants, categories, boroughs, features] = await Promise.all([
    getAllRestaurants(),
    getCategories(),
    getBoroughs(),
    getFeatures(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/restaurants`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/add-your-restaurant`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/advertise`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteUrl}/cookies`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const restaurantRoutes: MetadataRoute.Sitemap = restaurants.map((r) => ({
    url: `${siteUrl}/restaurants/${r.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const featureRoutes: MetadataRoute.Sitemap = features.map((f) => ({
    url: `${siteUrl}/feature/${f.slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  const boroughRoutes: MetadataRoute.Sitemap = boroughs.map((b) => ({
    url: `${siteUrl}/${b.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Borough+category and borough+area combos, derived directly from which
  // pairs actually occur in the data — no point listing empty combinations.
  const boroughCategoryPairs = new Set<string>();
  const boroughAreaPairs = new Set<string>();
  for (const r of restaurants) {
    if (r.borough && r.primary_category) {
      boroughCategoryPairs.add(`${slugify(r.borough)}/${slugify(r.primary_category)}`);
    }
    if (r.borough && r.location_area) {
      const boroughSlug = slugify(r.borough);
      const areaSlug = slugify(primaryAreaName(r.location_area));
      if (areaSlug !== boroughSlug) {
        boroughAreaPairs.add(`${boroughSlug}/${areaSlug}`);
      }
    }
  }

  const boroughComboRoutes: MetadataRoute.Sitemap = [
    ...Array.from(boroughCategoryPairs),
    ...Array.from(boroughAreaPairs),
  ].map((path) => ({
    url: `${siteUrl}/${path}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const postRoutes: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...restaurantRoutes,
    ...categoryRoutes,
    ...featureRoutes,
    ...boroughRoutes,
    ...boroughComboRoutes,
    ...postRoutes,
  ];
}
