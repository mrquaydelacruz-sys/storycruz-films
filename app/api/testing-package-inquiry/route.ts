import { NextRequest, NextResponse } from 'next/server'
import { estimateQuantityLineTotal, extractFirstDollarAmount } from '@/lib/package-catalog-math'

/**
 * Package builder POST handler — forwards to Cruz Control CRM at
 * `https://cruzcontrol.tech/api/contact-form` with `workspaceName: 'StoryCruz Films'`
 * (same pattern as `app/api/wedding-inquiry/route.ts`). The full selection payload is in `message`.
 */

const EVENT_MAP: Record<string, string> = {
  wedding: 'Wedding',
  commercial: 'Commercial',
  birthday: 'Birthday / private celebration',
  custom: 'Custom event',
}

type AddonRollupKey = 'photography' | 'cinematography' | 'standalone'

type QuantityVariableSelection = {
  variableKey: string
  title: string
  unitLabel?: string
  /** Integer count ≥ 1 */
  count: number
  pricePerUnit?: string
  totalsToward?: AddonRollupKey
  estimatedSubtotal?: number
}

/** Extra lines checked onto a tier card in the builder. */
type NestedPackageOptional = {
  addonId?: string
  title: string
  price?: string
  estimatedSubtotal?: number
  addonTotalsToward?: AddonRollupKey
  included?: string[]
  removedLines?: string[]
}

type Selection = {
  packageId?: string
  title: string
  price?: string
  /** Line labels still included after customize. */
  included?: string[]
  /** Lines the client unchecked in the builder. */
  removedLines?: string[]
  estimatedSubtotal?: number
  /** À la carte only — mirrors builder column rollup. */
  addonTotalsToward?: AddonRollupKey
  /** Optional upgrades selected on this package row. */
  optionalSelections?: NestedPackageOptional[]
  /** Enhancements chosen from À la carte list via tier dropdown. */
  alacarteSelections?: NestedPackageOptional[]
}

function formatMoneyBrief(n: number): string {
  return `$${Math.round(n).toLocaleString('en-CA')}`
}

function approxColumnNumericSum(items: Selection[]): number | null {
  let sum = 0
  let counted = 0
  for (const it of items) {
    const v = it.estimatedSubtotal
    if (typeof v === 'number' && Number.isFinite(v)) {
      sum += v
      counted++
    }
  }
  if (counted === 0) return null
  return sum
}

function coerceAddonTotalsToward(v: unknown): AddonRollupKey | undefined {
  if (v === 'photography' || v === 'cinematography' || v === 'standalone') return v
  return undefined
}

function approxTowardNumericSum(items: Selection[], toward: AddonRollupKey): number | null {
  const subset = items.filter(
    (s) => (s.addonTotalsToward ?? 'standalone') === toward
  )
  return approxColumnNumericSum(subset)
}

function mergeNullableSums(a: number | null, b: number | null): number | null {
  if (a == null && b == null) return null
  return (a ?? 0) + (b ?? 0)
}

function normalizeNestedPackageOptionals(raw: unknown): NestedPackageOptional[] {
  if (!Array.isArray(raw)) return []
  const out: NestedPackageOptional[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue
    const o = entry as Record<string, unknown>
    const title = String(o.title ?? '').trim()
    const addonId = String(o.addonId ?? o.addon_id ?? '').trim() || undefined
    if (!title) continue
    const price = typeof o.price === 'string' ? o.price.trim() : ''
    let estimatedSubtotal: number | undefined
    const er = o.estimatedSubtotal ?? o.estimated_subtotal
    if (typeof er === 'number' && Number.isFinite(er)) estimatedSubtotal = er
    else {
      const p = extractFirstDollarAmount(price)
      if (typeof p === 'number') estimatedSubtotal = p
    }
    const toward =
      coerceAddonTotalsToward(o.addonTotalsToward ?? o.addon_totals_toward) ?? 'photography'
    const row: NestedPackageOptional = { title, addonTotalsToward: toward }
    if (addonId) row.addonId = addonId
    if (price.length) row.price = price
    if (typeof estimatedSubtotal === 'number') row.estimatedSubtotal = estimatedSubtotal
    const nestedIncluded = Array.isArray(o.included)
      ? o.included.map((x) => String(x).trim()).filter(Boolean)
      : []
    const nestedRemovedRaw = o.removedLines ?? o.removed_lines
    const nestedRemoved = Array.isArray(nestedRemovedRaw)
      ? nestedRemovedRaw.map((x) => String(x).trim()).filter(Boolean)
      : []
    if (nestedIncluded.length) row.included = nestedIncluded
    if (nestedRemoved.length) row.removedLines = nestedRemoved
    out.push(row)
  }
  return out
}

