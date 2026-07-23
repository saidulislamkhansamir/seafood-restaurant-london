"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { submitListingClaim } from "@/lib/data";
import { subscribeAuth, getAuthSnapshot, getServerAuthSnapshot } from "@/lib/auth-store";

export function ClaimListingForm({ restaurantId }: { restaurantId: string }) {
  const { status, user } = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setPending(true);
    setError(null);
    try {
      await submitListingClaim({
        restaurant_id: restaurantId,
        user_id: user.id,
        contact_name: name,
        contact_email: email,
        message: message.trim() || undefined,
      });
      setDone(true);
    } catch {
      setError("Something went wrong submitting your claim. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (status === "loading") return null;

  if (done) {
    return <p className="mt-6 text-sm text-foreground/60">Thanks! We&apos;ll review your claim and get back to you.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 text-sm font-semibold text-primary hover:text-primary-dark"
      >
        🏷️ Is this your restaurant? Claim this listing →
      </button>
    );
  }

  if (!user) {
    return (
      <p className="mt-6 text-sm text-foreground/60">
        <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
          Log in
        </Link>{" "}
        to claim this listing.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      <div>
        <label htmlFor="claim-name" className="block text-sm font-medium">
          Your name
        </label>
        <input
          id="claim-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="claim-email" className="block text-sm font-medium">
          Contact email
        </label>
        <input
          id="claim-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="claim-message" className="block text-sm font-medium">
          Message (optional)
        </label>
        <textarea
          id="claim-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit claim"}
      </button>
    </form>
  );
}
