"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { adminListClaims, adminApproveClaim, adminRejectClaim, type AdminClaim } from "@/lib/data";

export default function AdminClaimsPage() {
  const [items, setItems] = useState<AdminClaim[] | null>(null);

  function reload() {
    adminListClaims("pending").then(setItems);
  }

  useEffect(reload, []);

  return (
    <Container className="max-w-3xl py-8">
      <h1 className="text-xl font-bold">Listing Claims</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Ownership claims for restaurants with no email on file, so they couldn&apos;t auto-verify — needs a
        manual check.
      </p>

      {items === null ? (
        <p className="mt-6 text-sm text-foreground/60">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/60">Nothing pending.</p>
      ) : (
        <div className="mt-6 divide-y divide-border">
          {items.map((c) => (
            <ClaimRow key={c.id} claim={c} onReviewed={reload} />
          ))}
        </div>
      )}
    </Container>
  );
}

function ClaimRow({ claim, onReviewed }: { claim: AdminClaim; onReviewed: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setPending(true);
    setError(null);
    try {
      await adminApproveClaim(claim.id);
      onReviewed();
    } catch {
      setError("Couldn't approve. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleReject() {
    setPending(true);
    setError(null);
    try {
      await adminRejectClaim(claim.id);
      onReviewed();
    } catch {
      setError("Couldn't reject. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="py-4">
      <p className="font-semibold">
        <Link href={`/restaurants/${claim.restaurant_slug}`} className="hover:text-primary" target="_blank">
          {claim.restaurant_name}
        </Link>
      </p>
      <dl className="mt-1 space-y-1 text-sm text-foreground/70">
        <p>Claimed by: {claim.contact_name} ({claim.contact_email})</p>
        {claim.message ? <p className="whitespace-pre-line">Message: {claim.message}</p> : null}
      </dl>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={pending}
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={pending}
          className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700 hover:border-red-400 disabled:opacity-60"
        >
          Reject
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