/** Flat rows for column rollup sums (tier-level optional upgrades + à la carte on tier). */

function flattenTierNestedAdds(selectionRows: Selection[]): Selection[] {
  const flat: Selection[] = []
  for (const parent of selectionRows) {
    const merges = [...(parent.optionalSelections ?? []), ...(parent.alacarteSelections ?? [])]
    for (const co of merges) {
      const toward = co.addonTotalsToward ?? ('photography' as AddonRollupKey)
      let v = co.estimatedSubtotal
      if (typeof v !== 'number' || !Number.isFinite(v)) {
        const p = extractFirstDollarAmount(co.price ?? '')
        v = typeof p === 'number' ? p : undefined
      }
      if (typeof v !== 'number') continue
      flat.push({
        title: `[${parent.title}] + ${co.title}`,
        estimatedSubtotal: v,
        addonTotalsToward: toward,
      })
    }
  }
  return flat
}

function selectionsHaveTierNestedAdds(rows: Selection[]): boolean {
  return rows.some(
    (r) =>
      (r.optionalSelections?.length ?? 0) > 0 || (r.alacarteSelections?.length ?? 0) > 0
  )
}

function nestedOptionalFormatLines(
  heading: string,
  rows: NestedPackageOptional[],
  rollupDefault: AddonRollupKey = 'photography'
): string[] {
  const bits: string[] = [heading]
  for (const co of rows) {
    const headBits = [`       · ${co.title}`]
    if (co.price?.trim()) headBits.push(co.price.trim())
    if (typeof co.estimatedSubtotal === 'number')
      headBits.push(`(≈ ${formatMoneyBrief(co.estimatedSubtotal)} pre-tax)`)
    const rollup = co.addonTotalsToward ?? rollupDefault
    const rollupLabel =
      rollup === 'photography'
        ? 'photography column'
        : rollup === 'cinematography'
          ? 'cinematography column'
          : 'combined grand total only'
    bits.push(`${headBits.join(' — ')} → ${rollupLabel}`)
    if (co.included?.length) {
      for (const line of co.included) bits.push(`         – ${line}`)
    }
    if (co.removedLines?.length) {
      bits.push(`         Removed / unchecked:`)
      for (const line of co.removedLines) bits.push(`            · ${line}`)
    }
  }
  return bits
}

function sanitizeBuilderCount(raw: unknown): number {
  if (typeof raw !== 'number' || !Number.isFinite(raw) || raw < 1) return 0
  return Math.min(Math.floor(raw), 999)
}

function normalizeQuantityVariables(raw: unknown): QuantityVariableSelection[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((entry: unknown): QuantityVariableSelection[] => {
    if (!entry || typeof entry !== 'object') return []
    const o = entry as Record<string, unknown>
    const variableKey =
      String(o.variableKey ?? o.variable_key ?? '').trim() ||
      String(o.key ?? '').trim()
    const title = String(o.title ?? '').trim()
    const count = sanitizeBuilderCount(o.count)
    if (!variableKey || !title || count < 1) return []

    const unitLabel =
      typeof o.unitLabel === 'string' ? o.unitLabel.trim() : undefined
    const pricePerUnit =
      typeof o.pricePerUnit === 'string'
        ? o.pricePerUnit.trim()
        : typeof o.price_per_unit === 'string'
          ? String(o.price_per_unit).trim()
          : undefined
    const estRaw = o.estimatedSubtotal ?? o.estimated_subtotal
    let estimatedSubtotal: number | undefined
    if (typeof estRaw === 'number' && Number.isFinite(estRaw)) estimatedSubtotal = estRaw
    else {
      const recomputed =
        estimateQuantityLineTotal(pricePerUnit, count) ?? undefined
      if (typeof recomputed === 'number') estimatedSubtotal = recomputed
    }

    const toward = coerceAddonTotalsToward(o.totalsToward ?? o.totals_toward)

    return [
      {
        variableKey,
        title,
        count,
        ...(unitLabel?.length ? { unitLabel } : {}),
        ...(pricePerUnit?.length ? { pricePerUnit } : {}),
        ...(toward ? { totalsToward: toward } : {}),
        ...(typeof estimatedSubtotal === 'number'
          ? { estimatedSubtotal }
          : {}),
      },
    ]
  })
}

