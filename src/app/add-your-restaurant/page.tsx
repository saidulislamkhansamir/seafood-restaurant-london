import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { AddRestaurantForm } from "./AddRestaurantForm";

export const metadata: Metadata = {
  title: "Add Your Restaurant",
  description: "List your restaurant on Seafood Restaurant London for free — premium and featured placements also available.",
  alternates: { canonical: "/add-your-restaurant" },
};

export default function AddYourRestaurantPage() {
  return (
    <Container className="py-12 max-w-xl">
      <h1 className="text-3xl font-bold">Add Your Restaurant</h1>
      <p className="mt-3 text-foreground/70">
        Free basic listing. Tell us about your restaurant and we&apos;ll review and publish it —
        premium placement and featured spots are available once you&apos;re live.
      </p>
      <div className="mt-8">
        <AddRestaurantForm />
      </div>
    </Container>
  );
}
