"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { adminListRecentPhotos, adminRemovePhoto, type AdminPhoto } from "@/lib/data";

export default function AdminPhotosPage() {
  const [items, setItems] = useState<AdminPhoto[] | null>(null);

  function reload() {
    adminListRecentPhotos(30).then(setItems);
  }

  useEffect(reload, []);

  return (
    <Container className="max-w-4xl py-8">
      <h1 className="text-xl font-bold">Photos</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Photos go live as soon as they&apos;re submitted, so this is a recent-activity view — remove anything
        that shouldn&apos;t be here.
      </p>

      {items === null ? (
        <p className="mt-6 text-sm text-foreground/60">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/60">No photo submissions yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((p) => (
            <PhotoTile key={p.id} photo={p} onRemoved={reload} />
          ))}
        </div>
      )}
    </Container>
  );
}

function PhotoTile({ photo, onRemoved }: { photo: AdminPhoto; onRemoved: () => void }) {
  const [pending, setPending] = useState(false);

  async function handleRemove() {
    if (!confirm(`Remove this photo from ${photo.restaurant_name}?`)) return;
    setPending(true);
    try {
      await adminRemovePhoto(photo.restaurant_id, photo.storage_path);
      onRemoved();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="relative h-28 w-full">
        <Image src={photo.url} alt={photo.restaurant_name} fill sizes="200px" className="object-cover" />
        {photo.is_current_hero ? (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
            Hero
          </span>
        ) : null}
      </div>
      <div className="p-2">
        <Link
          href={`/restaurants/${photo.restaurant_slug}`}
          target="_blank"
          className="block truncate text-xs font-semibold hover:text-primary"
        >
          {photo.restaurant_name}
        </Link>
        <button
          type="button"
          onClick={handleRemove}
          disabled={pending}
          className="mt-1.5 w-full rounded-lg border border-red-200 bg-red-50 py-1 text-xs font-semibold text-red-700 hover:border-red-400 disabled:opacity-60"
        >
          {pending ? "…" : "Remove"}
        </button>
      </div>
    </div>
  );
}
