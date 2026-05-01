import type { AddonTotalsToward, PackageCatalogItem, PackageOptionalAddOn } from '@/lib/package-catalog-types'
import { packageFeaturesRawToIncludedLines } from '@/lib/pricing-features-normalize'

/** Default slug matching https://www.storycruzfilms.com/investment/investment-guide */
export const DEFAULT_INVESTMENT_GUIDE_SLUG = 'investment-guide'

function slugifyId(s: string, fallback: string): string {
  const x = String(s ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return x.length > 0 ? x.slice(0, 80) : fallback
}

type SimplePackage = {
  name?: string | null
  price?: string | null
  description?: string | null
  features?: unknown
  optionalAddOns?: unknown
}

function coerceAddonTotalsToward(v: unknown): AddonTotalsToward | undefined {
  if (v === 'photography' || v === 'cinematography' || v === 'standalone') return v
  return undefined
}

export function normalizeOptionalAddOnRowsForParent(
  parentPackageId: string,
  rows: unknown,
  defaultRollupToward: AddonTotalsToward
): PackageOptionalAddOn[] {
  if (!Array.isArray(rows)) return []
  const seen = new Set<string>()
  const out: PackageOptionalAddOn[] = []
  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i] as Record<string, unknown>
    const key = String(raw?.key ?? '').trim()
    const title = String(raw?.title ?? '').trim()
    const description = String(raw?.description ?? '').trim()
    if (!key || !title || !description || seen.has(key)) continue
    seen.add(key)
    const row: PackageOptionalAddOn = {
      id: `${parentPackageId}__optadd__${key}`,
      title,
      description,
    }
    const priceRaw = typeof raw.price === 'string' ? raw.price.trim() : ''
    if (priceRaw) row.price = priceRaw
    const toward = coerceAddonTotalsToward(
      raw.addonTotalsToward ?? raw.addon_totals_toward
    )
    row.addonTotalsToward = toward ?? defaultRollupToward
    out.push(row)
  }
  return out
}

function mapSimplePackages(pkgs: unknown, idPrefix: 'invest-v' | 'invest-p'): PackageCatalogItem[] {
  if (!Array.isArray(pkgs)) return []
  const defaultOptionalRollup: AddonTotalsToward =
    idPrefix === 'invest-p' ? 'photography' : 'cinematography'
  const out: PackageCatalogItem[] = []
  pkgs.forEach((raw, i) => {
    const p = raw as SimplePackage
    const title = String(p?.name ?? '').trim()
    if (!title) return
    const description = String(p?.description ?? '').trim()
    const priceRaw = typeof p?.price === 'string' ? p.price.trim() : ''

    const id = `${idPrefix}-${slugifyId(title, String(i))}-${i}`
    const item: PackageCatalogItem = {
      id,
      title,
      description: description || 'See included details below.',
    }
    if (priceRaw) item.price = priceRaw

    const lines = packageFeaturesRawToIncludedLines(id, p?.features)
    if (lines.length) {
      item.included = lines.map((l) => l.label)
      item.includedLines = lines
    }

    const optionalAdds = normalizeOptionalAddOnRowsForParent(
      id,
      p?.optionalAddOns,
      defaultOptionalRollup
    )
    if (optionalAdds.length) item.optionalAddOns = optionalAdds

    out.push(item)
  })
  return out
}

/** Cinematography column — matches `pricing.videoPackages` on the Investment Guide page. */
export function videoPackagesFromPricing(pkgs: unknown): PackageCatalogItem[] {
  return mapSimplePackages(pkgs, 'invest-v')
}

/** Photography column core collections — matches `pricing.photoPackages`. */
export function photoPackagesFromPricing(pkgs: unknown): PackageCatalogItem[] {
  return mapSimplePackages(pkgs, 'invest-p')
}

