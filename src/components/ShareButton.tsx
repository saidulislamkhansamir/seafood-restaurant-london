"use client";

import { useState, useSyncExternalStore } from "react";

// True only once we're actually running in the browser — used to keep the
// server-rendered pass and the very first client (hydration) pass identical,
// then flips to true right after.
function noopSubscribe() {
  return () => {};
}
function useIsMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

type IconProps = { className?: string; color: string };

type Network = {
  name: string;
  color: string;
  buildHref: (url: string, title: string) => string;
  Icon: (props: IconProps) => React.ReactElement;
};

function WhatsAppIcon({ className, color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.5c-4.7 0-8.5 3.6-8.5 8 0 1.6.5 3.2 1.5 4.5L4 20.5l4.7-1.4c1 .5 2.1.8 3.3.8 4.7 0 8.5-3.6 8.5-8s-3.8-8.4-8.5-8.4Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 9.3c0-.4.4-.7.8-.7h.7c.3 0 .5.2.6.5l.5 1.5c.1.3 0 .6-.2.8l-.5.5c.5 1 1.4 1.9 2.4 2.4l.5-.5c.2-.2.5-.3.8-.2l1.5.5c.3.1.5.3.5.6v.7c0 .4-.3.8-.7.8-3.3 0-6.9-3.6-6.9-6.9Z"
        fill={color}
      />
    </svg>
  );
}

function FacebookIcon({ className, color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 8.5h1.5V6h-2c-1.9 0-3 1.2-3 3.1V11H8.5v2.5H10.5V19h2.5v-5.5H15l.5-2.5h-3V9.4c0-.5.3-.9.9-.9Z"
        fill={color}
      />
    </svg>
  );
}

function XIcon({ className, color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <g transform="translate(12 12) scale(0.78) translate(-12 -12)">
        <path
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          fill={color}
        />
      </g>
    </svg>
  );
}

function LinkedInIcon({ className, color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="6.5" y="10" width="2.2" height="7" rx="0.5" fill={color} />
      <circle cx="7.6" cy="7.2" r="1.3" fill={color} />
      <path
        d="M11 10h2.1v1c.6-.8 1.4-1.2 2.4-1.2 1.9 0 3 1.3 3 3.4V17h-2.2v-3.4c0-1-.4-1.7-1.4-1.7-.8 0-1.3.5-1.5 1-.1.2-.1.5-.1.8V17H11v-7Z"
        fill={color}
      />
    </svg>
  );
}

function RedditIcon({ className, color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="13.5" r="6" stroke={color} strokeWidth="1.4" />
      <circle cx="9.3" cy="13" r="1" fill={color} />
      <circle cx="14.7" cy="13" r="1" fill={color} />
      <path d="M9.3 16c.7.5 1.5.8 2.7.8s2-.3 2.7-.8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 7.5V5M12 5l2-1" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="14.3" cy="3.8" r="1" stroke={color} strokeWidth="1.1" />
    </svg>
  );
}

function TelegramIcon({ className, color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12.3 18.2 7c.6-.2 1.1.3.9.9l-2.4 10.2c-.1.6-.8.8-1.3.4l-3.3-2.6-1.7 1.7c-.2.2-.5.2-.7 0l.3-3 6-5.8-7.3 4.7-3.2-1c-.6-.2-.6-1 .1-1.2Z"
        fill={color}
      />
    </svg>
  );
}

function EmailIcon({ className, color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="7" width="14" height="10" rx="1.5" stroke={color} strokeWidth="1.5" />
      <path d="M5.5 7.5 12 12.5l6.5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12.5 10 17l9-10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareGlyph({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="15" cy="4.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="15.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.9 8.8L13 5.5M6.9 11.2L13 14.5" stroke="currentColor" strokeWidth="1.5" />
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
    color: "#0F1419",
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

  // Reads the real page URL once mounted and keeps it stable from then on —
  // server snapshot is always "", so there's no hydration mismatch, and it
  // never depends on `open`, so a click can never race a re-render into
  // rewriting the href before the browser follows it.
  const mounted = useIsMounted();
  const pageUrl = mounted ? window.location.href : "";

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — nothing more we can do without a server round trip
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white py-1 pl-1 pr-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-200 ${
            open ? "bg-primary" : "bg-primary/10"
          }`}
        >
          <ShareGlyph className={open ? "text-white" : "text-primary"} />
        </span>
        <span className="text-xs font-semibold text-foreground">Share</span>
      </button>

      {/* max-w-[85vw] caps the row to the phone screen so it wraps instead
          of overflowing; sm:max-w-[420px] restores the wider desktop row. */}
      <div
        inert={!open}
        className={`flex max-w-[85vw] flex-wrap items-center gap-1 overflow-hidden py-1 transition-all duration-300 ease-out sm:max-w-[420px] ${
          open ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={handleCopyLink}
          title={copied ? "Link copied!" : "Copy link"}
          aria-label={copied ? "Link copied" : "Copy link"}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border shadow-sm transition-all duration-200 ${
            open ? "scale-100" : "scale-0"
          } hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${
            copied ? "border-green-500 bg-green-500" : "bg-white text-foreground/60 hover:text-foreground"
          }`}
        >
          {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
        </button>

        {NETWORKS.map(({ name, color, buildHref, Icon }, i) => (
          <a
            key={name}
            href={buildHref(pageUrl, title)}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${name}`}
            aria-label={`Share on ${name}`}
            style={{
              backgroundColor: `${color}17`,
              transitionDelay: open ? `${(i + 1) * 40}ms` : "0ms",
            }}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm transition-all duration-200 ${
              open ? "scale-100" : "scale-0"
            } hover:-translate-y-0.5 hover:shadow-md active:scale-95`}
          >
            <Icon color={color} className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
