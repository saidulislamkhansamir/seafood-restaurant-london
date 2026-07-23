"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReviewsByUser, deleteReview, type UserReview } from "@/lib/data";
import { subscribeAuth, getAuthSnapshot } from "@/lib/auth-store";

export function MyReviewsList() {
  const [reviews, setReviews] = useState<UserReview[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    function refetch() {
      const { user } = getAuthSnapshot();
      if (!user) {
        if (!cancelled) setReviews([]);
        return;
      }
      getReviewsByUser(user.id).then((data) => {
        if (!cancelled) setReviews(data);
      });
    }

    refetch();
    const unsubscribe = subscribeAuth(refetch);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  async function handleDelete(id: string) {
    await deleteReview(id);
    setReviews((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
  }

  if (reviews === null) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (reviews.length === 0) {
    return <p className="text-sm text-foreground/60">You haven&apos;t written any reviews yet.</p>;
  }

  return (
    <div className="divide-y divide-border">
      {reviews.map((review) => (
        <div key={review.id} className="flex items-start justify-between gap-4 py-4 first:pt-0">
          <div>
            {review.restaurant ? (
              <Link href={`/restaurants/${review.restaurant.slug}`} className="font-semibold hover:text-primary">
                {review.restaurant.name}
              </Link>
            ) : null}
            <div className="mt-1 text-coral">
              {"★".repeat(review.rating)}
              <span className="text-border">{"★".repeat(5 - review.rating)}</span>
            </div>
            {review.comment ? <p className="mt-1 text-sm text-foreground/70">{review.comment}</p> : null}
          </div>
          <button
            type="button"
            onClick={() => handleDelete(review.id)}
            className="shrink-0 text-xs font-semibold text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
