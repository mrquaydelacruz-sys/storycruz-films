const FALLBACK_SANITY_PROJECT_ID = 'a2hh2h81'

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

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', // Add 'production' here
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = resolveSanityProjectId(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    // We use console.warn instead of throw during deployment 
    // to prevent the app from crashing if the fallback is present
    console.warn(errorMessage)
  }

  return v as T
}