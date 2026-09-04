/** Fallback hero copy when a Hidden Pricing Page leaves wording fields blank. */

export const INVESTMENT_GUIDE_EYEBROW = 'Official Investment Guide'

export const INVESTMENT_GUIDE_TAGLINE =
  "We don't just capture events; we craft heirlooms. Below you will find the collections we have curated for your story."

export const INVESTMENT_GUIDE_VIDEO_SECTION = 'Cinematography'

export const INVESTMENT_GUIDE_PHOTO_SECTION = 'Photography'

/** Prefer CMS string when non-empty; otherwise the provided fallback. */
export function resolveGuideCopy(
  value: string | null | undefined,
  fallback: string
): string {
  const trimmed = `${value ?? ''}`.trim()
  return trimmed.length > 0 ? trimmed : fallback
}
