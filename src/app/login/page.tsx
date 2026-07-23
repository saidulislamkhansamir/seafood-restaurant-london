"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { supabase } from "@/lib/supabase";
import { migrateLocalSavesToAccount } from "@/lib/account-saved-restaurants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.user) {
      migrateLocalSavesToAccount(data.user.id);
    }
    router.push("/");
  }

  return (
    <Container className="max-w-md py-12">
      <h1 className="text-2xl font-bold">Log in</h1>
      <p className="mt-1 text-sm text-foreground/60">Log in to save restaurants to your account.</p>

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
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary-dark">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
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
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-foreground/60">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:text-primary-dark">
          Sign up
        </Link>
      </p>
    </Container>
  );
}
