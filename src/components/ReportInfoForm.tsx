"use client";

import { useActionState, useState } from "react";
import { reportInfoAction, type ReportInfoState } from "@/app/restaurants/[slug]/actions";

const initialState: ReportInfoState = { status: "idle" };

export function ReportInfoForm({ restaurantId }: { restaurantId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(reportInfoAction, initialState);

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
        🚩 See something wrong here? Report it →
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
      <input type="hidden" name="restaurant_id" value={restaurantId} />
      <p className="mb-3 text-sm font-semibold">What&apos;s wrong?</p>
      <textarea
        name="message"
        required
        rows={3}
        placeholder="E.g. wrong phone number, closed down, wrong hours…"
        className="w-full rounded-lg border border-border bg-white p-2 text-sm"
      />
      {state.status === "error" ? <p className="mt-2 text-xs text-red-600">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Report"}
      </button>
    </form>
  );
}
