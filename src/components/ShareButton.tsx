"use client";

import { useEffect, useRef, useState } from "react";

type Network = {
  name: string;
  buildHref: (url: string, title: string) => string;
};

const NETWORKS: Network[] = [
  {
    name: "WhatsApp",
    buildHref: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: "Facebook",
    buildHref: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    buildHref: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "LinkedIn",
    buildHref: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Reddit",
    buildHref: (url, title) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    name: "Telegram",
    buildHref: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "Email",
    buildHref: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
];

export function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — nothing more we can do without a server round trip
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-foreground hover:border-primary transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="15" cy="4.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="5" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="15" cy="15.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6.9 8.8L13 5.5M6.9 11.2L13 14.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Share
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded-xl border border-border bg-white p-1.5 shadow-lg">
          {NETWORKS.map((network) => (
            <a
              key={network.name}
              href={network.buildHref(window.location.href, title)}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              {network.name}
            </a>
          ))}
          <button
            type="button"
            onClick={handleCopyLink}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
          >
            {copied ? "Link copied!" : "Copy Link"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
