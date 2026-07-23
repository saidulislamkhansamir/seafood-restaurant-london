"use server";

import { SITE_URL } from "@/lib/site-config";

// Sends the ownership-confirmation email via Resend's HTTP API directly —
// this is the one piece of the claim flow that has to run server-side,
// since it needs the secret RESEND_API_KEY, which must never reach the
// browser. Everything else in the claim flow (submitting, verifying the
// token) goes through Supabase RPCs the client can call safely.
export async function sendClaimVerificationEmail(input: {
  restaurantEmail: string;
  restaurantName: string;
  token: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Email sending isn't configured yet (missing RESEND_API_KEY)." };
  }

  const verifyUrl = `${SITE_URL}/claim/verify?token=${input.token}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Seafood Restaurant London <no-reply@mail.seafoodrestaurantlondon.co.uk>",
      to: input.restaurantEmail,
      subject: `Confirm you own "${input.restaurantName}" on Seafood Restaurant London`,
      html: `
        <p>Someone requested to claim the listing for <strong>${input.restaurantName}</strong> on Seafood Restaurant London.</p>
        <p>If this was you, confirm you own this business by clicking the link below:</p>
        <p><a href="${verifyUrl}">Confirm ownership of ${input.restaurantName}</a></p>
        <p>This link expires in 48 hours. If you didn't request this, you can safely ignore this email.</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: `Failed to send verification email: ${body}` };
  }

  return { ok: true };
}
