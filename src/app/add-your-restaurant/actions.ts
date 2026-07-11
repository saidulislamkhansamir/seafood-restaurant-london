"use server";

import { submitRestaurant } from "@/lib/data";

export type SubmitState = { status: "idle" | "success" | "error"; message?: string };

export async function submitRestaurantAction(
  _prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const restaurant_name = String(formData.get("restaurant_name") ?? "").trim();
  if (!restaurant_name) {
    return { status: "error", message: "Restaurant name is required." };
  }

  try {
    await submitRestaurant({
      restaurant_name,
      contact_name: String(formData.get("contact_name") ?? "").trim() || undefined,
      email: String(formData.get("email") ?? "").trim() || undefined,
      phone: String(formData.get("phone") ?? "").trim() || undefined,
      category: String(formData.get("category") ?? "").trim() || undefined,
      address: String(formData.get("address") ?? "").trim() || undefined,
      message: String(formData.get("message") ?? "").trim() || undefined,
    });
    return { status: "success", message: "Thanks — we'll review your listing and be in touch." };
  } catch {
    return { status: "error", message: "Something went wrong submitting the form. Please try again." };
  }
}
