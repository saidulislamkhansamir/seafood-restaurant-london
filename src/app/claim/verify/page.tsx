import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Confirm Listing Ownership",
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ token?: string }> };

export default async function VerifyClaimPage({ searchParams }: Props) {
  const { token } = await searchParams;

  let success = false;
  if (token) {
    const { data } = await supabase.rpc("verify_listing_claim", { p_token: token });
    success = Boolean(data);
  }

  return (
    <Container className="max-w-md py-12">
      {success ? (
        <>
          <h1 className="text-2xl font-bold">Ownership confirmed!</h1>
          <p className="mt-2 text-sm text-foreground/70">
            Thanks for confirming — this listing is now marked as claimed with a Verified Owner badge.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Link invalid or expired</h1>
          <p className="mt-2 text-sm text-foreground/70">
            This verification link is no longer valid. Confirmation links expire after 48 hours — please submit a
            new claim from the restaurant&apos;s page.
          </p>
        </>
      )}
      <Link href="/" className="mt-6 inline-block text-sm font-semibold text-primary hover:text-primary-dark">
        ← Back to homepage
      </Link>
    </Container>
  );
}