function approxQuantityVariablesToward(
  items: QuantityVariableSelection[],
  toward: AddonRollupKey
): number | null {
  let sum = 0
  let counted = false
  for (const it of items) {
    const rollup =
      coerceAddonTotalsToward(it.totalsToward) ?? ('standalone' as const)
    if (rollup !== toward) continue

    let v = it.estimatedSubtotal
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      const r = estimateQuantityLineTotal(it.pricePerUnit, it.count)
      v = typeof r === 'number' ? r : undefined
    }
    if (typeof v === 'number' && Number.isFinite(v)) {
      sum += v
      counted = true
    }
  }
  return counted ? sum : null
}

function formatQuantityVariableLines(items: QuantityVariableSelection[]): string {
  return items
    .map((it) => {
      const head = `• [${it.variableKey}] ${it.title}${it.unitLabel ? ` (${it.unitLabel})` : ''}`
      const amt =
        typeof it.estimatedSubtotal === 'number'
          ? formatMoneyBrief(it.estimatedSubtotal)
          : '—'
      const rollup =
        coerceAddonTotalsToward(it.totalsToward) ?? ('standalone' as const)
      const rollupLabel =
        rollup === 'photography'
          ? 'photography column'
          : rollup === 'cinematography'
            ? 'cinematography column'
            : 'combined grand total only'
      return [
        head,
        `    Count ×${it.count} · Estimate (builder, pre-tax): ${amt}`,
        `    Rolls into ${rollupLabel}`,
      ].join('\n')
    })
    .join('\n\n')
}

function normalizeSelections(raw: unknown): Selection[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((entry: unknown): Selection[] => {
    if (typeof entry === 'string') {
      const t = entry.trim()
      return t ? [{ title: t }] : []
    }
    if (entry && typeof entry === 'object' && 'title' in entry) {
      const o = entry as Record<string, unknown>
      const title = String(o.title ?? '').trim()
      if (!title) return []
      const price = typeof o.price === 'string' ? o.price.trim() : ''
      const pkgIdRaw = String(o.packageId ?? '').trim()
      const pkgId = pkgIdRaw || undefined

      const included = Array.isArray(o.included)
        ? o.included.map((x) => String(x).trim()).filter(Boolean)
        : []
      const removedLines = Array.isArray(o.removedLines)
        ? o.removedLines.map((x) => String(x).trim()).filter(Boolean)
        : []

      const estRaw = o.estimatedSubtotal ?? o.estimated_subtotal
      let estimatedSubtotal: number | undefined
      if (typeof estRaw === 'number' && Number.isFinite(estRaw)) estimatedSubtotal = estRaw

      const addonToward = coerceAddonTotalsToward(
        o.addonTotalsToward ?? o.addon_totals_toward
      )

      const optRows = normalizeNestedPackageOptionals(
        o.optionalSelections ?? o.optional_selections
      )
      const acRows = normalizeNestedPackageOptionals(
        o.alacarteSelections ?? o.alacarte_selections
      )

      return [
        {
          ...(pkgId ? { packageId: pkgId } : {}),
          title,
          price: price || undefined,
          included: included.length ? included : undefined,
          removedLines: removedLines.length ? removedLines : undefined,
          ...(typeof estimatedSubtotal === 'number' ? { estimatedSubtotal } : {}),
          ...(addonToward ? { addonTotalsToward: addonToward } : {}),
          ...(optRows.length ? { optionalSelections: optRows } : {}),
          ...(acRows.length ? { alacarteSelections: acRows } : {}),
        },
      ]
    }
    return []
  })
}

