import type { Metadata } from "next";
import { AccountContent } from "@/components/AccountContent";

export const metadata: Metadata = {
  title: "Your Account",
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return <AccountContent />;
}
