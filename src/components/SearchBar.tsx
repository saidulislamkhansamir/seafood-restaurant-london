"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Suggestion = {
  slug: string;
  name: string;
  primary_category: string | null;
  location_area: string | null;
  borough: string | null;
  rating: number | null;
  review_count: number | null;
};

export function SearchBar({
  initialQuery = "",
  initialCategory,
  initialBorough,
}: {
  initialQuery?: string;
  initialCategory?: string;
  initialBorough?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = q.trim();
    if (trimmed.length < 2) return;

    const thisRequestId = ++requestIdRef.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search-suggestions?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (requestIdRef.current === thisRequestId) {
          setSuggestions(data.results ?? []);
          setActiveIndex(-1);
        }
      } catch {
        if (requestIdRef.current === thisRequestId) setSuggestions([]);
      } finally {
        if (requestIdRef.current === thisRequestId) setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [q]);

  function goToSearch(query: string) {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (initialCategory) params.set("category", initialCategory);
    if (initialBorough) params.set("borough", initialBorough);
    setOpen(false);
    router.push(`/restaurants${params.toString() ? `?${params}` : ""}`);
  }

  function goToRestaurant(slug: string) {
    setOpen(false);
    router.push(`/restaurants/${slug}`);
  }

  const showDropdown = open && q.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (activeIndex >= 0 && suggestions[activeIndex]) {
            goToRestaurant(suggestions[activeIndex].slug);
          } else {
            goToSearch(q);
          }
        }}
        className="flex w-full overflow-hidden rounded-full border border-border bg-white shadow-sm"
      >
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!showDropdown || suggestions.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => (i + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Search by cuisine, area, or restaurant name"
          className="flex-1 px-5 py-3 text-sm outline-none placeholder:text-foreground/40"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="search-suggestions-list"
        />
        <button
          type="submit"
          className="bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          Search
        </button>
      </form>

      {showDropdown ? (
        <div
          id="search-suggestions-list"
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border bg-white shadow-lg"
        >
          {loading ? (
            <p className="px-5 py-4 text-sm text-foreground/50">Searching…</p>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToRestaurant(s.slug)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full flex-col gap-0.5 px-5 py-3 text-left transition-colors ${
                    i === activeIndex ? "bg-muted" : ""
                  }`}
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-foreground/60">
                    {[s.primary_category, s.location_area || s.borough].filter(Boolean).join(" · ")}
                    {s.rating ? ` · ★ ${s.rating.toFixed(1)}` : ""}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToSearch(q)}
                className="w-full border-t border-border px-5 py-3 text-left text-sm font-semibold text-primary hover:bg-muted"
              >
                See all results for “{q.trim()}” →
              </button>
            </>
          ) : (
            <p className="px-5 py-4 text-sm text-foreground/50">No restaurants found.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
