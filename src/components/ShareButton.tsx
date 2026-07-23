"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — nothing more we can do without a server round trip
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-foreground hover:border-primary transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="15" cy="4.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="15.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6.9 8.8L13 5.5M6.9 11.2L13 14.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {copied ? "Link copied!" : "Share"}
    </button>
  );
}
