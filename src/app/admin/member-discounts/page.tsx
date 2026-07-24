import type { Metadata } from "next";
import { AdminMemberDiscountsContent } from "@/components/AdminMemberDiscountsContent";

export const metadata: Metadata = {
  title: "Member Discounts",
  robots: { index: false, follow: false },
};

export default function AdminMemberDiscountsPage() {
  return <AdminMemberDiscountsContent />;
}