function formatSelectionLines(selections: Selection[]): string {
  return selections
    .map((s) => {
      const lines: string[] = []
      const pkgRef = s.packageId ? `[${s.packageId}] ` : ''
      const headParts = [`• ${pkgRef}${s.title}`]
      if (s.price && s.price.length > 0) headParts.push(s.price)
      lines.push(headParts.join(' — '))
      if (typeof s.estimatedSubtotal === 'number') {
        lines.push(
          `    Customized estimate (builder, pre-tax): ${formatMoneyBrief(s.estimatedSubtotal)}`
        )
      }
      if (s.addonTotalsToward) {
        const rollupLabel =
          s.addonTotalsToward === 'photography'
            ? 'photography column'
            : s.addonTotalsToward === 'cinematography'
              ? 'cinematography column'
              : 'combined grand total only'
        lines.push(`    Add-on rollup: counts toward ${rollupLabel}`)
      }
      if (s.included?.length) {
        for (const line of s.included) {
          lines.push(`    – ${line}`)
        }
      }
      if (s.removedLines?.length) {
        lines.push(`    Removed / unchecked:`)
        for (const line of s.removedLines) {
          lines.push(`       · ${line}`)
        }
      }
      if (s.optionalSelections?.length) {
        lines.push(
          ...nestedOptionalFormatLines(
            '    Tier optional upgrades:',
            s.optionalSelections
          )
        )
      }
      if (s.alacarteSelections?.length) {
        lines.push(
          ...nestedOptionalFormatLines(
            '    Enhancements (À la carte list) on this tier:',
            s.alacarteSelections
          )
        )
      }
      return lines.join('\n')
    })
    .join('\n\n')
}

