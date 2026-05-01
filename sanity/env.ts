const FALLBACK_SANITY_PROJECT_ID = 'a2hh2h81'
const FALLBACK_SANITY_DATASET = 'production'

/** Sanity datasets: lowercase letters, digits, underscores, dashes; max 64 chars. */
function resolveSanityDataset(raw: string | undefined): string {
  const trimmed = raw?.trim().toLowerCase() ?? ''
  const candidate = (trimmed || FALLBACK_SANITY_DATASET).slice(0, 64)
  if (/^[a-z0-9_-]+$/.test(candidate)) return candidate
  console.warn(
    `[sanity] NEXT_PUBLIC_SANITY_DATASET is invalid (${JSON.stringify(raw)}); using ${FALLBACK_SANITY_DATASET}.`
  )
  return FALLBACK_SANITY_DATASET
}

/** Sanity allows only a-z, 0-9, dashes. Trim/lowercase; invalid values fall back so CI/Vercel builds do not crash. */
function resolveSanityProjectId(raw: string | undefined): string {
  const trimmed = raw?.trim()
  const candidate = (trimmed || FALLBACK_SANITY_PROJECT_ID).toLowerCase()
  if (/^[a-z0-9-]+$/.test(candidate)) return candidate
  console.warn(
    `[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is invalid (${JSON.stringify(raw)}); using ${FALLBACK_SANITY_PROJECT_ID}.`
  )
  return FALLBACK_SANITY_PROJECT_ID
}

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-16'

export const dataset = resolveSanityDataset(process.env.NEXT_PUBLIC_SANITY_DATASET)

export const projectId = resolveSanityProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)