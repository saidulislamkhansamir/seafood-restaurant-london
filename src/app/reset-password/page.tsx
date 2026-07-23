"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { supabase } from "@/lib/supabase";
import { subscribeAuth, getAuthSnapshot, getServerAuthSnapshot } from "@/lib/auth-store";

export default function ResetPasswordPage() {
  const router = useRouter();
  // Clicking the emailed reset link makes Supabase auto-detect the recovery
  // token in the URL and establish a session — the auth store picks that up
  // the same way it picks up a normal login.
  const { status, user } = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/"), 1500);
  }

  if (done) {
    return (
      <Container className="max-w-md py-12">
        <h1 className="text-2xl font-bold">Password updated</h1>
        <p className="mt-2 text-sm text-foreground/70">Taking you back to the homepage…</p>
      </Container>
    );
  }

  if (status === "resolved" && !user) {
    return (
      <Container className="max-w-md py-12">
        <h1 className="text-2xl font-bold">Reset link expired</h1>
        <p className="mt-2 text-sm text-foreground/70">
          This password reset link is invalid or has expired. Request a new one from the login page.
        </p>
      </Container>
    );
  }

  return (
    <Container className="max-w-md py-12">
      <h1 className="text-2xl font-bold">Set a new password</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            New password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "Updating…" : "Update password"}
        </button>
      </form>
    </Container>
  );
}
