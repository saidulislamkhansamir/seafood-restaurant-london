"use client";

import { useEffect, useRef, useState } from "react";

type Network = {
  name: string;
  color: string;
  buildHref: (url: string, title: string) => string;
  Icon: (props: { className?: string }) => React.ReactElement;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.5c-4.7 0-8.5 3.6-8.5 8 0 1.6.5 3.2 1.5 4.5L4 20.5l4.7-1.4c1 .5 2.1.8 3.3.8 4.7 0 8.5-3.6 8.5-8s-3.8-8.4-8.5-8.4Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 9.3c0-.4.4-.7.8-.7h.7c.3 0 .5.2.6.5l.5 1.5c.1.3 0 .6-.2.8l-.5.5c.5 1 1.4 1.9 2.4 2.4l.5-.5c.2-.2.5-.3.8-.2l1.5.5c.3.1.5.3.5.6v.7c0 .4-.3.8-.7.8-3.3 0-6.9-3.6-6.9-6.9Z"
        fill="white"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 8.5h1.5V6h-2c-1.9 0-3 1.2-3 3.1V11H8.5v2.5H10.5V19h2.5v-5.5H15l.5-2.5h-3V9.4c0-.5.3-.9.9-.9Z"
        fill="white"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="6.5" y="10" width="2.2" height="7" rx="0.5" fill="white" />
      <circle cx="7.6" cy="7.2" r="1.3" fill="white" />
      <path
        d="M11 10h2.1v1c.6-.8 1.4-1.2 2.4-1.2 1.9 0 3 1.3 3 3.4V17h-2.2v-3.4c0-1-.4-1.7-1.4-1.7-.8 0-1.3.5-1.5 1-.1.2-.1.5-.1.8V17H11v-7Z"
        fill="white"
      />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <ellipse cx="12" cy="13.5" rx="6.5" ry="5" fill="white" />
      <circle cx="9.3" cy="13" r="1" fill="#FF4500" />
      <circle cx="14.7" cy="13" r="1" fill="#FF4500" />
      <path d="M9.5 16c.7.6 1.5.9 2.5.9s1.8-.3 2.5-.9" stroke="#FF4500" strokeWidth="1" strokeLinecap="round" />
      <path d="M12 8.5V5.5M12 5.5l2-1" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="14.3" cy="4.3" r="1" fill="white" />
      <circle cx="18" cy="12.5" r="1.4" fill="white" />
      <circle cx="6" cy="12.5" r="1.4" fill="white" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12.3 18.2 7c.6-.2 1.1.3.9.9l-2.4 10.2c-.1.6-.8.8-1.3.4l-3.3-2.6-1.7 1.7c-.2.2-.5.2-.7 0l.3-3 6-5.8-7.3 4.7-3.2-1c-.6-.2-.6-1 .1-1.2Z"
        fill="white"
      />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="7" width="14" height="10" rx="1.5" stroke="white" strokeWidth="1.5" />
      <path d="M5.5 7.5 12 12.5l6.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9.5 14.5 14.5 9.5M8 12l-2 2a2.8 2.8 0 0 0 4 4l2-2M16 12l2-2a2.8 2.8 0 0 0-4-4l-2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const NETWORKS: Network[] = [
  {
    name: "WhatsApp",
    color: "#25D366",
    buildHref: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    Icon: WhatsAppIcon,
  },
  {
    name: "Facebook",
    color: "#1877F2",
    buildHref: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    Icon: FacebookIcon,
  },
  {
    name: "X",
    color: "#000000",
    buildHref: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    Icon: XIcon,
  },
  {
    name: "LinkedIn",
    color: "#0A66C2",
    buildHref: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    Icon: LinkedInIcon,
  },
  {
    name: "Reddit",
    color: "#FF4500",
    buildHref: (url, title) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    Icon: RedditIcon,
  },
  {
    name: "Telegram",
    color: "#26A5E4",
    buildHref: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    Icon: TelegramIcon,
  },
  {
    name: "Email",
    color: "#6B7280",
    buildHref: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    Icon: EmailIcon,
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

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

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

      <div
        inert={!open}
        className={`absolute left-0 top-full z-20 mt-2 w-64 origin-top-left rounded-2xl border border-border bg-white p-4 shadow-xl transition-all duration-150 ease-out ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/40">
          Share this restaurant
        </p>
        <div className="grid grid-cols-4 gap-3">
          {NETWORKS.map(({ name, color, buildHref, Icon }) => (
            <a
              key={name}
              href={open ? buildHref(pageUrl, title) : "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="group flex flex-col items-center gap-1"
            >
              <span
                style={{ backgroundColor: color }}
                className="flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110"
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-center text-[11px] leading-tight text-foreground/70">{name}</span>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="mt-4 flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <LinkIcon className="h-4 w-4 text-foreground/60" />
          {copied ? "Link copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
