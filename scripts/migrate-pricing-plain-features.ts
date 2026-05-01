/**
 * Converts legacy raw strings in Features / Included lists into `pricingPlainFeatureLine`
 * objects so Studio matches the schema (mixed string + object is invalid in Sanity arrays).
 *
 * Run from repo `storycruz-films` after `sanity login`:
 *
 *   npx sanity exec ./scripts/migrate-pricing-plain-features.ts --with-user-token
 *
 * Or: npm run sanity:migrate-plain-features
 *
 * Note: Sanity’s default query perspective is **published** — draft documents (`drafts.<id>`)
 * are often invisible, so the migrate would “see” clean data while Studio still shows errors.
 * This script uses **`perspective: 'raw'`** so every stored document ID is loaded and patched.
 */
import { getCliClient } from 'sanity/cli'

/** Single GROQ query (no `_id match` regex — pattern differs by API version and often parse-fails). */
function logDraftVsPublished(rows: ReadonlyArray<{ _id: string }>, label: string) {
  const draftCount = rows.filter((r) => String(r._id).startsWith('drafts.')).length
  const pubCount = rows.length - draftCount
  console.log(
    `  ${label}: ${rows.length} doc(s) — ~${pubCount} non-draft id(s), ${draftCount} draft id(s)`
  )
}

async function fetchAllPricingDocs<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
>(client: ReturnType<typeof getCliClient>) {
  const rows = await client.fetch<T[]>(
    `*[_type == "pricing"]{ _id, videoPackages, photoPackages }`
  )
  logDraftVsPublished(rows, 'pricing')
  return rows
}

async function fetchAllBriefDocs<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
>(client: ReturnType<typeof getCliClient>) {
  const rows = await client.fetch<T[]>(
    `*[_type == "packageBuilderBrief"]{ _id, photoOfferings, videoOfferings }`
  )
  logDraftVsPublished(rows, 'briefs')
  return rows
}

