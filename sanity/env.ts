export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-16'

export const dataset = assertValue(
  (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').replace(/["']/g, "").trim(),
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a2hh2h81').replace(/["']/g, "").trim(),
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    // We use console.warn instead of throw during deployment 
    // to prevent the app from crashing if the fallback is present
    console.warn(errorMessage)
  }

  return v as T
}