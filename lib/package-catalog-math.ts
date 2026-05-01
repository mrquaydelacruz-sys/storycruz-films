import type {
  AddonTotalsToward,
  PackageCatalogItem,
  PackageIncludedLine,
  PackageOptionalAddOn,
} from '@/lib/package-catalog-types'

/** First dollar figure in package price string ($2,800 + gst → 2800). */
export function extractFirstDollarAmount(priceStr: string): number | null {
  const m = priceStr.match(/\$([\d,.]+)/)
  if (!m) return null
  const n = parseFloat(m[1].replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

/** Simple CAD-style formatting to match investment copy. */
export function formatMoneySimple(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-CA')}`
}

/**
 * Parses optional credit at END of bullet text, inside parentheses containing a $ amount:
 * `"Drone Cinematography (credit $350)"` → credit 350
 * `"Engagement Session ($450 if removed)"` → 450
 * If ambiguous (multiple amounts) sets credit to 0 — tighten copy in Sanity.
 */
export function parseIncludedLine(
  packageItemId: string,
  index: number,
  raw: string
): PackageIncludedLine {
  const trimmed = raw.trim()
  const id = `${packageItemId}__ln__${index}`

  const parenTail = /\(([^)]*)\)\s*$/.exec(trimmed)
  let removeCreditUsd = 0
  let label = trimmed

  if (parenTail) {
    const inner = parenTail[1]
    const amounts = [...inner.matchAll(/\$([\d,.]+)/g)].map((x) =>
      parseFloat(x[1].replace(/,/g, ''))
    ).filter((n) => Number.isFinite(n))

    if (amounts.length === 1 && Number.isFinite(amounts[0])) {
      removeCreditUsd = amounts[0]!
      label = trimmed.slice(0, trimmed.length - parenTail[0].length).trim()
    }
  }

  return {
    id,
    label: label || trimmed,
    removeCreditUsd,
    removable: true,
  }
}

export function buildIncludedLines(item: PackageCatalogItem): PackageIncludedLine[] {
  const src = item.included ?? []
  return src.map((s, i) => parseIncludedLine(item.id, i, String(s)))
}

export function enrichCatalogItem(item: PackageCatalogItem): PackageCatalogItem {
  if (item.includedLines?.length || !(item.included?.length ?? 0)) {
    return item
  }
  return { ...item, includedLines: buildIncludedLines(item) }
}

export function enrichCatalogItems(items: PackageCatalogItem[]): PackageCatalogItem[] {
  return items.map(enrichCatalogItem)
}

export function getIncludedLines(item: PackageCatalogItem): PackageIncludedLine[] {
  return item.includedLines?.length
    ? item.includedLines
    : item.included?.length
      ? buildIncludedLines(item)
      : []
}

/**
 * When `excluded` contains a line id, that line is turned off → subtract a “credit” from list price.
 *
 * - If **any** bullet parsed a trailing `($…)` amount, only those amounts apply (CMS “line-item” mode).
 * - If **no** bullet has that cue, each **removable** unchecked line subtracts an **equal share**
 *   of the first `$…` in `item.price` (split count = removable lines only).
 */
export function computePackageEstimate(
  item: PackageCatalogItem,
  excluded: Set<string> | undefined | null
): {
  subtotal: number | null
  base: number | null
  credits: number
  /** Set when deductions use equal split (`list ÷ removable bullet count`) instead of per-line amounts. */
  equalSharePerLine: number | null
} {
  const priceStr = item.price ?? ''
  const base = extractFirstDollarAmount(priceStr)
  const lines = getIncludedLines(item)
  const ex = excluded ?? new Set<string>()

  const togglable = lines.filter((l) => l.removable !== false)
  const hasAnyExplicitCredit = togglable.some((l) => l.removeCreditUsd > 0)
  const equalSharePerLine =
    base !== null && togglable.length > 0 && !hasAnyExplicitCredit
      ? base / togglable.length
      : null

  let credits = 0
  for (const line of lines) {
    if (line.removable === false) continue
    if (!ex.has(line.id)) continue
    if (hasAnyExplicitCredit) credits += line.removeCreditUsd
    else if (equalSharePerLine != null) credits += equalSharePerLine
  }

  if (base === null) return { subtotal: null, base: null, credits: 0, equalSharePerLine: null }
  const subtotalRounded = Math.max(0, Math.round(base * 100 - credits * 100) / 100)
  return {
    subtotal: subtotalRounded,
    base,
    credits,
    equalSharePerLine,
  }
}

/** Sum of numeric package estimates; skips rows without parsable `$` base price in `item.price`. */
export function columnSubtotalEstimate(
  items: PackageCatalogItem[],
  getExcluded: (id: string) => Set<string>
): number | null {
  if (!items.length) return null
  let sum = 0
  let counted = 0
  for (const item of items) {
    const { subtotal } = computePackageEstimate(item, getExcluded(item.id))
    if (subtotal !== null) {
      sum += subtotal
      counted++
    }
  }
  return counted > 0 ? sum : null
}

/** Add-on rows grouped by **`addonTotalsToward`** (`undefined` / null → **standalone**). */
export function addonSubtotalTowardEstimate(
  items: PackageCatalogItem[],
  toward: AddonTotalsToward,
  getExcluded: (id: string) => Set<string>
): number | null {
  const subset = items.filter((i) => (i.addonTotalsToward ?? 'standalone') === toward)
  return columnSubtotalEstimate(subset, getExcluded)
}

/**
 * Sums À la carte / enhancement picks attached per package row (`selectionsByPkg` maps parent id → addon ids).
 * Exclusions keyed by `{ [parentPackageId]: { [addonCatalogId]: Set<lineId> } }`.
 */
export function aggregateEnhancementSelectionsTowardApprox(
  selectedPackages: PackageCatalogItem[],
  selectionsByPkg: Record<string, Set<string>>,
  exclusionNested: Record<string, Record<string, Set<string>>>,
  addonCatalog: PackageCatalogItem[],
  toward: AddonTotalsToward
): number | null {
  if (!addonCatalog.length) return null
  const byId = new Map(addonCatalog.map((a) => [a.id, a]))
  let sum = 0
  let counted = false
  for (const pkg of selectedPackages) {
    const sel = selectionsByPkg[pkg.id]
    if (!sel?.size) continue
    for (const addonId of sel) {
      const addon = byId.get(addonId)
      if (!addon) continue
      if ((addon.addonTotalsToward ?? 'standalone') !== toward) continue
      const ex = exclusionNested[pkg.id]?.[addonId] ?? new Set<string>()
      const { subtotal } = computePackageEstimate(addon, ex)
      if (subtotal != null) {
        sum += subtotal
        counted = true
      }
    }
  }
  return counted ? Math.round(sum * 100) / 100 : null
}

export function countEnhancementStandaloneSelections(
  selectedPackages: PackageCatalogItem[],
  selectionsByPkg: Record<string, Set<string>>,
  addonCatalog: PackageCatalogItem[]
): number {
  if (!addonCatalog.length) return 0
  const byId = new Map(addonCatalog.map((a) => [a.id, a]))
  let n = 0
  for (const pkg of selectedPackages) {
    const sel = selectionsByPkg[pkg.id]
    if (!sel?.size) continue
    for (const addonId of sel) {
      const addon = byId.get(addonId)
      if (!addon || (addon.addonTotalsToward ?? 'standalone') !== 'standalone') continue
      n++
    }
  }
  return n
}

/** Combine base column total with an add-on slice (both may be unknown). */
export function mergeApproxSubtotals(a: number | null, b: number | null): number | null {
  if (a == null && b == null) return null
  return (a ?? 0) + (b ?? 0)
}

/** Checked upgrades on one package row — summed when `price` contains a dollar amount to parse. */

export function sumOptionalAddOnSelectionsApprox(
  addOns: PackageOptionalAddOn[] | null | undefined,
  selectedIds: Set<string>
): number | null {
  if (!addOns?.length || !selectedIds.size) return null
  let sum = 0
  let counted = 0
  for (const a of addOns) {
    if (!selectedIds.has(a.id)) continue
    const n = extractFirstDollarAmount(a.price ?? '')
    if (n == null) continue
    sum += n
    counted++
  }
  return counted > 0 ? Math.round(sum * 100) / 100 : null
}

function collectOptionalAddOnSelections(
  items: PackageCatalogItem[],
  selectionsByPkg: Record<string, Set<string>>
): PackageOptionalAddOn[] {
  const out: PackageOptionalAddOn[] = []
  for (const item of items) {
    const sel = selectionsByPkg[item.id]
    if (!sel?.size) continue
    for (const row of item.optionalAddOns ?? []) {
      if (sel.has(row.id)) out.push(row)
    }
  }
  return out
}

/** Checked optional upgrades scoped to **`items`**, summed by **`addonTotalsToward`**. */

export function optionalAddOnSelectionsTowardApprox(
  items: PackageCatalogItem[],
  selectionsByPkg: Record<string, Set<string>>,
  toward: AddonTotalsToward
): number | null {
  let sumAdds = 0
  let anyAdds = false
  const flat = collectOptionalAddOnSelections(items, selectionsByPkg)
  for (const row of flat) {
    if ((row.addonTotalsToward ?? 'standalone') !== toward) continue
    const n = extractFirstDollarAmount(row.price ?? '')
    if (n == null) continue
    sumAdds += n
    anyAdds = true
  }
  return anyAdds ? Math.round(sumAdds * 100) / 100 : null
}

/** First **`$`** in **`pricePerUnit`** string × **`count`** (pre-discount shorthand for variables). */

export function estimateQuantityLineTotal(
  pricePerUnitLabel: string | null | undefined,
  count: number
): number | null {
  if (!Number.isFinite(count) || count <= 0) return null
  const label = `${pricePerUnitLabel ?? ''}`.trim()
  if (!label.length) return null
  const unit = extractFirstDollarAmount(label)
  if (unit == null) return null
  return Math.round(unit * count * 100) / 100
}
