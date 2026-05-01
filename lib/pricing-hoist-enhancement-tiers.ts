/**
 * Investment / brief tiers sometimes include one row titled like “A La Carte & Enhancements”
 * with priced bullets. That row is not a real package tier — we hoist bullets into the
 * package builder’s enhancement dropdown and drop the pseudo-tier from the column list.
 */

import type { AddonTotalsToward, PackageCatalogItem } from '@/lib/package-catalog-types'
import { enrichCatalogItem, getIncludedLines } from '@/lib/package-catalog-math'

export function isHoistedEnhancementTierTitle(title: string): boolean {
  const t = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
  const hasMenu = /a la carte/.test(t)
  const enh = /enhancement/.test(t)
  return (hasMenu && enh) || (hasMenu && t.includes('&'))
}

function hoistedAddonItemsFromPseudoTier(
  parent: PackageCatalogItem,
  addonTotalsToward: AddonTotalsToward
): PackageCatalogItem[] {
  const lines = getIncludedLines(parent)
  if (!lines.length) return []
  const out: PackageCatalogItem[] = []
  for (let i = 0; i < lines.length; i++) {
    const label = lines[i]!.label.trim()
    if (!label) continue
    const colon = label.indexOf(':')
    const titlePart = (colon > 0 ? label.slice(0, colon) : label).trim()
    const title =
      titlePart.length > 90 ? `${titlePart.slice(0, 87)}…` : titlePart || `Add-on ${i + 1}`
    const after = colon > 0 ? label.slice(colon + 1).trim() : ''
    const priceMatch = label.match(/\$\s*[\d,.]+(?:\s*[-–]\s*\$\s*[\d,.]+)?/i)
    const safeParent = parent.id.replace(/[^a-z0-9-_]/gi, '_')
    const id = `addon__hoist__${safeParent}__${i}`
    const row: PackageCatalogItem = {
      id,
      title,
      description: after.length > 0 ? after : label,
      addonTotalsToward,
    }
    if (priceMatch) row.price = priceMatch[0].replace(/\s+/g, ' ')
    out.push(enrichCatalogItem(row))
  }
  return out
}

export function stripHoistedEnhancementTiersFromCatalog(
  catalog: PackageCatalogItem[],
  addonTotalsToward: AddonTotalsToward
): { catalog: PackageCatalogItem[]; hoistedAddons: PackageCatalogItem[] } {
  const next: PackageCatalogItem[] = []
  const hoisted: PackageCatalogItem[] = []
  for (const item of catalog) {
    if (isHoistedEnhancementTierTitle(item.title)) {
      hoisted.push(...hoistedAddonItemsFromPseudoTier(item, addonTotalsToward))
      continue
    }
    next.push(item)
  }
  return { catalog: next, hoistedAddons: hoisted }
}
