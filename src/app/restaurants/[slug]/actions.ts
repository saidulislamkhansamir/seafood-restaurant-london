"use server";

import { submitRestaurantPhoto, submitInfoReport } from "@/lib/data";

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
    const { isHero } = await submitRestaurantPhoto({ restaurant_id, storage_path });
    return {
      status: "success",
      message: isHero
        ? "Thanks! Your photo is now live on this page."
        : "Thanks! Your photo has been added to the gallery below.",
    };
  } catch {
    return { status: "error", message: "Something went wrong submitting your photo. Please try again." };
  }
}

export type ReportInfoState = { status: "idle" | "success" | "error"; message?: string };

export async function reportInfoAction(
  _prevState: ReportInfoState,
  formData: FormData
): Promise<ReportInfoState> {
  const restaurant_id = String(formData.get("restaurant_id") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!restaurant_id || !message) {
    return { status: "error", message: "Please tell us what's wrong before sending." };
  }

  try {
    await submitInfoReport({ restaurant_id, message });
    return { status: "success", message: "Thanks! We'll look into it." };
  } catch {
    return { status: "error", message: "Something went wrong sending your report. Please try again." };
  }
}
