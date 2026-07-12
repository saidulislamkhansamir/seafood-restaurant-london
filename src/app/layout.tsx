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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
