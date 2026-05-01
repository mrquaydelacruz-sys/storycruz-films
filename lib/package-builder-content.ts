/** Shared package-builder catalog row (Sanity-driven or fallback). */

import type { AddonTotalsToward, PackageCatalogItem } from '@/lib/package-catalog-types'
import { enrichCatalogItems } from '@/lib/package-catalog-math'
import { packageFeaturesRawToIncludedLines } from '@/lib/pricing-features-normalize'
import {
  seasonalCollectionsToCatalog,
  normalizeOptionalAddOnRowsForParent,
  photoPackagesFromPricing,
  videoPackagesFromPricing,
} from '@/lib/pricing-to-package-catalog'
import { stripHoistedEnhancementTiersFromCatalog } from '@/lib/pricing-hoist-enhancement-tiers'
import {
  INVESTMENT_GUIDE_EYEBROW,
  INVESTMENT_GUIDE_TAGLINE,
} from '@/lib/investment-guide-copy'

export type { PackageCatalogItem } from '@/lib/package-catalog-types'

/** Slug of the live investment guide (Hidden Pricing Page). Used as default in Studio. */
export { DEFAULT_INVESTMENT_GUIDE_SLUG } from '@/lib/pricing-to-package-catalog'

export type PricingForPackageGroq = {
  /** Hidden Pricing Page document title — same headline as /investment/[slug]. */
  title?: string | null
  /** Resolved hero MP4 URL (empty if no asset uploaded). */
  heroVideoUrl?: string | null
  videoPackages?: unknown
  photoPackages?: unknown
  seasonalCollections?: unknown
} | null

/** Default copy used when Sanity has no doc yet or a field is left blank where noted. */

export const PACKAGE_BUILDER_DEFAULTS = {
  eyebrow: '',
  title: 'Build your package',
  intro:
    'Choose photography and cinematography options, customize what stays in your package, then send us your draft—we’ll follow up with next steps.',
  photoColumnTitle: 'Photography',
  photoColumnSubtitle: 'Tap to add · Edit on selected cards to customize inclusions',
  videoColumnTitle: 'Cinematography',
  videoColumnSubtitle: 'Tap to add · Edit on selected cards to customize inclusions',
  addonSectionTitle: 'Enhancements',
  addonSectionSubtitle:
    'Add extras from the list below to any selected photography or cinematography package.',
  variablesSectionTitle: 'Customize quantities & extras',
  variablesSectionSubtitle: 'Optional quantities and add-ons you can tune below.',
} as const

/** Sanity → UI + math (counts or curated picks). */

export type PackageBuilderVariableResolvedQuantity = {
  kind: 'quantity'
  reactKey: string
  key: string
  title: string
  description: string
  unitLabel: string
  min: number
  max: number
  defaultCount: number
  pricePerUnit: string | null
  totalsToward: AddonTotalsToward
}

export type PackageBuilderVariableResolvedFeaturePick = {
  kind: 'feature_pick'
  reactKey: string
  key: string
  title: string
  description: string
  allowMultiple: boolean
  optionsCatalog: PackageCatalogItem[]
}

export type PackageBuilderVariableResolved =
  | PackageBuilderVariableResolvedQuantity
  | PackageBuilderVariableResolvedFeaturePick

/** Site fallback when Studio lists are empty (or missing). Mirrors the previous embedded catalog. */
export const FALLBACK_PHOTO_CATALOG: PackageCatalogItem[] = [
  {
    id: 'photo-full-day',
    title: 'Full-day photography',
    description: 'Coverage from getting ready through key reception moments.',
    price: '$4,200 + GST',
    included: [
      'Continuous coverage — typical window agreed in contract',
      'Two lead photographers consult on final call sheet',
      'Colour-corrected high-resolution JPEGs via private gallery',
      'Printing rights for personal use',
    ],
  },
  {
    id: 'photo-ceremony',
    title: 'Ceremony documentation',
    description: 'Dedicated capture of your ceremony start to finish.',
    price: '$950 + GST',
    included: [
      'Ceremony arrival through recessional',
      'Multiple angles where venue allows',
      'Delivered with your main gallery or à la carte per agreement',
    ],
  },
  {
    id: 'photo-reception',
    title: 'Reception documentation',
    description: 'Speeches, dances, and celebration on the floor.',
    price: '$1,100 + GST',
    included: ['Grand entrance through formalities', 'Dancefloor & ambient coverage'],
  },
  {
    id: 'photo-second',
    title: 'Second photographer',
    description: 'Two angles and fuller guest coverage.',
    price: '$800 + GST',
    included: ["Pairs with principal shooter's timeline", 'Candids & overlapping moments'],
  },
  {
    id: 'photo-engagement',
    title: 'Engagement / pre-wedding session',
    description: 'A separate session before the big day.',
    price: '$450 + GST',
    included: ['1–2 hour session', 'Location within metro (travel extra if noted)', 'Edited proof set'],
  },
  {
    id: 'photo-extra-hours',
    title: 'Additional hours',
    description: 'Extend coverage when the party runs late.',
    price: '$350/hr + GST',
    included: ['Billed per started hour unless packaged', 'Applies only with booked lead photographer'],
  },
  {
    id: 'photo-drone',
    title: 'Drone aerials (photo)',
    description: 'Stills or aerial perspectives where permitted.',
    price: '$300 + GST',
    included: [
      'Subject to CASA rules & venue approval',
      'Selected still frames delivered with gallery',
    ],
  },
]

