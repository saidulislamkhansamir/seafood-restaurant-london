// Client-only: shrinks and re-encodes an uploaded photo to WebP under a
// byte budget, entirely in the browser (canvas), before it ever reaches
// the server. Keeps restaurant photos small without needing a server-side
// image pipeline.

const QUALITY_STEPS = [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
const DIMENSION_STEPS = [640, 480, 360, 240];

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not read that image file."));
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
}

export async function compressToWebp(
  file: File,
  maxBytes = 20 * 1024
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await loadImage(file);

  let best: { blob: Blob; width: number; height: number } | null = null;

  for (const maxDimension of DIMENSION_STEPS) {
    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas isn't supported in this browser.");
    ctx.drawImage(img, 0, 0, width, height);

    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToWebp(canvas, quality);
      if (!blob) continue;
      if (!best || blob.size < best.blob.size) best = { blob, width, height };
      if (blob.size <= maxBytes) return { blob, width, height };
    }
  }

  if (best) return best;
  throw new Error("Couldn't compress that image small enough — try a simpler photo.");
}
