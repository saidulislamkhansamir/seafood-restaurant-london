import type { MetadataRoute } from "next";
import { getAllRestaurants, getCategories, getBoroughs } from "@/lib/data";
import { POSTS } from "@/lib/posts";

const siteUrl = "https://seafoodrestaurantlondon.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [restaurants, categories, boroughs] = await Promise.all([
    getAllRestaurants(),
    getCategories(),
    getBoroughs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/restaurants`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/add-your-restaurant`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const restaurantRoutes: MetadataRoute.Sitemap = restaurants.map((r) => ({
    url: `${siteUrl}/restaurants/${r.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const boroughRoutes: MetadataRoute.Sitemap = boroughs.map((b) => ({
    url: `${siteUrl}/borough/${b.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...restaurantRoutes, ...categoryRoutes, ...boroughRoutes, ...postRoutes];
}