export const FALLBACK_VIDEO_CATALOG: PackageCatalogItem[] = [
  {
    id: 'video-ceremony-doc',
    title: 'Ceremony — full documentation',
    description: 'Multi-cam style edit of the full ceremony.',
    price: '$1,200 + GST',
    included: [
      'Ceremony synced multi-angle edit',
      'Natural audio prioritised where captured',
      'Delivery as digital download (resolution per package)',
    ],
  },
  {
    id: 'video-reception-doc',
    title: 'Reception — full documentation',
    description: 'Key reception moments in an extended cut.',
    price: '$1,050 + GST',
    included: ['Speeches & formalities coverage', 'Cut length reflects booked hours'],
  },
  {
    id: 'video-highlight',
    title: 'Highlight film',
    description: 'Cinematic short film of the day.',
    price: 'From $2,400 + GST',
    included: [
      '~4–8 min runtime (finalize in consult)',
      'Licensed music sourcing support',
      'Colour grade & cinematic pacing',
    ],
  },
  {
    id: 'video-feature',
    title: 'Feature / long-form edit',
    description: 'Expanded storytelling beyond a highlight.',
    price: 'From $1,800 + GST',
    included: ['Long-form chronological or hybrid structure', 'Add-on to highlight or standalone quote'],
  },
  {
    id: 'video-extra-hours',
    title: 'Additional hours',
    description: 'More time on site for video.',
    price: '$400/hr + GST',
    included: ['Video lead only — pair with photography add-ons separately'],
  },
  {
    id: 'video-drone',
    title: 'Drone footage',
    description: 'Aerial b-roll where flight is allowed.',
    price: '$350 + GST',
    included: ['Safety & clearance dependent', 'Graded aerials cut into films when applicable'],
  },
  {
    id: 'video-raw',
    title: 'Raw footage delivery',
    description: 'Organized source files for your archive.',
    price: '$500 + GST',
    included: ['Foldered by camera / timeline', 'As-recorded — not a polished edit'],
  },
]

type SanityOfferingRow = {
  key?: string | null
  title?: string | null
  description?: string | null
  price?: string | null
  included?: unknown[] | null
  _key?: string | null
  addonTotalsToward?: string | null
  optionalPackageAddOns?: unknown[] | null
}

export type SanityPackageVariableGroqRow = {
  _key?: string | null
  key?: string | null
  title?: string | null
  description?: string | null
  variableKind?: 'quantity' | 'feature_pick' | string | null
  unitLabel?: string | null
  minQuantity?: number | null
  maxQuantity?: number | null
  defaultQuantity?: number | null
  pricePerUnit?: string | null
  quantityTotalsToward?: string | null
  pickAllowMultiple?: boolean | null
  pickOptions?: SanityOfferingRow[] | null
}

export type PackageBuilderGroqDoc = {
  pageEyebrow?: string | null
  pageTitle?: string | null
  pageIntro?: string | null
  photoColumnTitle?: string | null
  photoColumnSubtitle?: string | null
  videoColumnTitle?: string | null
  videoColumnSubtitle?: string | null
  photoOfferings?: SanityOfferingRow[] | null
  videoOfferings?: SanityOfferingRow[] | null
  addonSectionTitle?: string | null
  addonSectionSubtitle?: string | null
  addonOfferings?: SanityOfferingRow[] | null
  variablesSectionTitle?: string | null
  variablesSectionSubtitle?: string | null
  packageVariables?: SanityPackageVariableGroqRow[] | null
  /** When true or unset, photo/video columns start from the linked Hidden Pricing Page. */
  useInvestmentGuide?: boolean | null
  /** Slug of the `pricing` document (e.g. investment-guide). */
  investmentPricingSlug?: string | null
}

