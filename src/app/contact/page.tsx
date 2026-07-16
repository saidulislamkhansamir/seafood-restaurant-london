import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Seafood Restaurant London.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="py-12 max-w-2xl">
      <h1 className="text-3xl font-bold">Contact</h1>
      <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
        <p>
          Questions about a listing, partnership enquiries, or spotted something out of date? Get in
          touch and we&apos;ll get back to you.
        </p>
        <p>
          Email:{" "}
          <a href="mailto:hello@seafoodrestaurantlondon.co.uk" className="font-semibold text-primary hover:text-primary-dark">
            hello@seafoodrestaurantlondon.co.uk
          </a>
        </p>
        <p>
          Restaurant owners looking to be listed should use the{" "}
          <a href="/add-your-restaurant" className="font-semibold text-primary hover:text-primary-dark">
            Add Your Restaurant
          </a>{" "}
          form instead.
        </p>
      </div>
    </Container>
  );
}
