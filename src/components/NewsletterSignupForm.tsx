"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/data";

export function NewsletterSignupForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await subscribeToNewsletter(email.trim());
      setDone(true);
    } catch (err) {
      // A duplicate email (already subscribed) isn't really an error from
      // the visitor's point of view -- treat it the same as success.
      const message = err instanceof Error ? err.message : "";
      if (message.includes("duplicate") || message.includes("already exists")) {
        setDone(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return <p className="text-sm text-foreground/70">Thanks — you&apos;re on the list!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-full border border-border bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "…" : "Subscribe"}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </form>
  );
}
