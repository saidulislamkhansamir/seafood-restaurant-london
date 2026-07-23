"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { subscribeAuth, getAuthSnapshot, getServerAuthSnapshot } from "@/lib/auth-store";

export function MemberDiscountCard({ discount }: { discount: string }) {
  const { status, user } = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);

  if (status === "loading") return null;

  return (
    <div className="mb-6 rounded-xl border border-accent/30 bg-accent/5 p-4">
      <p className="text-sm font-semibold text-accent-dark">🎉 Member Discount</p>
      {user ? (
        <>
          <p className="mt-1 text-sm text-foreground/80">{discount}</p>
          <p className="mt-2 text-xs text-foreground/50">Show this page to staff to redeem.</p>
        </>
      ) : (
        <p className="mt-1 text-sm text-foreground/70">
          <Link href="/login" className="font-semibold text-accent-dark hover:underline">
            Log in
          </Link>{" "}
          to see this restaurant&apos;s member discount.
        </p>
      )}
    </div>
  );
}
