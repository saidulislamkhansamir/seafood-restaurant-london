import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SavedRestaurantsList } from "@/components/SavedRestaurantsList";

export const metadata: Metadata = {
  title: "Saved Restaurants",
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold">Saved Restaurants</h1>
      <p className="mt-2 text-foreground/60">Restaurants you&apos;ve saved on this device.</p>
      <div className="mt-8">
        <SavedRestaurantsList />
      </div>
    </Container>
  );
}