function coerceAddonTotalsToward(v: unknown): AddonTotalsToward | undefined {
  if (v === 'photography' || v === 'cinematography' || v === 'standalone') return v
  return undefined
}

function rowToCatalogItem(
  row: SanityOfferingRow,
  opts?: {
    idPrefix?: string
    addonMode?: boolean
    optionalAddonRollupDefault?: AddonTotalsToward
  }
): PackageCatalogItem | null {
  const title = String(row.title ?? '').trim()
  const description = String(row.description ?? '').trim()
  const rawKey = String(row.key ?? '').trim()
  const baseId = rawKey || String(row._key ?? '').trim()
  const id = opts?.idPrefix ? `${opts.idPrefix}${baseId}` : baseId
  if (!title || !description || !baseId) return null
  const priceRaw = typeof row.price === 'string' ? row.price.trim() : ''

  const item: PackageCatalogItem = { id, title, description }
  if (priceRaw) item.price = priceRaw

  if (opts?.addonMode) {
    item.addonTotalsToward = coerceAddonTotalsToward(row.addonTotalsToward) ?? 'standalone'
  }

  const featLines = packageFeaturesRawToIncludedLines(id, row.included)
  if (featLines.length) {
    item.included = featLines.map((l) => l.label)
    item.includedLines = featLines
  }

  /** When Studio omits per-row rollup, tier add-ons inherit photo vs vid column; addon rows roll to standalone. */
  const optionalRollupFallback: AddonTotalsToward = opts?.addonMode
    ? 'standalone'
    : (opts?.optionalAddonRollupDefault ?? 'photography')

  const pkgOptional = normalizeOptionalAddOnRowsForParent(
    id,
    row.optionalPackageAddOns,
    optionalRollupFallback
  )
  if (pkgOptional.length) item.optionalAddOns = pkgOptional

  return item
}

function normalizeBriefPhotoOfferings(
  rows: SanityOfferingRow[] | null | undefined
): PackageCatalogItem[] {
  return (rows ?? [])
    .map((r) =>
      rowToCatalogItem(r, { optionalAddonRollupDefault: 'photography' })
    )
    .filter((x): x is PackageCatalogItem => x !== null)
}

function normalizeBriefVideoOfferings(
  rows: SanityOfferingRow[] | null | undefined
): PackageCatalogItem[] {
  return (rows ?? [])
    .map((r) =>
      rowToCatalogItem(r, { optionalAddonRollupDefault: 'cinematography' })
    )
    .filter((x): x is PackageCatalogItem => x !== null)
}

function normalizeAddonOfferings(
  rows: SanityOfferingRow[] | null | undefined
): PackageCatalogItem[] {
  return (rows ?? [])
    .map((r) => rowToCatalogItem(r, { idPrefix: 'addon__', addonMode: true }))
    .filter((x): x is PackageCatalogItem => x !== null)
}

function clampInt(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, Math.round(n)))
}