function newFeatureKey(seed: number) {
  return `migr_${seed}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

const SCHEMA_FEATURE_TYPES = new Set([
  'pricingPlainFeatureLine',
  'pricingPackageFeature',
])

/**
 * Sanity rejects arrays that mix primitives with objects (“Invalid list values”).
 * Normalize: strip nullish, coerce strings/numbers, drop nested arrays / unknown primitives,
 * and fix objects missing `_type` (imports / API quirks).
 */
function migrateInlineFeatureList(items: unknown): unknown[] | null {
  if (!Array.isArray(items)) return null

  const next: unknown[] = []
  let changed = false
  let keySeq = 0
  const nextKey = () => newFeatureKey(++keySeq)

  for (const item of items) {
    // Drop null holes (invalid “non-objects” in Studio).
    if (item === undefined || item === null) {
      changed = true
      continue
    }

    // Legacy string bullets.
    if (typeof item === 'string') {
      changed = true
      const t = item.trim()
      if (t.length > 0) {
        next.push({
          _type: 'pricingPlainFeatureLine',
          _key: nextKey(),
          text: t,
        })
      }
      continue
    }

    // Rare but valid in bad imports.
    if (typeof item === 'number' && Number.isFinite(item)) {
      changed = true
      next.push({
        _type: 'pricingPlainFeatureLine',
        _key: nextKey(),
        text: String(item),
      })
      continue
    }

    if (typeof item === 'bigint') {
      changed = true
      next.push({
        _type: 'pricingPlainFeatureLine',
        _key: nextKey(),
        text: item.toString(),
      })
      continue
    }

    if (typeof item === 'boolean') {
      changed = true
      next.push({
        _type: 'pricingPlainFeatureLine',
        _key: nextKey(),
        text: item ? 'Included' : 'Not included',
      })
      continue
    }

    if (Array.isArray(item)) {
      changed = true
      continue // invalid nested array; drop
    }

    if (typeof item !== 'object') {
      changed = true
      continue // symbol, etc.
    }

    const o = item as Record<string, unknown>
    const declaredType =
      typeof o._type === 'string' ? (o._type as string).trim() : ''

    if (declaredType && SCHEMA_FEATURE_TYPES.has(declaredType)) {
      next.push(o)
      continue
    }

    // Orphan `{ text }` saved without `_type`
    if (!declaredType && typeof o.text === 'string') {
      changed = true
      const txt = String(o.text).trim()
      if (!txt.length) continue
      next.push({
        _type: 'pricingPlainFeatureLine',
        _key: typeof o._key === 'string' ? (o._key as string) : nextKey(),
        text: txt,
      })
      continue
    }

    // Orphan feature row without `_type`
    if (!declaredType && typeof o.label === 'string') {
      changed = true
      const ded = o.deductionAmount
      const dedNum =
        typeof ded === 'number' && Number.isFinite(ded) && ded >= 0 ? ded : undefined
      next.push({
        _type: 'pricingPackageFeature',
        _key: typeof o._key === 'string' ? (o._key as string) : nextKey(),
        label: String(o.label).trim(),
        removable: o.removable !== false,
        ...(typeof dedNum === 'number' ? { deductionAmount: dedNum } : {}),
      })
      continue
    }

    // Unknown object — preserve (could be forwards-compatible); Studio may still error.
    next.push(o)
  }

  return changed ? next : null
}

function migratePricingPackages(packages: unknown): {
  nextPackages: unknown[]
  changed: boolean
} {
  if (!Array.isArray(packages)) {
    return { nextPackages: [], changed: false }
  }

  let changed = false
  const nextPackages = packages.map((pkg) => {
    if (!pkg || typeof pkg !== 'object') return pkg

    const row = pkg as { features?: unknown }
    const raw = row.features
    const migrated = migrateInlineFeatureList(raw)
    if (!migrated) return pkg

    changed = true
    return { ...row, features: migrated }
  })

  return { nextPackages, changed }
}

function migrateBriefOfferings(offers: unknown): {
  next: unknown[]
  changed: boolean
} {
  if (!Array.isArray(offers)) return { next: [], changed: false }

  let changed = false
  const next = offers.map((o) => {
    if (!o || typeof o !== 'object') return o

    const row = o as { included?: unknown }
    const src = Array.isArray(row.included) ? row.included : []
    const migrated = migrateInlineFeatureList(src)
    if (!migrated) return o

    changed = true
    return { ...row, included: migrated }
  })

  return { next, changed }
}

async function main() {
  console.log(
    'Migrating plain string bullets → pricingPlainFeatureLine objects (pricing + briefs)...\n'
  )

  // published default would skip many `drafts.*` rows; Studio edits those.
  const client = getCliClient({ apiVersion: '2025-07-07' }).withConfig({
    useCdn: false,
    perspective: 'raw',
  })

  type PricingDoc = {
    _id: string
    videoPackages?: unknown[]
    photoPackages?: unknown[]
  }

  const pricingDocs = await fetchAllPricingDocs<PricingDoc>(client)
  console.log('')

  let pricingPatchCount = 0
  let briefPatchCount = 0

  for (const doc of pricingDocs) {
    let patch = client.patch(doc._id)
    let touched = false

    if (Array.isArray(doc.videoPackages)) {
      const { nextPackages, changed } = migratePricingPackages(doc.videoPackages)
      if (changed) {
        patch = patch.set({ videoPackages: nextPackages })
        touched = true
      }
    }

    if (Array.isArray(doc.photoPackages)) {
      const { nextPackages, changed } = migratePricingPackages(doc.photoPackages)
      if (changed) {
        patch = patch.set({ photoPackages: nextPackages })
        touched = true
      }
    }

    if (touched) {
      await patch.commit()
      pricingPatchCount += 1
      console.log(`✓ pricing  ${doc._id}`)
    }
  }

  type BriefDoc = {
    _id: string
    photoOfferings?: unknown[]
    videoOfferings?: unknown[]
  }

  const briefs = await fetchAllBriefDocs<BriefDoc>(client)
  console.log('')

  for (const doc of briefs) {
    let patch = client.patch(doc._id)
    let touched = false

    if (Array.isArray(doc.photoOfferings)) {
      const { next, changed } = migrateBriefOfferings(doc.photoOfferings)
      if (changed) {
        patch = patch.set({ photoOfferings: next })
        touched = true
      }
    }

    if (Array.isArray(doc.videoOfferings)) {
      const { next, changed } = migrateBriefOfferings(doc.videoOfferings)
      if (changed) {
        patch = patch.set({ videoOfferings: next })
        touched = true
      }
    }

    if (touched) {
      await patch.commit()
      briefPatchCount += 1
      console.log(`✓ brief    ${doc._id}`)
    }
  }

  console.log(
    `\nSummary: patched ${pricingPatchCount} pricing doc(s), ${briefPatchCount} brief doc(s).`
  )
  if (pricingPatchCount === 0 && briefPatchCount === 0) {
    console.log(
      'Nothing to change (no string/null/primitive bullets or orphan objects without _type found).'
    )
    console.log(
      'If Studio still shows “Invalid list values”, open Vision and inspect that package’s `features` array; an unknown object shape may need a manual fix.'
    )
  } else {
    console.log('Reload Studio after this run.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
