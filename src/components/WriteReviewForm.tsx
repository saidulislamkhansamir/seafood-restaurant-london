"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { subscribeAuth, getAuthSnapshot, getServerAuthSnapshot } from "@/lib/auth-store";

const STAR_LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];

export function WriteReviewForm({ restaurantId }: { restaurantId: string }) {
  const router = useRouter();
  const { status, user } = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || rating === 0) return;
    setPending(true);
    setError(null);
    // Upsert: a second submission from the same user edits their existing
    // review rather than erroring on the one-review-per-user constraint.
    const { error } = await supabase
      .from("reviews")
      .upsert(
        { restaurant_id: restaurantId, user_id: user.id, rating, comment: comment.trim() || null },
        { onConflict: "restaurant_id,user_id" }
      );
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    router.refresh();
  }

  if (status === "loading") return null;

  if (!user) {
    return (
      <p className="text-sm text-foreground/60">
        <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
          Log in
        </Link>{" "}
        to leave a review.
      </p>
    );
  }

  if (done) {
    return <p className="text-sm text-foreground/60">Thanks for your review!</p>;
  }

  const displayRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""} — ${STAR_LABELS[n - 1]}`}
            className="text-2xl leading-none"
          >
            <span className={n <= displayRating ? "text-coral" : "text-border"}>★</span>
          </button>
        ))}
        {displayRating > 0 ? (
          <span className="ml-2 text-sm text-foreground/60">{STAR_LABELS[displayRating - 1]}</span>
        ) : null}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        className="rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending || rating === 0}
        className="self-start rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