function normalizedPackageVariables(
  rows: SanityPackageVariableGroqRow[] | null | undefined
): PackageBuilderVariableResolved[] {
  const list = rows ?? []
  const seen = new Set<string>()
  const out: PackageBuilderVariableResolved[] = []
  for (const row of list) {
    const key = `${row.key ?? ''}`.trim()
    const title = `${row.title ?? ''}`.trim()
    const reactKey = `${row._key ?? ''}`.trim() || key || `vk_${seen.size}`
    if (!key || !title || seen.has(key)) continue
    seen.add(key)
    const kindRaw = `${row.variableKind ?? 'quantity'}`.trim().toLowerCase()
    const desc = `${row.description ?? ''}`.trim()

    if (kindRaw === 'feature_pick') {
      const pref = `varpick__${key}__`
      const opts = enrichCatalogItems(
        (row.pickOptions ?? [])
          .map((r) =>
            rowToCatalogItem(r as SanityOfferingRow, { idPrefix: pref, addonMode: true })
          )
          .filter((x): x is PackageCatalogItem => x !== null)
      )
      if (!opts.length) continue
      out.push({
        kind: 'feature_pick',
        reactKey,
        key,
        title,
        description: desc,
        allowMultiple: row.pickAllowMultiple !== false,
        optionsCatalog: opts,
      })
      continue
    }

    const minQ = typeof row.minQuantity === 'number' && row.minQuantity >= 0 ? row.minQuantity : 0
    let maxQ =
      typeof row.maxQuantity === 'number' && row.maxQuantity >= minQ ? row.maxQuantity : minQ + 12
    if (maxQ < minQ) maxQ = minQ
    const defRaw =
      typeof row.defaultQuantity === 'number' && Number.isFinite(row.defaultQuantity)
        ? row.defaultQuantity
        : 0
    const defaultCount = clampInt(defRaw, minQ, maxQ)
    const unitLabel = `${row.unitLabel ?? ''}`.trim() || 'units'
    const ppuRaw = `${row.pricePerUnit ?? ''}`.trim()
    const pricePerUnit = ppuRaw.length ? ppuRaw : null
    const totalsToward = coerceAddonTotalsToward(row.quantityTotalsToward) ?? 'standalone'
    out.push({
      kind: 'quantity',
      reactKey,
      key,
      title,
      description: desc,
      unitLabel,
      min: minQ,
      max: maxQ,
      defaultCount,
      pricePerUnit,
      totalsToward,
    })
  }
  return out
}

/** Props for `/investment/package-builder`, `/package/[slug]`, and `/testing` — resolved server-side */
export type PackageBuilderResolvedProps = {
  eyebrow: string | null
  title: string
  intro: string
  photoColumnTitle: string
  photoColumnSubtitle: string
  videoColumnTitle: string
  videoColumnSubtitle: string
  photoCatalog: PackageCatalogItem[]
  videoCatalog: PackageCatalogItem[]
  /** Optional third list – extra hour / second shooter / travel, grouped by rollup in Studio */
  addonCatalog: PackageCatalogItem[]
  addonSectionTitle: string
  addonSectionSubtitle: string
  builderVariables: PackageBuilderVariableResolved[]
  variablesSectionTitle: string
  variablesSectionSubtitle: string
  /** Matches /investment hero (video backdrop + headline from Hidden Pricing). */
  useInvestmentStyleHero: boolean
  heroVideoSrc: string | null
}

function catalogRowsFromInvestmentPricing(pricing: PricingForPackageGroq): {
  photoGuide: PackageCatalogItem[]
  videoGuide: PackageCatalogItem[]
} {
  if (!pricing) return { photoGuide: [], videoGuide: [] }
  return {
    photoGuide: [
      ...photoPackagesFromPricing(pricing.photoPackages),
      ...seasonalCollectionsToCatalog(pricing.seasonalCollections),
    ],
    videoGuide: videoPackagesFromPricing(pricing.videoPackages),
  }
}

export type ResolvePackagePageArgs = {
  brief: PackageBuilderGroqDoc | null
  /** Result of `fetchInvestmentPricingForPackage` — same source as /investment/[slug]. */
  pricing: PricingForPackageGroq
  /**
   * When true and `brief` exists, never fill empty columns with hardcoded fallbacks.
   * Use for published client links (and optional `sandbox` brief).
   */
  strictOfferings: boolean
}

/**
 * Merges: (1) Investment Guide `pricing` rows when enabled, (2) manual brief rows, (3) optional dev fallbacks.
 */
