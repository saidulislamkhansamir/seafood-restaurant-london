"use client";

import { useId, useState } from "react";
import { supabase } from "@/lib/supabase";
import { compressToWebp } from "@/lib/image-compress";

type Status = "idle" | "processing" | "uploading" | "done" | "error";

export function PhotoUploadField({
  name,
  label = "Photo (optional)",
}: {
  name: string;
  label?: string;
}) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sizeKb, setSizeKb] = useState<number | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setStoragePath(null);
    setStatus("processing");

    try {
      const { blob } = await compressToWebp(file);
      setSizeKb(Math.round((blob.size / 1024) * 10) / 10);
      setPreview(URL.createObjectURL(blob));

      setStatus("uploading");
      const path = `${crypto.randomUUID()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("restaurant-photos")
        .upload(path, blob, { contentType: "image/webp" });
      if (uploadError) throw uploadError;

      setStoragePath(path);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong processing that photo.");
    }
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm text-foreground/70 file:mr-4 file:rounded-full file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-border"
      />
      <input type="hidden" name={name} value={storagePath ?? ""} />

      {status === "processing" ? (
        <p className="mt-2 text-xs text-foreground/60">Compressing photo…</p>
      ) : null}
      {status === "uploading" ? <p className="mt-2 text-xs text-foreground/60">Uploading…</p> : null}
      {status === "error" ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      {status === "done" && preview ? (
        <div className="mt-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a served asset */}
          <img
            src={preview}
            alt="Preview"
            className="h-16 w-16 rounded-lg border border-border object-cover"
          />
          <p className="text-xs text-foreground/60">Ready — {sizeKb} KB (WebP)</p>
        </div>
      ) : null}
    </div>
  );
}
