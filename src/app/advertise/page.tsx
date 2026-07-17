import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Advertise Your Restaurant",
  description: "Premium and featured listing packages on Seafood Restaurant London.",
  alternates: { canonical: "/advertise" },
};

const TIERS = [
  {
    name: "Free Listing",
    price: "£0",
    description: "Name, address, contact details and category: get discovered on the directory.",
    features: ["Basic listing", "Category & borough pages", "Google Maps link"],
  },
  {
    name: "Premium Listing",
    price: "£30–£50/mo",
    description: "Stand out with a fuller profile that converts more browsers into diners.",
    features: [
      "Everything in Free",
      "Menu, photos & gallery",
      "Booking & delivery links",
      "Priority in search results",
    ],
  },
  {
    name: "Featured Placement",
    price: "£100+/mo",
    description: "Maximum visibility across the homepage and top of category/borough pages.",
    features: [
      "Everything in Premium",
      "Homepage featured spot",
      "Top of category & borough listings",
      "Featured badge",
    ],
  },
];

export default function AdvertisePage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">Advertise Your Restaurant</h1>
      <p className="mt-3 max-w-xl text-foreground/70">
        Get in front of Londoners actively searching for somewhere to eat. Start free, upgrade
        whenever you want more visibility.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold">{tier.name}</h2>
            <p className="mt-1 text-2xl font-bold text-primary-dark">{tier.price}</p>
            <p className="mt-3 text-sm text-foreground/60">{tier.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/70">
              {tier.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-primary px-8 py-12 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to get listed?</h2>
        <Link
          href="/add-your-restaurant"
          className="rounded-full bg-accent px-6 py-3 font-semibold hover:bg-accent-dark transition-colors"
        >
          Start With a Free Listing
        </Link>
        <p className="text-sm text-white/70">
          Mention Premium or Featured in the form and we&apos;ll follow up with details.
        </p>
      </div>
    </Container>
  );
}
