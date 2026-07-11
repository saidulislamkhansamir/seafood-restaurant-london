"use client";

import { useActionState } from "react";
import { submitRestaurantAction, type SubmitState } from "./actions";

const initialState: SubmitState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary";

export function AddRestaurantForm() {
  const [state, formAction, pending] = useActionState(submitRestaurantAction, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
        <p className="text-lg font-semibold text-primary-dark">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="restaurant_name" className="block text-sm font-medium mb-1">
          Restaurant name *
        </label>
        <input id="restaurant_name" name="restaurant_name" required className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium mb-1">
            Your name
          </label>
          <input id="contact_name" name="contact_name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <input id="category" name="category" placeholder="e.g. Seafood restaurant" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input id="email" name="email" type="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Address
        </label>
        <input id="address" name="address" className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Anything else we should know?
        </label>
        <textarea id="message" name="message" rows={4} className={inputClass} />
      </div>

      {state.status === "error" ? <p className="text-sm text-red-600">{state.message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark transition-colors disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit Listing"}
      </button>
    </form>
  );
}
