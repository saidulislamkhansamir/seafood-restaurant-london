import Image from "next/image";
import type { GalleryPhoto } from "@/lib/data";

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-border"
        >
          <Image src={photo.url} alt="" fill sizes="112px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}