/** Seasonal & intimate tiers (often combos) appended under Photography — same storytelling as Investment page. */
export function seasonalCollectionsToCatalog(seasonal: unknown): PackageCatalogItem[] {
  if (!seasonal || typeof seasonal !== 'object') return []
  const s = seasonal as {
    enabled?: boolean
    sectionTitle?: string | null
    availability?: string | null
    tiers?: unknown[]
  }

  if (!s.enabled || !Array.isArray(s.tiers)) return []

  const section = (s.sectionTitle ?? 'Seasonal & intimate').trim()
  const out: PackageCatalogItem[] = []

  s.tiers.forEach((tierRaw, tierIndex) => {
    const tier = tierRaw as {
      tierNumber?: number | null
      tierName?: string | null
      duration?: string | null
      tagline?: string | null
      hasMultipleOptions?: boolean | null
      options?: Array<{
        optionLabel?: string | null
        optionName?: string | null
        price?: string | null
        coverage?: string | null
        team?: string | null
        mediaChoice?: string | null
        deliverables?: string[] | null
        whyItWorks?: string | null
        guestCap?: string | null
      }> | null
      singlePrice?: string | null
      singleCoverage?: string | null
      singleTeam?: string | null
      singleDeliverables?: string[] | null
      singleBestFor?: string | null
      singleGuestCap?: string | null
    }

    const tNum =
      tier.tierNumber !== undefined && tier.tierNumber !== null
        ? String(tier.tierNumber)
        : String(tierIndex)

    const tierLabel = tier.tierName?.trim() || `Tier ${tNum}`

    const introBits = [
      section && `(${section})`,
      tier.duration?.trim() && `Duration: ${tier.duration.trim()}`,
      tier.tagline?.trim(),
      s.availability?.trim(),
    ].filter(Boolean) as string[]

    const baseDesc = introBits.join(' · ') || ''

    if (tier.hasMultipleOptions && Array.isArray(tier.options)) {
      tier.options.forEach((opt, j) => {
        const ol = opt.optionLabel?.trim() || ''
        const on = opt.optionName?.trim() || ''
        const title = [tierLabel, ol, on].filter(Boolean).join(' — ')
        if (!title) return

        const included: string[] = []
        if (opt.coverage?.trim()) included.push(`Coverage: ${opt.coverage.trim()}`)
        if (opt.team?.trim()) included.push(`Team: ${opt.team.trim()}`)
        if (opt.guestCap?.trim()) included.push(`Guest cap: ${opt.guestCap.trim()}`)
        if (opt.mediaChoice?.trim()) included.push(opt.mediaChoice.trim())
        if (Array.isArray(opt.deliverables)) {
          opt.deliverables.forEach((d) => {
            const line = String(d).trim()
            if (line) included.push(line)
          })
        }
        if (opt.whyItWorks?.trim())
          included.push(`Note: ${opt.whyItWorks.trim()}`)

        const priceRaw = typeof opt.price === 'string' ? opt.price.trim() : ''
        const descExtra = [
          baseDesc,
          opt.mediaChoice?.trim(),
          opt.whyItWorks?.trim(),
        ].filter(Boolean)
        const description = [...new Set(descExtra)].join('\n\n') || 'Seasonal collection option.'

        const id = `invest-season-t${tNum}-opt-${j}-${slugifyId(title, String(j))}`

        const item: PackageCatalogItem = {
          id,
          title: `${section}: ${title}`.slice(0, 200),
          description,
        }
        if (priceRaw) item.price = priceRaw
        if (included.length) item.included = included

        out.push(item)
      })
      return
    }

    /** Single-option tier */
    const included: string[] = []
    if (tier.singleCoverage?.trim()) included.push(`Coverage: ${tier.singleCoverage.trim()}`)
    if (tier.singleTeam?.trim()) included.push(`Team: ${tier.singleTeam.trim()}`)
    if (tier.singleGuestCap?.trim()) included.push(`Guest cap: ${tier.singleGuestCap.trim()}`)
    if (Array.isArray(tier.singleDeliverables)) {
      tier.singleDeliverables.forEach((d) => {
        const line = String(d).trim()
        if (line) included.push(line)
      })
    }
    if (tier.singleBestFor?.trim()) included.push(`Best for: ${tier.singleBestFor.trim()}`)
    const priceRaw = typeof tier.singlePrice === 'string' ? tier.singlePrice.trim() : ''
    const description =
      [baseDesc, tier.singleBestFor?.trim()].filter(Boolean).join('\n\n') ||
      'Seasonal collection tier.'

    const id = `invest-season-t${tNum}-single`

    const item: PackageCatalogItem = {
      id,
      title: `${section}: ${tierLabel}`.slice(0, 200),
      description,
    }
    if (priceRaw) item.price = priceRaw
    if (included.length) item.included = included

    out.push(item)
  })

  return out
}
