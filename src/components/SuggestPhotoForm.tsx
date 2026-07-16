"use client";

import { useActionState, useState } from "react";
import { PhotoUploadField } from "@/components/PhotoUploadField";
import { suggestPhotoAction, type SuggestPhotoState } from "@/app/restaurants/[slug]/actions";

const initialState: SuggestPhotoState = { status: "idle" };

export function SuggestPhotoForm({ restaurantId }: { restaurantId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(suggestPhotoAction, initialState);

  if (state.status === "success") {
    return <p className="mt-6 text-sm text-primary-dark">{state.message}</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 text-sm font-semibold text-primary hover:text-primary-dark"
      >
        📷 Have a photo of this place? Suggest it →
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <p className="mb-3 text-sm font-semibold">Suggest a photo</p>
      <PhotoUploadField name="photo_storage_path" label="Choose a photo" />
      {state.status === "error" ? <p className="mt-2 text-xs text-red-600">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit Photo"}
      </button>
    </form>
  );
}
