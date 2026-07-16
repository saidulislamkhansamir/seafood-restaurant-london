"use server";

import { submitRestaurantPhoto } from "@/lib/data";

export type SuggestPhotoState = { status: "idle" | "success" | "error"; message?: string };

export async function suggestPhotoAction(
  _prevState: SuggestPhotoState,
  formData: FormData
): Promise<SuggestPhotoState> {
  const restaurant_id = String(formData.get("restaurant_id") ?? "").trim();
  const storage_path = String(formData.get("photo_storage_path") ?? "").trim();

  if (!restaurant_id || !storage_path) {
    return { status: "error", message: "Please choose a photo before submitting." };
  }

  try {
    await submitRestaurantPhoto({ restaurant_id, storage_path });
    return { status: "success", message: "Thanks! We'll review your photo and add it soon." };
  } catch {
    return { status: "error", message: "Something went wrong submitting your photo. Please try again." };
  }
}
