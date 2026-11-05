import { notFound } from 'next/navigation'

/**
 * PREVIEW ONLY — catches unknown /preview/* URLs so they render the preview's own
 * not-found page (inside the preview layout) instead of the live site's 404.
 */
export default function PreviewCatchAll() {
  notFound()
}
