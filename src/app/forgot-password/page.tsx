"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <Container className="max-w-md py-12">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-2 text-sm text-foreground/70">
          If an account exists for <span className="font-semibold">{email}</span>, we&apos;ve sent a link to reset
          your password.
        </p>
      </Container>
    );
  }

  return (
    <Container className="max-w-md py-12">
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <p className="mt-1 text-sm text-foreground/60">We&apos;ll email you a link to set a new password.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-sm text-foreground/60">
        <Link href="/login" className="font-semibold text-primary hover:text-primary-dark">
          Back to log in
        </Link>
      </p>
    </Container>
  );
}
