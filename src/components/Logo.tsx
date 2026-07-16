export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="var(--color-primary)" />
      <path
        d="M8,24 C8,15 17,9 27,9 C37,9 43.5,16 45,24 C43.5,32 37,39 27,39 C17,39 8,33 8,24 Z"
        fill="var(--color-background)"
      />
      <polygon points="9,20 2,7 12,19" fill="var(--color-background)" />
      <polygon points="9,28 2,41 12,29" fill="var(--color-background)" />
      <polygon points="20,10 24,2.5 29,11" fill="var(--color-background)" />
      <circle cx="35" cy="20.5" r="2.4" fill="var(--color-accent)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="text-xl font-bold tracking-tight text-primary-dark">
        Seafood Restaurant London
      </span>
    </span>
  );
}
