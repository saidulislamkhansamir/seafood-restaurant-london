"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Container } from "@/components/Container";
import { subscribeAuth, getAuthSnapshot, getServerAuthSnapshot } from "@/lib/auth-store";
import { checkIsAdmin } from "@/lib/data";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/restaurants", label: "Restaurants" },
  { href: "/admin/submissions", label: "New Submissions" },
  { href: "/admin/claims", label: "Listing Claims" },
  { href: "/admin/edit-requests", label: "Owner Edit Requests" },
  { href: "/admin/info-reports", label: "Info Reports" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/member-discounts", label: "Member Discounts" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user } = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "resolved" && !user) router.push("/login");
  }, [status, user, router]);

  useEffect(() => {
    if (!user) return;
    checkIsAdmin().then(setIsAdmin);
  }, [user]);

  if (status === "loading" || !user || isAdmin === null) {
    return (
      <Container className="py-12">
        <p className="text-foreground/60">Loading…</p>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="py-12">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="mt-2 text-foreground/60">This account ({user.email}) doesn&apos;t have admin access.</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="pt-10">
        <h1 className="text-2xl font-bold">Admin</h1>
        <nav className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                pathname === item.href
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-foreground/70 hover:border-primary hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
      {children}
    </>
  );
}