/** Selections include optional price & included bullets; `packageBuilderSlug` identifies the share link. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const fullName = String(body.fullName ?? '').trim()
    const email = String(body.email ?? '').trim()
    const partnerName = String(body.partnerName ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const eventTypeKey = String(body.eventType ?? '')
    const eventDate = String(body.eventDate ?? '').trim()
    const location = String(body.location ?? '').trim()
    const notes = String(body.notes ?? '').trim()
    const packageBuilderSlug = String(body.packageBuilderSlug ?? '').trim()

    const photoItems = normalizeSelections(body.photoItems)
    const videoItems = normalizeSelections(body.videoItems)
    const addonItems = normalizeSelections(body.addonItems)
    const quantityVariableItems = normalizeQuantityVariables(body.quantityVariables)
    const variablePickItems = normalizeSelections(body.variablePickItems)

    const photoPackagesSum = approxColumnNumericSum(photoItems)
    const videoPackagesSum = approxColumnNumericSum(videoItems)
    const addonPhotoSum = approxTowardNumericSum(addonItems, 'photography')
    const addonVideoSum = approxTowardNumericSum(addonItems, 'cinematography')
    const addonStandaloneSum = approxTowardNumericSum(addonItems, 'standalone')

    const qtyPhotoSum = approxQuantityVariablesToward(quantityVariableItems, 'photography')
    const qtyVideoSum = approxQuantityVariablesToward(quantityVariableItems, 'cinematography')
    const qtyStandaloneSum = approxQuantityVariablesToward(
      quantityVariableItems,
      'standalone'
    )

    const pickPhotoSum = approxTowardNumericSum(variablePickItems, 'photography')
    const pickVideoSum = approxTowardNumericSum(variablePickItems, 'cinematography')
    const pickStandaloneSum = approxTowardNumericSum(variablePickItems, 'standalone')

    const tierOptFlatPhoto = flattenTierNestedAdds(photoItems)
    const tierOptFlatVideo = flattenTierNestedAdds(videoItems)
    const tierOptPhotoSum = approxTowardNumericSum(tierOptFlatPhoto, 'photography')
    const tierOptVideoSum = approxTowardNumericSum(tierOptFlatVideo, 'cinematography')
    const tierOptStandaloneMerged = mergeNullableSums(
      approxTowardNumericSum(tierOptFlatPhoto, 'standalone'),
      approxTowardNumericSum(tierOptFlatVideo, 'standalone')
    )

    const photoMerged = mergeNullableSums(
      mergeNullableSums(
        mergeNullableSums(mergeNullableSums(photoPackagesSum, addonPhotoSum), qtyPhotoSum),
        pickPhotoSum
      ),
      tierOptPhotoSum
    )
    const videoMerged = mergeNullableSums(
      mergeNullableSums(
        mergeNullableSums(mergeNullableSums(videoPackagesSum, addonVideoSum), qtyVideoSum),
        pickVideoSum
      ),
      tierOptVideoSum
    )
    const standaloneMerged = mergeNullableSums(
      mergeNullableSums(
        mergeNullableSums(addonStandaloneSum, qtyStandaloneSum),
        pickStandaloneSum
      ),
      tierOptStandaloneMerged
    )
    const photoApproxStr =
      photoMerged != null ? formatMoneyBrief(photoMerged) : null
    const videoApproxStr =
      videoMerged != null ? formatMoneyBrief(videoMerged) : null
    const standaloneApproxStr =
      standaloneMerged != null ? formatMoneyBrief(standaloneMerged) : null
    const combinedSum =
      photoMerged != null || videoMerged != null || standaloneMerged != null
        ? (photoMerged ?? 0) + (videoMerged ?? 0) + (standaloneMerged ?? 0)
        : null

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }

    if (
      photoItems.length === 0 &&
      videoItems.length === 0 &&
      addonItems.length === 0 &&
      quantityVariableItems.length === 0 &&
      variablePickItems.length === 0 &&
      !selectionsHaveTierNestedAdds(photoItems) &&
      !selectionsHaveTierNestedAdds(videoItems)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Choose at least one photography pack, cinematography pack, tier add-ons/Enhancements, legacy à la carte line, or allowed variable.',
        },
        { status: 400 }
      )
    }

    const name = partnerName ? `${fullName} & ${partnerName}` : fullName
    const eventLabel = EVENT_MAP[eventTypeKey] || eventTypeKey || 'Not specified'

    const linkRef = (() => {
      if (!packageBuilderSlug) return '(link not passed)'
      if (packageBuilderSlug.startsWith('/')) return packageBuilderSlug
      if (packageBuilderSlug.includes('/')) return `/${packageBuilderSlug}`
      return `/package/${packageBuilderSlug}`
    })()

    const approxFooter = [
      photoApproxStr && `Approx. photography (packages + à la carte → photo column): ${photoApproxStr}`,
      videoApproxStr && `Approx. cinematography (packages + à la carte → cinema column): ${videoApproxStr}`,
      standaloneApproxStr &&
        `Approx. standalone lines (combined total only slice): ${standaloneApproxStr}`,
      combinedSum != null && `Approx. combined (builder, pre-tax): ${formatMoneyBrief(combinedSum)}`,
    ].filter(Boolean)

    const messageParts = [
      `[Package builder — ${linkRef}]`,
      '',
      `Event type: ${eventLabel}`,
      eventDate && `Date: ${eventDate}`,
      location && `Location: ${location}`,
      '',
      photoItems.length > 0 && `Photography:\n${formatSelectionLines(photoItems)}`,
      '',
      videoItems.length > 0 && `Videography:\n${formatSelectionLines(videoItems)}`,
      addonItems.length > 0 && `À la carte add-ons:\n${formatSelectionLines(addonItems)}`,
      quantityVariableItems.length > 0 &&
        `Quantity variables:\n${formatQuantityVariableLines(quantityVariableItems)}`,
      variablePickItems.length > 0 &&
        `Variable feature picks:\n${formatSelectionLines(variablePickItems)}`,
      approxFooter.length > 0 &&
        `\nApproximate totals — pre-tax; GST not included — sums selections that returned a numeric customized estimate:\n${approxFooter.join('\n')}`,
      notes && `\nNotes:\n${notes}`,
    ].filter(Boolean)

    const message = messageParts.join('\n')

    const crmResponse = await fetch('https://cruzcontrol.tech/api/contact-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone: phone || undefined,
        projectType: `Package builder — ${eventLabel}`,
        eventDate: eventDate || undefined,
        location: location || undefined,
        message,
        workspaceName: 'StoryCruz Films',
      }),
    })

    const crmData = await crmResponse.json().catch(() => ({}))

    if (!crmResponse.ok || !crmData.success) {
      console.error('CRM API error (testing package):', crmResponse.status, crmData)
      return NextResponse.json(
        { success: false, error: 'Failed to submit inquiry to CRM' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, leadId: crmData.leadId, conversationId: crmData.conversationId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing testing package inquiry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
