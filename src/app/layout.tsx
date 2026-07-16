import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_IS_LIVE } from "@/lib/site-config";

const siteUrl = "https://seafoodrestaurantlondon.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seafood Restaurant London — Find the Best Seafood & Fish Restaurants",
    template: "%s | Seafood Restaurant London",
  },
  description:
    "The London restaurant directory for seafood, fish & chips, takeaway and more — browse by cuisine, borough and area across Greater London.",
  openGraph: {
    type: "website",
    siteName: "Seafood Restaurant London",
    url: siteUrl,
  },
  robots: SITE_IS_LIVE
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Seafood Restaurant London",
      url: siteUrl,
      logo: `${siteUrl}/logo/logo.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Seafood Restaurant London",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/restaurants?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
