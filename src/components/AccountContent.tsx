"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { SavedRestaurantsList } from "@/components/SavedRestaurantsList";
import { ChangeEmailForm } from "@/components/ChangeEmailForm";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { MyReviewsList } from "@/components/MyReviewsList";
import { MyClaimsList } from "@/components/MyClaimsList";
import { subscribeAuth, getAuthSnapshot, getServerAuthSnapshot } from "@/lib/auth-store";

export function AccountContent() {
  const router = useRouter();
  const { status, user } = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);

  useEffect(() => {
    if (status === "resolved" && !user) {
      router.push("/login");
    }
  }, [status, user, router]);

  if (status === "loading" || !user) {
    return (
      <Container className="max-w-3xl py-12">
        <p className="text-foreground/60">Loading your account…</p>
      </Container>
    );
  }

  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-2xl font-bold">Your Account</h1>
      <p className="mt-1 text-sm text-foreground/60">
        {user.email} · Member since{" "}
        {new Date(user.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="text-lg font-bold">Change Email</h2>
        <div className="mt-4 max-w-sm">
          <ChangeEmailForm />
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="text-lg font-bold">Change Password</h2>
        <div className="mt-4 max-w-sm">
          <ChangePasswordForm />
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="text-lg font-bold">Saved Restaurants</h2>
        <div className="mt-4">
          <SavedRestaurantsList />
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="text-lg font-bold">Your Reviews</h2>
        <div className="mt-4">
          <MyReviewsList />
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="text-lg font-bold">Your Listing Claims</h2>
        <div className="mt-4">
          <MyClaimsList />
        </div>
      </div>
    </Container>
  );
}
