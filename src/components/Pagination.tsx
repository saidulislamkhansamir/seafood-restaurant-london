import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key !== "page" && value) params.set(key, value);
    }
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/restaurants${qs ? `?${qs}` : ""}`;
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={page <= 1}
        className={`rounded-full border border-border px-4 py-2 text-sm font-medium transition ${
          page <= 1
            ? "pointer-events-none opacity-40"
            : "bg-white hover:border-primary hover:text-primary"
        }`}
      >
        Previous
      </Link>

      {pageNumbers.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          {i > 0 && pageNumbers[i - 1] !== n - 1 && <span className="text-foreground/40">…</span>}
          <Link
            href={hrefFor(n)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition ${
              n === page
                ? "bg-primary text-white"
                : "border border-border bg-white hover:border-primary hover:text-primary"
            }`}
          >
            {n}
          </Link>
        </span>
      ))}

      <Link
        href={hrefFor(page + 1)}
        aria-disabled={page >= totalPages}
        className={`rounded-full border border-border px-4 py-2 text-sm font-medium transition ${
          page >= totalPages
            ? "pointer-events-none opacity-40"
            : "bg-white hover:border-primary hover:text-primary"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
