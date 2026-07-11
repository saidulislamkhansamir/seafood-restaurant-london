import type { MetadataRoute } from "next";

const siteUrl = "https://seafoodrestaurantlondon.co.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