export function resolvePackageBuilderPage({
  brief,
  pricing,
  strictOfferings,
}: ResolvePackagePageArgs): PackageBuilderResolvedProps {
  const d = PACKAGE_BUILDER_DEFAULTS

  const loadFromGuide =
    pricing != null && (brief == null || brief.useInvestmentGuide !== false)

  const { photoGuide, videoGuide } = loadFromGuide
    ? catalogRowsFromInvestmentPricing(pricing)
    : { photoGuide: [], videoGuide: [] }

  const manualPhoto = brief ? normalizeBriefPhotoOfferings(brief.photoOfferings) : []
  const manualVideo = brief ? normalizeBriefVideoOfferings(brief.videoOfferings) : []

  let photoCatalog = enrichCatalogItems([...photoGuide, ...manualPhoto])
  let videoCatalog = enrichCatalogItems([...videoGuide, ...manualVideo])
  let addonCatalog = brief
    ? enrichCatalogItems(normalizeAddonOfferings(brief.addonOfferings))
    : []

  /** Hoist “A La Carte & Enhancements”-style pricing rows out of tier columns into the dropdown list. */
  const stripPhoto = stripHoistedEnhancementTiersFromCatalog(photoCatalog, 'photography')
  photoCatalog = stripPhoto.catalog
  const stripVideo = stripHoistedEnhancementTiersFromCatalog(videoCatalog, 'cinematography')
  videoCatalog = stripVideo.catalog
  addonCatalog = enrichCatalogItems([
    ...addonCatalog,
    ...stripPhoto.hoistedAddons,
    ...stripVideo.hoistedAddons,
  ])

  const preserveEmptyOfferings = strictOfferings && brief != null

  if (!preserveEmptyOfferings) {
    if (photoCatalog.length === 0)
      photoCatalog = enrichCatalogItems(FALLBACK_PHOTO_CATALOG.slice())
    if (videoCatalog.length === 0)
      videoCatalog = enrichCatalogItems(FALLBACK_VIDEO_CATALOG.slice())
  }

  const addonSectionTitle = brief?.addonSectionTitle?.trim() || d.addonSectionTitle
  const addonSectionSubtitle = brief?.addonSectionSubtitle?.trim() || d.addonSectionSubtitle
  const builderVariables = normalizedPackageVariables(brief?.packageVariables)
  const variablesSectionTitle =
    brief?.variablesSectionTitle?.trim() || d.variablesSectionTitle
  const variablesSectionSubtitle =
    brief?.variablesSectionSubtitle?.trim() || d.variablesSectionSubtitle

  const hasDoc = brief != null && brief !== undefined

  const useInvestmentStyleHero = loadFromGuide

  const rawHero =
    loadFromGuide && pricing && typeof pricing.heroVideoUrl === 'string'
      ? pricing.heroVideoUrl.trim()
      : ''
  const heroVideoSrc = rawHero.length > 0 ? rawHero : null

  let eyebrow: string | null
  let title: string
  let intro: string
  let photoColumnTitle: string
  let photoColumnSubtitle: string
  let videoColumnTitle: string
  let videoColumnSubtitle: string

  if (useInvestmentStyleHero && pricing != null) {
    eyebrow = INVESTMENT_GUIDE_EYEBROW
    title = `${pricing.title ?? ''}`.trim() || 'Your Legacy.'
    intro = INVESTMENT_GUIDE_TAGLINE
    photoColumnTitle =
      brief?.photoColumnTitle?.trim() ||
      PACKAGE_BUILDER_DEFAULTS.photoColumnTitle
    photoColumnSubtitle =
      brief?.photoColumnSubtitle?.trim() ||
      PACKAGE_BUILDER_DEFAULTS.photoColumnSubtitle
    videoColumnTitle =
      brief?.videoColumnTitle?.trim() || PACKAGE_BUILDER_DEFAULTS.videoColumnTitle
    videoColumnSubtitle =
      brief?.videoColumnSubtitle?.trim() ||
      PACKAGE_BUILDER_DEFAULTS.videoColumnSubtitle
  } else if (hasDoc) {
    eyebrow = brief.pageEyebrow?.trim() ? brief.pageEyebrow.trim() : null
    title = brief.pageTitle?.trim() || d.title
    intro = brief.pageIntro?.trim() || d.intro
    photoColumnTitle = brief.photoColumnTitle?.trim() || d.photoColumnTitle
    photoColumnSubtitle =
      brief.photoColumnSubtitle?.trim() || d.photoColumnSubtitle
    videoColumnTitle = brief.videoColumnTitle?.trim() || d.videoColumnTitle
    videoColumnSubtitle =
      brief.videoColumnSubtitle?.trim() || d.videoColumnSubtitle
  } else {
    eyebrow = `${d.eyebrow ?? ''}`.trim() || null
    title = d.title
    intro = d.intro
    photoColumnTitle = d.photoColumnTitle
    photoColumnSubtitle = d.photoColumnSubtitle
    videoColumnTitle = d.videoColumnTitle
    videoColumnSubtitle = d.videoColumnSubtitle
  }

  return {
    eyebrow,
    title,
    intro,
    photoColumnTitle,
    photoColumnSubtitle,
    videoColumnTitle,
    videoColumnSubtitle,
    photoCatalog,
    videoCatalog,
    addonCatalog,
    addonSectionTitle,
    addonSectionSubtitle,
    builderVariables,
    variablesSectionTitle,
    variablesSectionSubtitle,
    useInvestmentStyleHero,
    heroVideoSrc: heroVideoSrc || null,
  }
}
