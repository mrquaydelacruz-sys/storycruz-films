import { urlFor } from '@/sanity/client'

/** Sanity CDN image URL tuned for web (WebP/AVIF when supported). */
export function optimizedImageUrl(
  source: unknown,
  width = 1200,
  quality = 75
): string | null {
  if (!source) return null
  return urlFor(source).width(width).quality(quality).auto('format').url()
}

export function optimizedImageUrlMobile(source: unknown): string | null {
  return optimizedImageUrl(source, 800, 72)
}
