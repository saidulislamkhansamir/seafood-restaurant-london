"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getClaimsByUser, type UserClaim } from "@/lib/data";
import { subscribeAuth, getAuthSnapshot } from "@/lib/auth-store";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export function MyClaimsList() {
  const [claims, setClaims] = useState<UserClaim[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    function refetch() {
      const { user } = getAuthSnapshot();
      if (!user) {
        if (!cancelled) setClaims([]);
        return;
      }
      getClaimsByUser(user.id).then((data) => {
        if (!cancelled) setClaims(data);
      });
    }

    refetch();
    const unsubscribe = subscribeAuth(refetch);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (claims === null) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (claims.length === 0) {
    return <p className="text-sm text-foreground/60">You haven&apos;t claimed any listings yet.</p>;
  }

  return (
    <div className="divide-y divide-border">
      {claims.map((claim) => (
        <div key={claim.id} className="flex items-center justify-between gap-4 py-4 first:pt-0">
          {claim.restaurant ? (
            <Link href={`/restaurants/${claim.restaurant.slug}`} className="font-semibold hover:text-primary">
              {claim.restaurant.name}
            </Link>
          ) : (
            <span className="font-semibold text-foreground/50">Restaurant no longer listed</span>
          )}
          <span
            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
              STATUS_STYLES[claim.status] ?? "bg-gray-50 text-gray-600 border-gray-200"
            }`}
          >
            {claim.status}
          </span>
        </div>
      ))}
    </div>
  );
}
