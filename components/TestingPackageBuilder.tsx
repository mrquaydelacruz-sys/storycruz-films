'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Video,
  Send,
  CheckCircle,
  ArrowRight,
  Plus,
  Check,
  User,
  Calendar,
  MapPin,
  SquarePen,
  Sparkles,
  Minus,
  SlidersHorizontal,
  List,
} from 'lucide-react'
import BackgroundWater from '@/components/BackgroundWater'
import InvestmentGuideHero from '@/components/InvestmentGuideHero'
import type {
  PackageBuilderResolvedProps,
  PackageBuilderVariableResolved,
  PackageCatalogItem,
} from '@/lib/package-builder-content'
import type { PackageIncludedLine } from '@/lib/package-catalog-types'
import type { AddonTotalsToward } from '@/lib/package-catalog-types'
import {
  aggregateEnhancementSelectionsTowardApprox,
  addonSubtotalTowardEstimate,
  columnSubtotalEstimate,
  computePackageEstimate,
  countEnhancementStandaloneSelections,
  estimateQuantityLineTotal,
  extractFirstDollarAmount,
  formatMoneySimple,
  getIncludedLines,
  mergeApproxSubtotals,
  optionalAddOnSelectionsTowardApprox,
  sumOptionalAddOnSelectionsApprox,
} from '@/lib/package-catalog-math'

type TestingPackageBuilderProps = PackageBuilderResolvedProps & {
  /** Sent to CRM so you know which share link this submission came from. */
  submissionSlug?: string | null
}

type EventType = 'wedding' | 'commercial' | 'birthday' | 'custom' | null

const EVENT_OPTIONS: { value: NonNullable<EventType>; label: string }[] = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'birthday', label: 'Birthday / celebration' },
  { value: 'custom', label: 'Custom event' },
]

const ADDON_ROLLUP_HINT: Record<string, string> = {
  photography: 'Adds to your photography column total',
  cinematography: 'Adds to your cinematography column total',
  standalone: 'Counts only in the combined grand total',
}

const FALLBACK_EMPTY_OPTIONAL = new Set<string>()

function CatalogOption({
  item,
  selected,
  onToggle,
  excludedLineIds,
  onLineIncludeChange,
  showAddonRollupHint = false,
  optionalSelectedIds = FALLBACK_EMPTY_OPTIONAL,
  onToggleOptionalAdd = () => {},
  enhancementCatalog,
  enhancementSectionTitle,
  enhancementSectionSubtitle,
  enhancementSelectedIds = FALLBACK_EMPTY_OPTIONAL,
  onAddEnhancement = () => {},
  onRemoveEnhancement = () => {},
  enhancementLineExclusionsGetter = () => FALLBACK_EMPTY_OPTIONAL,
  onEnhancementLineIncludeChange = () => {},
}: {
  item: PackageCatalogItem
  selected: boolean
  onToggle: () => void
  /** Line IDs the client excluded from this package (`includedLines` ids). */
  excludedLineIds: Set<string>
  onLineIncludeChange: (lineId: string, nowIncluded: boolean) => void
  showAddonRollupHint?: boolean
  /** Package-card optional upgrades (`optionalAddOns`); unused for À la carte rows. */
  optionalSelectedIds?: Set<string>
  onToggleOptionalAdd?: (addOnId: string) => void
  /** When set on a tier card: dropdown to attach catalog enhancements to this tier. */
  enhancementCatalog?: PackageCatalogItem[]
  enhancementSectionTitle?: string
  enhancementSectionSubtitle?: string | null
  enhancementSelectedIds?: Set<string>
  onAddEnhancement?: (addonCatalogItemId: string) => void
  onRemoveEnhancement?: (addonCatalogItemId: string) => void
  enhancementLineExclusionsGetter?: (addonCatalogItemId: string) => Set<string>
  onEnhancementLineIncludeChange?: (
    addonCatalogItemId: string,
    lineId: string,
    nowIncluded: boolean
  ) => void
}) {
  const [customOpen, setCustomOpen] = useState(false)
  const [openEnhCustomizeIds, setOpenEnhCustomizeIds] = useState<Set<string>>(() => new Set())
  const lines = getIncludedLines(item)
  const hasRate = !!(item.price && item.price.trim())
  const hasCustomize = lines.length > 0
  const { subtotal, credits, base, equalSharePerLine } = computePackageEstimate(
    item,
    excludedLineIds
  )
  const includedLinesUi = lines.filter((l) => !excludedLineIds.has(l.id))
  const togglableLines = lines.filter((l) => l.removable !== false)

  const lineDeductionHint = (line: PackageIncludedLine): number | null => {
    if (line.removable === false) return null
    if (line.removeCreditUsd > 0) return line.removeCreditUsd
    if (equalSharePerLine != null) return equalSharePerLine
    return null
  }

  useEffect(() => {
    if (!selected) {
      setCustomOpen(false)
      setOpenEnhCustomizeIds(new Set())
    }
  }, [selected])

  useEffect(() => {
    if (togglableLines.length === 0) setCustomOpen(false)
  }, [togglableLines.length])

  const showCustomizeEstimate =
    selected && subtotal != null && base != null && credits > 0

  const optionalAdds = item.optionalAddOns ?? []
  const hasOptionalAdds = optionalAdds.length > 0
  const optionalApprox = selected
    ? sumOptionalAddOnSelectionsApprox(item.optionalAddOns, optionalSelectedIds)
    : null
  const enhancementDropdown = !!(enhancementCatalog?.length && selected)
  const showCardDetail =
    selected && (hasRate || lines.length > 0 || hasOptionalAdds || enhancementDropdown)

  return (
    <li>
      <div
        className={`rounded-xl border transition-all duration-300 ${
          selected
            ? 'bg-accent/15 border-accent/80 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]'
            : 'bg-white/[0.03] border-white/10 hover:border-white/25'
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          className="w-full text-left px-4 py-4 flex gap-4"
        >
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
              selected
                ? 'border-accent bg-accent text-white'
                : 'border-white/20 bg-white/5 text-white/50'
            }`}
          >
            {selected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="font-medium text-white">{item.title}</span>
              {hasRate && !selected && (
                <span className="text-xs text-white/40 shrink-0 tabular-nums">{item.price}</span>
              )}
            </span>
            <span className="block text-sm text-white/55 mt-1 leading-snug">{item.description}</span>
            {showAddonRollupHint && item.addonTotalsToward ? (
              <span className="block text-[10px] text-white/38 mt-1.5 leading-snug">
                {ADDON_ROLLUP_HINT[item.addonTotalsToward] ?? ADDON_ROLLUP_HINT.standalone}
              </span>
            ) : null}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {showCardDetail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/10 px-4 pb-4 ml-14 mr-4 space-y-4">
                {hasRate && (
                  <div className="space-y-1 pt-4">
                    <p className="text-sm font-medium text-accent tabular-nums">{item.price}</p>
                    {showCustomizeEstimate && (
                      <p className="text-xs text-white/55 tabular-nums">
                        Your customized estimate:{' '}
                        <span className="text-accent font-medium">
                          {formatMoneySimple(subtotal)}
                        </span>{' '}
                        ({formatMoneySimple(credits)} off list price —{' '}
                        {equalSharePerLine != null
                          ? 'equal amount per removable line you uncheck'
                          : 'per-line deductions where each line has a set amount, or amounts in ($…) on bullets'})
                      </p>
                    )}
                    {typeof optionalApprox === 'number' && optionalApprox > 0 ? (
                      <p className="text-xs text-white/50 tabular-nums mt-1">
                        + optional upgrades checked:{' '}
                        <span className="text-accent font-medium">
                          {formatMoneySimple(optionalApprox)}
                        </span>{' '}
                        (applied per upgrade rules below — first $ each)
                      </p>
                    ) : null}
                  </div>
                )}
                {hasCustomize ? (
                  <div>
                    <div className="mb-3 space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                        What&apos;s included
                      </p>
                      {togglableLines.length > 0 ? (
                        <button
                          type="button"
                          aria-expanded={customOpen}
                          aria-controls={`customize-panel-${item.id}`}
                          id={`customize-trigger-${item.id}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCustomOpen((o) => !o)
                          }}
                          className="w-full rounded-lg border border-accent/55 bg-accent/20 px-4 py-2.5 inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_2px_12px_rgba(0,0,0,0.35)] hover:bg-accent/35 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black/80 transition-colors"
                        >
                          <SquarePen className="w-4 h-4 text-accent shrink-0" aria-hidden />
                          {customOpen ? 'Close customize' : 'Customize this package'}
                        </button>
                      ) : null}
                    </div>

                    {!hasRate && lines.length > 0 ? (
                      <p className="text-[11px] text-amber-200/75 mb-2 leading-snug">
                        A <span className="font-medium text-white/85">list price with a $ amount</span>{' '}
                        on this package is needed for estimate math when you customize lines.
                      </p>
                    ) : null}

                    {!customOpen && togglableLines.length === 0 ? (
                      <p className="text-sm text-white/45 leading-snug">
                        Every feature in this package is <span className="text-white/60">fixed</span>
                        —individual lines can&apos;t be removed here.
                      </p>
                    ) : !customOpen ? (
                      <ul className="space-y-2">
                        {includedLinesUi.length === 0 ? (
                          <li className="text-sm text-white/45 italic leading-snug">
                            No bullets kept—use Customize if that was unintended, or confirm with
                            Story Cruz.
                          </li>
                        ) : (
                          includedLinesUi.map((line) => (
                            <li
                              key={line.id}
                              className="text-sm text-white/75 flex gap-2.5 leading-snug"
                            >
                              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <span>
                                {line.label}
                                {line.removable === false ? (
                                  <span className="text-white/38 text-xs"> (core)</span>
                                ) : lineDeductionHint(line) != null ? (
                                  <span className="text-white/35 text-xs">
                                    {' '}
                                    (~
                                    {formatMoneySimple(lineDeductionHint(line)!)}{' '}
                                    less when unchecked)
                                  </span>
                                ) : null}
                              </span>
                            </li>
                          ))
                        )}
                      </ul>
                    ) : null}

                    {customOpen ? (
                      <fieldset
                        id={`customize-panel-${item.id}`}
                        aria-labelledby={`customize-trigger-${item.id}`}
                        className="space-y-2.5 mt-3 border-none p-0 m-0"
                      >
                        <legend className="sr-only">Customize package inclusions</legend>
                        {lines.map((line) => {
                          const locked = line.removable === false
                          const checked =
                            locked || !excludedLineIds.has(line.id)
                          const d = lineDeductionHint(line)
                          return (
                            <label
                              key={line.id}
                              className={`flex items-start gap-2.5 text-sm rounded-lg px-1 py-1 -mx-1 select-none ${
                                locked
                                  ? 'text-white/60 cursor-default'
                                  : 'text-white/80 cursor-pointer hover:bg-white/[0.03]'
                              }`}
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                disabled={locked}
                                className="mt-1 h-4 w-4 shrink-0 rounded border-white/30 bg-white/10 text-accent focus:ring-accent disabled:opacity-40"
                                checked={checked}
                                onChange={(e) => {
                                  if (locked) return
                                  onLineIncludeChange(line.id, e.target.checked)
                                }}
                              />
                              <span className="leading-snug flex-1 min-w-0">
                                <span className="text-white/85">
                                  {line.label}
                                  {locked ? (
                                    <span className="text-white/38 text-xs font-normal">
                                      {' '}
                                      (core — not removable)
                                    </span>
                                  ) : null}
                                </span>
                                {locked ? (
                                  <span className="block text-[11px] text-white/35 mt-0.5">
                                    Always stays in this package when selected.
                                  </span>
                                ) : d != null ? (
                                  <span className="block text-[11px] text-white/45 mt-0.5 tabular-nums">
                                    Uncheck → −{formatMoneySimple(d)} from this package estimate
                                  </span>
                                ) : (
                                  <span className="block text-[11px] text-white/30 mt-0.5">
                                    When a line has a dollar amount (or ends with e.g. ($350)), unchecking
                                    can reduce this estimate.
                                  </span>
                                )}
                              </span>
                            </label>
                          )
                        })}
                        {equalSharePerLine != null ? (
                          <p className="text-[11px] text-white/40 mt-2 leading-snug">
                            List price is split evenly across{' '}
                            <span className="text-white/55">{togglableLines.length}</span> removable
                            line{togglableLines.length === 1 ? '' : 's'} (fixed “core” lines are
                            excluded). Per-line dollar amounts give exact credits when you uncheck.
                          </p>
                        ) : togglableLines.some((l) => l.removeCreditUsd === 0) ? (
                          <p className="text-[11px] text-white/35 mt-2 leading-snug">
                            Removable lines without a set dollar credit deduct{' '}
                            <span className="text-white/50">$0</span> here. Lines that end with{' '}
                            <span className="text-white/50">($…)</span> can carry a parsed credit.
                          </p>
                        ) : null}
                      </fieldset>
                    ) : null}
                  </div>
                ) : null}

                {!hasCustomize && lines.length === 0 && selected && (
                  <p className="text-xs text-white/40 pt-2">
                    There aren&apos;t line-by-line options to customize on this package yet—we can
                    walk through details when we reply.
                  </p>
                )}

                {hasOptionalAdds ? (
                  <div className="pt-5 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/85 mb-2">
                      Add more to this selection
                    </p>
                    <p className="text-[11px] text-white/45 mb-3 leading-snug">
                      Check upgrades you&apos;d like layered onto this tier. Estimates use the first
                      dollar amount shown on each line.
                    </p>
                    <ul className="space-y-2.5">
                      {optionalAdds.map((add) => {
                        const on = optionalSelectedIds.has(add.id)
                        return (
                          <li key={add.id}>
                            <label
                              className="flex items-start gap-2.5 text-sm rounded-lg px-1 py-1 -mx-1 cursor-pointer hover:bg-emerald-500/[0.08] select-none text-white/85"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 shrink-0 rounded border-emerald-500/45 bg-black/40 text-emerald-400 focus:ring-emerald-500"
                                checked={on}
                                onChange={() => onToggleOptionalAdd(add.id)}
                              />
                              <span className="flex-1 min-w-0">
                                <span className="font-medium text-white">{add.title}</span>
                                <span className="block text-white/52 text-[13px] mt-0.5 leading-snug">
                                  {add.description}
                                </span>
                                {add.price?.trim() ? (
                                  <span className="block text-xs text-emerald-200/85 tabular-nums mt-1">
                                    {add.price}
                                  </span>
                                ) : (
                                  <span className="block text-[11px] text-white/38 mt-1">
                                    Pricing will be confirmed with your quote.
                                  </span>
                                )}
                                {add.addonTotalsToward ? (
                                  <span className="block text-[10px] text-white/35 mt-1">
                                    {ADDON_ROLLUP_HINT[add.addonTotalsToward]}
                                  </span>
                                ) : null}
                              </span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : null}

                {enhancementDropdown ? (
                  <div className="pt-5 border-t border-white/10">
                    <div className="flex items-start gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-accent/90 mb-1">
                          {enhancementSectionTitle ?? 'Enhancements'}
                        </p>
                        {enhancementSectionSubtitle?.trim() ? (
                          <p className="text-[11px] text-white/45 leading-snug">
                            {enhancementSectionSubtitle.trim()}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <label className="block text-[10px] uppercase tracking-wider text-white/38 mb-1.5">
                      Add enhancement
                    </label>
                    <select
                      className="w-full rounded-lg border border-white/20 bg-black/55 px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                      title="Choose an enhancement to add to this package"
                      aria-label={`Add enhancement — ${enhancementSectionTitle ?? 'Enhancements'}`}
                      value=""
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const v = e.target.value.trim()
                        e.target.selectedIndex = 0
                        if (v.length) onAddEnhancement(v)
                      }}
                    >
                      <option value="">Scroll list — tap to attach to this tier</option>
                      {enhancementCatalog!.map((a) => (
                        <option
                          key={a.id}
                          value={a.id}
                          disabled={enhancementSelectedIds.has(a.id)}
                        >
                          {a.title}
                          {a.price?.trim() ? ` — ${a.price.trim().slice(0, 72)}` : ''}
                        </option>
                      ))}
                    </select>

                    {(enhancementSelectedIds?.size ?? 0) === 0 ? (
                      <p className="text-[11px] text-white/35 mt-3 leading-snug italic">
                        No enhancements on this tier yet.
                      </p>
                    ) : (
                      <ul className="mt-4 space-y-3">
                        {[...enhancementSelectedIds].map((addonId) => {
                          const add = enhancementCatalog!.find((x) => x.id === addonId)
                          if (!add) return null
                          const ex = enhancementLineExclusionsGetter(addonId)
                          const { subtotal, equalSharePerLine } = computePackageEstimate(add, ex)
                          const addonLines = getIncludedLines(add)
                          const addonToggles = addonLines.filter((l) => l.removable !== false)
                          const enhCustomizeOpen = openEnhCustomizeIds.has(addonId)

                          const lineDeductionEnh = (line: PackageIncludedLine): number | null => {
                            if (line.removable === false) return null
                            if (line.removeCreditUsd > 0) return line.removeCreditUsd
                            if (equalSharePerLine != null) return equalSharePerLine
                            return null
                          }

                          return (
                            <li
                              key={addonId}
                              className="rounded-lg border border-violet-500/25 bg-violet-500/[0.07] px-3 py-3"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex flex-wrap gap-2 items-start justify-between">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-white">{add.title}</p>
                                  {add.price?.trim() ? (
                                    <p className="text-xs text-white/50 tabular-nums mt-0.5">
                                      {add.price}
                                    </p>
                                  ) : null}
                                  {subtotal != null ? (
                                    <p className="text-xs text-accent tabular-nums mt-1">
                                      Tier est.: {formatMoneySimple(subtotal)} pre-tax
                                    </p>
                                  ) : null}
                                  {add.addonTotalsToward ? (
                                    <span className="block text-[10px] text-white/38 mt-1">
                                      {ADDON_ROLLUP_HINT[add.addonTotalsToward]}
                                    </span>
                                  ) : null}
                                </div>
                                <button
                                  type="button"
                                  aria-label={`Remove ${add.title}`}
                                  className="shrink-0 text-[11px] uppercase tracking-wide text-white/45 hover:text-rose-200 border border-white/15 rounded px-2 py-1"
                                  onClick={() => {
                                    setOpenEnhCustomizeIds((prev) => {
                                      const n = new Set(prev)
                                      n.delete(addonId)
                                      return n
                                    })
                                    onRemoveEnhancement(addonId)
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                              {addonToggles.length > 0 ? (
                                <>
                                  <button
                                    type="button"
                                    className="mt-3 w-full rounded-md border border-violet-500/40 bg-violet-500/15 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet-100/90 hover:bg-violet-500/25"
                                    onClick={() =>
                                      setOpenEnhCustomizeIds((prev) => {
                                        const n = new Set(prev)
                                        if (n.has(addonId)) n.delete(addonId)
                                        else n.add(addonId)
                                        return n
                                      })
                                    }
                                  >
                                    {enhCustomizeOpen
                                      ? 'Close enhancement customize'
                                      : 'Customize bullets (optional credits)'}
                                  </button>
                                  {enhCustomizeOpen ? (
                                    <fieldset className="border-none p-0 m-0 mt-2 space-y-2">
                                      <legend className="sr-only">Customize enhancement lines</legend>
                                      {addonLines.map((line) => {
                                        const locked = line.removable === false
                                        const checked = locked || !ex.has(line.id)
                                        const d = lineDeductionEnh(line)
                                        return (
                                          <label
                                            key={line.id}
                                            className={`flex items-start gap-2 text-xs rounded-md px-1 py-1 -mx-1 ${
                                              locked
                                                ? 'text-white/50 cursor-default'
                                                : 'text-white/80 cursor-pointer hover:bg-white/[0.04]'
                                            }`}
                                          >
                                            <input
                                              type="checkbox"
                                              disabled={locked}
                                              className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/25 bg-black/40 text-violet-400 focus:ring-violet-400"
                                              checked={checked}
                                              onChange={(e) => {
                                                if (locked) return
                                                onEnhancementLineIncludeChange(
                                                  addonId,
                                                  line.id,
                                                  e.target.checked
                                                )
                                              }}
                                            />
                                            <span className="leading-snug flex-1 min-w-0">
                                              <span className="text-white/82">{line.label}</span>
                                              {!locked && d != null ? (
                                                <span className="block text-[10px] text-white/40 mt-0.5 tabular-nums">
                                                  Uncheck → −{formatMoneySimple(d)} from this enhancement
                                                  estimate
                                                </span>
                                              ) : !locked ? (
                                                <span className="block text-[10px] text-white/28 mt-0.5">
                                                  Amounts in ($…) on a line can set how much unchecking
                                                  adjusts the estimate.
                                                </span>
                                              ) : null}
                                            </span>
                                          </label>
                                        )
                                      })}
                                    </fieldset>
                                  ) : null}
                                </>
                              ) : null}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  )
}

function clampInt(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, Math.round(n)))
}

function countStandaloneOptionalAdds(
  items: PackageCatalogItem[],
  selectionsByPkg: Record<string, Set<string>>
): number {
  let n = 0
  for (const item of items) {
    const sel = selectionsByPkg[item.id]
    if (!sel?.size) continue
    for (const add of item.optionalAddOns ?? []) {
      if (
        sel.has(add.id) &&
        (add.addonTotalsToward ?? 'standalone') === 'standalone'
      ) {
        n++
      }
    }
  }
  return n
}

function hasPackageOptionalAddsSelected(
  selectedIds: Set<string>,
  selections: Record<string, Set<string>>
): boolean {
  for (const id of selectedIds) {
    const s = selections[id]
    if (s?.size) return true
  }
  return false
}

function enhancementLookupHasAny(
  selectedIds: Set<string>,
  byTier: Record<string, Set<string>>
): boolean {
  for (const id of selectedIds) {
    const s = byTier[id]
    if (s?.size) return true
  }
  return false
}

function initQuantityState(vars: PackageBuilderVariableResolved[]): Record<string, number> {
  const o: Record<string, number> = {}
  for (const v of vars) {
    if (v.kind !== 'quantity') continue
    o[v.key] = clampInt(v.defaultCount, v.min, v.max)
  }
  return o
}

function initEmptyPickState(vars: PackageBuilderVariableResolved[]): Record<string, Set<string>> {
  const o: Record<string, Set<string>> = {}
  for (const v of vars) {
    if (v.kind === 'feature_pick') o[v.key] = new Set<string>()
  }
  return o
}

function sumQuantityTowardApprox(
  vars: PackageBuilderVariableResolved[],
  qtyByKey: Record<string, number>,
  toward: AddonTotalsToward
): number | null {
  let sum = 0
  let any = false
  for (const v of vars) {
    if (v.kind !== 'quantity' || v.totalsToward !== toward) continue
    const c = clampInt(qtyByKey[v.key] ?? v.defaultCount, v.min, v.max)
    if (c <= 0) continue
    const line = estimateQuantityLineTotal(v.pricePerUnit, c)
    if (line != null) {
      sum += line
      any = true
    }
  }
  return any ? sum : null
}

function toggleInSet(set: Set<string>, id: string): Set<string> {
  const next = new Set(set)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

function togglePickIds(
  allowMultiple: boolean,
  prev: Set<string>,
  optionId: string
): Set<string> {
  if (allowMultiple) return toggleInSet(prev, optionId)
  const next = new Set<string>()
  if (prev.has(optionId)) return next
  next.add(optionId)
  return next
}

/** Payload rows nested under each tier (`alacarteSelections`) for CRM / API rollup. */

function enhancementsToPayloadRows(
  addonIds: Set<string> | undefined,
  addonCatalog: PackageCatalogItem[],
  exclusionByAddon: Record<string, Set<string>> | undefined
): Record<string, unknown>[] {
  if (!addonIds?.size) return []
  const byId = new Map(addonCatalog.map((a) => [a.id, a]))
  const out: Record<string, unknown>[] = []
  for (const addonId of addonIds) {
    const addon = byId.get(addonId)
    if (!addon) continue
    const ex = exclusionByAddon?.[addonId] ?? new Set<string>()
    const addonLines = getIncludedLines(addon)
    const retained = addonLines
      .filter((l) => l.removable === false || !ex.has(l.id))
      .map((l) => l.label)
    const removed = addonLines
      .filter((l) => l.removable !== false && ex.has(l.id))
      .map((l) => l.label)
    const { subtotal } = computePackageEstimate(addon, ex)
    const priceTrim = addon.price?.trim()

    const row: Record<string, unknown> = {
      addonId: addon.id,
      title: addon.title.trim(),
    }
    if (priceTrim) row.price = priceTrim
    if (typeof subtotal === 'number') row.estimatedSubtotal = subtotal
    if (addon.addonTotalsToward) row.addonTotalsToward = addon.addonTotalsToward
    if (retained.length) row.included = retained
    if (removed.length) row.removedLines = removed
    out.push(row)
  }
  return out
}

function buildCatalogSelectionPayload(
  item: PackageCatalogItem,
  excluded?: Set<string>,
  optionalSelected?: Set<string>
): Record<string, unknown> {
  const lines = getIncludedLines(item)
  const ex = excluded ?? new Set<string>()
  const retained = lines
    .filter((l) => l.removable === false || !ex.has(l.id))
    .map((l) => l.label)
  const removed = lines
    .filter((l) => l.removable !== false && ex.has(l.id))
    .map((l) => l.label)
  const { subtotal } = computePackageEstimate(item, ex)
  const price = item.price?.trim()

  const optSel = optionalSelected ?? new Set<string>()
  const optionalSelections = (item.optionalAddOns ?? [])
    .filter((a) => optSel.has(a.id))
    .map((a) => {
      const est = extractFirstDollarAmount(a.price ?? '')
      const row: Record<string, unknown> = {
        addonId: a.id,
        title: a.title.trim(),
      }
      if (a.price?.trim()) row.price = a.price.trim()
      if (typeof est === 'number') row.estimatedSubtotal = est
      if (a.addonTotalsToward) row.addonTotalsToward = a.addonTotalsToward
      return row
    })

  return {
    packageId: item.id,
    title: item.title.trim(),
    ...(price ? { price } : {}),
    ...(retained.length ? { included: retained } : {}),
    ...(removed.length ? { removedLines: removed } : {}),
    ...(typeof subtotal === 'number' ? { estimatedSubtotal: subtotal } : {}),
    ...(item.addonTotalsToward ? { addonTotalsToward: item.addonTotalsToward } : {}),
    ...(optionalSelections.length ? { optionalSelections } : {}),
  }
}

const DEFAULT_PACKAGE_HERO_MP4 = '/inquire-bg.mp4'

export default function TestingPackageBuilder({
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
  useInvestmentStyleHero = false,
  heroVideoSrc = null,
  submissionSlug = null,
}: TestingPackageBuilderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [fullName, setFullName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [eventType, setEventType] = useState<EventType>(null)
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')

  const [photoSelected, setPhotoSelected] = useState<Set<string>>(new Set())
  const [videoSelected, setVideoSelected] = useState<Set<string>>(new Set())
  /** When a tier is selected and this is false, only selected tier cards render (less clutter). */
  const [photoBrowseAllTiers, setPhotoBrowseAllTiers] = useState(false)
  const [videoBrowseAllTiers, setVideoBrowseAllTiers] = useState(false)

  /** Per catalog item id: excluded `includedLines` ids (unchecked in customize). */
  const [photoLineExclusions, setPhotoLineExclusions] = useState<
    Record<string, Set<string>>
  >({})
  const [videoLineExclusions, setVideoLineExclusions] = useState<
    Record<string, Set<string>>
  >({})
  /** Per tier id: À la carte catalog rows attached via dropdown on that card */
  const [photoEnhanceByTier, setPhotoEnhanceByTier] = useState<
    Record<string, Set<string>>
  >({})
  const [videoEnhanceByTier, setVideoEnhanceByTier] = useState<
    Record<string, Set<string>>
  >({})
  /** `{ [tierId]: { [addonCatalogId]: excluded line ids } }` */
  const [photoEnhanceLineExcl, setPhotoEnhanceLineExcl] = useState<
    Record<string, Record<string, Set<string>>>
  >({})
  const [videoEnhanceLineExcl, setVideoEnhanceLineExcl] = useState<
    Record<string, Record<string, Set<string>>>
  >({})
  const [qtyByKey, setQtyByKey] = useState<Record<string, number>>(() =>
    initQuantityState(builderVariables)
  )
  const [variablePickSelections, setVariablePickSelections] = useState<
    Record<string, Set<string>>
  >(() => initEmptyPickState(builderVariables))
  const [variablePickLineExclusions, setVariablePickLineExclusions] = useState<
    Record<string, Set<string>>
  >({})
  /** Checkbox “add more” rows configured per package (`optionalAddOns`). */
  const [photoPackageOptionalAdds, setPhotoPackageOptionalAdds] = useState<
    Record<string, Set<string>>
  >({})
  const [videoPackageOptionalAdds, setVideoPackageOptionalAdds] = useState<
    Record<string, Set<string>>
  >({})

  const emptyExcluded = useMemo(() => new Set<string>(), [])

  useEffect(() => {
    if (photoSelected.size === 0) setPhotoBrowseAllTiers(false)
  }, [photoSelected.size])

  useEffect(() => {
    if (videoSelected.size === 0) setVideoBrowseAllTiers(false)
  }, [videoSelected.size])

  const photoHasMultipleTiers = photoCatalog.length > 1
  const videoHasMultipleTiers = videoCatalog.length > 1

  const visiblePhotoPackages = useMemo(() => {
    if (photoSelected.size === 0 || photoBrowseAllTiers) return photoCatalog
    return photoCatalog.filter((i) => photoSelected.has(i.id))
  }, [photoCatalog, photoSelected, photoBrowseAllTiers])

  const visibleVideoPackages = useMemo(() => {
    if (videoSelected.size === 0 || videoBrowseAllTiers) return videoCatalog
    return videoCatalog.filter((i) => videoSelected.has(i.id))
  }, [videoCatalog, videoSelected, videoBrowseAllTiers])

  const selectedPhotoItems = photoCatalog.filter((i) => photoSelected.has(i.id))
  const selectedVideoItems = videoCatalog.filter((i) => videoSelected.has(i.id))
  const getPhotoEnhancementExcluded = (
    tierId: string,
    addonId: string
  ): Set<string> => photoEnhanceLineExcl[tierId]?.[addonId] ?? emptyExcluded

  const getVideoEnhancementExcluded = (
    tierId: string,
    addonId: string
  ): Set<string> => videoEnhanceLineExcl[tierId]?.[addonId] ?? emptyExcluded
  const getVarPickExcluded = (id: string) => variablePickLineExclusions[id] ?? emptyExcluded

  const selectedVariablePickItems = useMemo(() => {
    const picked: PackageCatalogItem[] = []
    for (const node of builderVariables) {
      if (node.kind !== 'feature_pick') continue
      const sel = variablePickSelections[node.key] ?? new Set<string>()
      if (sel.size === 0) continue
      for (const item of node.optionsCatalog) {
        if (sel.has(item.id)) picked.push(item)
      }
    }
    return picked
  }, [builderVariables, variablePickSelections])

  const photoApproxSubtotal = columnSubtotalEstimate(selectedPhotoItems, (id) => {
    return photoLineExclusions[id] ?? emptyExcluded
  })
  const videoApproxSubtotal = columnSubtotalEstimate(selectedVideoItems, (id) => {
    return videoLineExclusions[id] ?? emptyExcluded
  })

  const enhPhoto_photo = aggregateEnhancementSelectionsTowardApprox(
    selectedPhotoItems,
    photoEnhanceByTier,
    photoEnhanceLineExcl,
    addonCatalog,
    'photography'
  )
  const enhPhoto_cinema = aggregateEnhancementSelectionsTowardApprox(
    selectedPhotoItems,
    photoEnhanceByTier,
    photoEnhanceLineExcl,
    addonCatalog,
    'cinematography'
  )
  const enhPhoto_standalone = aggregateEnhancementSelectionsTowardApprox(
    selectedPhotoItems,
    photoEnhanceByTier,
    photoEnhanceLineExcl,
    addonCatalog,
    'standalone'
  )
  const enhVideo_photo = aggregateEnhancementSelectionsTowardApprox(
    selectedVideoItems,
    videoEnhanceByTier,
    videoEnhanceLineExcl,
    addonCatalog,
    'photography'
  )
  const enhVideo_cinema = aggregateEnhancementSelectionsTowardApprox(
    selectedVideoItems,
    videoEnhanceByTier,
    videoEnhanceLineExcl,
    addonCatalog,
    'cinematography'
  )
  const enhVideo_standalone = aggregateEnhancementSelectionsTowardApprox(
    selectedVideoItems,
    videoEnhanceByTier,
    videoEnhanceLineExcl,
    addonCatalog,
    'standalone'
  )
  const enhStandaloneMerged = mergeApproxSubtotals(enhPhoto_standalone, enhVideo_standalone)

  const varQtyPhotoPart = sumQuantityTowardApprox(builderVariables, qtyByKey, 'photography')
  const varQtyVideoPart = sumQuantityTowardApprox(builderVariables, qtyByKey, 'cinematography')
  const varQtyStandalonePart = sumQuantityTowardApprox(
    builderVariables,
    qtyByKey,
    'standalone'
  )

  const varPickPhotoPart = addonSubtotalTowardEstimate(
    selectedVariablePickItems,
    'photography',
    getVarPickExcluded
  )
  const varPickVideoPart = addonSubtotalTowardEstimate(
    selectedVariablePickItems,
    'cinematography',
    getVarPickExcluded
  )
  const varPickStandalonePart = addonSubtotalTowardEstimate(
    selectedVariablePickItems,
    'standalone',
    getVarPickExcluded
  )

  const pkgOptPhotoPart = optionalAddOnSelectionsTowardApprox(
    selectedPhotoItems,
    photoPackageOptionalAdds,
    'photography'
  )
  const pkgOptVideoPart = optionalAddOnSelectionsTowardApprox(
    selectedVideoItems,
    videoPackageOptionalAdds,
    'cinematography'
  )
  const pkgOptStandalonePhoto = optionalAddOnSelectionsTowardApprox(
    selectedPhotoItems,
    photoPackageOptionalAdds,
    'standalone'
  )
  const pkgOptStandaloneVideo = optionalAddOnSelectionsTowardApprox(
    selectedVideoItems,
    videoPackageOptionalAdds,
    'standalone'
  )
  const pkgOptStandaloneMerged = mergeApproxSubtotals(pkgOptStandalonePhoto, pkgOptStandaloneVideo)

  const photoMergedApprox = mergeApproxSubtotals(
    mergeApproxSubtotals(
      mergeApproxSubtotals(
        mergeApproxSubtotals(
          mergeApproxSubtotals(photoApproxSubtotal, enhPhoto_photo),
          enhVideo_photo
        ),
        varQtyPhotoPart
      ),
      varPickPhotoPart
    ),
    pkgOptPhotoPart
  )
  const videoMergedApprox = mergeApproxSubtotals(
    mergeApproxSubtotals(
      mergeApproxSubtotals(
        mergeApproxSubtotals(
          mergeApproxSubtotals(videoApproxSubtotal, enhPhoto_cinema),
          enhVideo_cinema
        ),
        varQtyVideoPart
      ),
      varPickVideoPart
    ),
    pkgOptVideoPart
  )

  const standaloneEstimated = mergeApproxSubtotals(
    mergeApproxSubtotals(
      mergeApproxSubtotals(pkgOptStandaloneMerged, varQtyStandalonePart),
      varPickStandalonePart
    ),
    enhStandaloneMerged
  )

  const combinedApproxSubtotal =
    photoMergedApprox != null || videoMergedApprox != null || standaloneEstimated != null
      ? (photoMergedApprox ?? 0) + (videoMergedApprox ?? 0) + (standaloneEstimated ?? 0)
      : null

  const standaloneEnhancementSelections =
    countEnhancementStandaloneSelections(
      selectedPhotoItems,
      photoEnhanceByTier,
      addonCatalog
    ) +
    countEnhancementStandaloneSelections(
      selectedVideoItems,
      videoEnhanceByTier,
      addonCatalog
    )

  const standalonePickCount = selectedVariablePickItems.filter(
    (i) => (i.addonTotalsToward ?? 'standalone') === 'standalone'
  ).length

  const hasVariableSelections = builderVariables.some((v) => {
    if (v.kind === 'quantity') {
      const c = clampInt(qtyByKey[v.key] ?? v.defaultCount, v.min, v.max)
      return c > 0
    }
    return (variablePickSelections[v.key]?.size ?? 0) > 0
  })

  const photoExtrasMerged = mergeApproxSubtotals(
    mergeApproxSubtotals(
      mergeApproxSubtotals(
        mergeApproxSubtotals(enhPhoto_photo, enhVideo_photo),
        varQtyPhotoPart
      ),
      varPickPhotoPart
    ),
    pkgOptPhotoPart
  )
  const videoExtrasMerged = mergeApproxSubtotals(
    mergeApproxSubtotals(
      mergeApproxSubtotals(
        mergeApproxSubtotals(enhPhoto_cinema, enhVideo_cinema),
        varQtyVideoPart
      ),
      varPickVideoPart
    ),
    pkgOptVideoPart
  )
  const standaloneQuantityVarsActive = builderVariables.reduce((acc, v) => {
    if (v.kind !== 'quantity' || v.totalsToward !== 'standalone') return acc
    const c = clampInt(qtyByKey[v.key] ?? v.defaultCount, v.min, v.max)
    return acc + (c > 0 ? 1 : 0)
  }, 0)

  const showStandaloneTotalsTile =
    addonCatalog.length > 0 ||
    varQtyStandalonePart != null ||
    varPickStandalonePart != null ||
    pkgOptStandaloneMerged != null ||
    builderVariables.some(
      (v) => v.kind === 'quantity' && v.totalsToward === 'standalone'
    ) ||
    photoCatalog.some((row) => (row.optionalAddOns?.length ?? 0) > 0) ||
    videoCatalog.some((row) => (row.optionalAddOns?.length ?? 0) > 0)

  const standalonePackageOptCount =
    countStandaloneOptionalAdds(selectedPhotoItems, photoPackageOptionalAdds) +
    countStandaloneOptionalAdds(selectedVideoItems, videoPackageOptionalAdds)

  const standaloneSelectionTally =
    standaloneEnhancementSelections +
    standalonePickCount +
    standaloneQuantityVarsActive +
    standalonePackageOptCount

  const activeVariableLineCount = builderVariables.reduce((acc, v) => {
    if (v.kind === 'quantity') {
      return (
        acc + (clampInt(qtyByKey[v.key] ?? v.defaultCount, v.min, v.max) > 0 ? 1 : 0)
      )
    }
    return acc + (variablePickSelections[v.key]?.size ?? 0)
  }, 0)

  const hasPkgOptionalAddsSelected =
    hasPackageOptionalAddsSelected(photoSelected, photoPackageOptionalAdds) ||
    hasPackageOptionalAddsSelected(videoSelected, videoPackageOptionalAdds)

  const hasEnhancementOnAnyTier =
    enhancementLookupHasAny(photoSelected, photoEnhanceByTier) ||
    enhancementLookupHasAny(videoSelected, videoEnhanceByTier)

  const canSubmit =
    fullName.trim() &&
    email.trim() &&
    eventType !== null &&
    (photoSelected.size > 0 ||
      videoSelected.size > 0 ||
      hasEnhancementOnAnyTier ||
      hasVariableSelections ||
      hasPkgOptionalAddsSelected)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)

    const quantityVariablePayload = builderVariables.flatMap((v) => {
      if (v.kind !== 'quantity') return []
      const c = clampInt(qtyByKey[v.key] ?? v.defaultCount, v.min, v.max)
      if (c <= 0) return []
      const est = estimateQuantityLineTotal(v.pricePerUnit, c)
      return [
        {
          variableKey: v.key,
          title: v.title,
          unitLabel: v.unitLabel,
          count: c,
          pricePerUnit: v.pricePerUnit,
          totalsToward: v.totalsToward,
          ...(typeof est === 'number' ? { estimatedSubtotal: est } : {}),
        },
      ]
    })

    try {
      const response = await fetch('/api/testing-package-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          partnerName: partnerName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          eventType,
          eventDate: eventDate.trim(),
          location: location.trim(),
          notes: notes.trim(),
          photoItems: selectedPhotoItems.map((item) => {
            const enhRows = enhancementsToPayloadRows(
              photoEnhanceByTier[item.id],
              addonCatalog,
              photoEnhanceLineExcl[item.id]
            )
            const base = buildCatalogSelectionPayload(
              item,
              photoLineExclusions[item.id],
              photoPackageOptionalAdds[item.id]
            )
            return enhRows.length ? { ...base, alacarteSelections: enhRows } : base
          }),
          videoItems: selectedVideoItems.map((item) => {
            const enhRows = enhancementsToPayloadRows(
              videoEnhanceByTier[item.id],
              addonCatalog,
              videoEnhanceLineExcl[item.id]
            )
            const base = buildCatalogSelectionPayload(
              item,
              videoLineExclusions[item.id],
              videoPackageOptionalAdds[item.id]
            )
            return enhRows.length ? { ...base, alacarteSelections: enhRows } : base
          }),
          addonItems: [],
          quantityVariables: quantityVariablePayload,
          variablePickItems: selectedVariablePickItems.map((item) =>
            buildCatalogSelectionPayload(item, variablePickLineExclusions[item.id])
          ),
          ...(submissionSlug?.trim()
            ? { packageBuilderSlug: submissionSlug.trim() }
            : {}),
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to submit')
      }

      setIsSubmitted(true)
    } catch (err) {
      console.error(err)
      alert(
        err instanceof Error
          ? err.message
          : 'There was an error submitting. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-black text-white relative overflow-hidden">
        <BackgroundWater />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-12 h-12 text-accent" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">Thank you!</h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Your package details were sent to our team. We&apos;ll review your selections and reply
              within <span className="text-accent font-semibold">24–48 hours</span>.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wider text-sm rounded-full transition-all duration-300"
            >
              Return home
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main
      className={`min-h-screen relative overflow-hidden text-white selection:bg-white/20 ${
        useInvestmentStyleHero ? 'bg-[#050505]' : 'bg-black'
      }`}
    >
      {useInvestmentStyleHero ? (
        <InvestmentGuideHero
          title={title}
          videoSrc={heroVideoSrc ?? DEFAULT_PACKAGE_HERO_MP4}
        />
      ) : (
        <>
          <BackgroundWater />
          <div className="relative z-10 pt-32 pb-0 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
              >
                {eyebrow ? (
                  <p className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-4">
                    {eyebrow}
                  </p>
                ) : null}
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">{title}</h1>
                <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">{intro}</p>
              </motion.div>
            </div>
          </div>
        </>
      )}

      <div
        className={`relative z-20 px-6 md:px-12 pb-24 ${useInvestmentStyleHero ? '-mt-32 pt-8' : 'pt-12'}`}
      >
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl mb-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <User className="w-6 h-6 text-accent shrink-0" />
                <h2 className="text-2xl font-serif text-white">Your info</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Full name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    Partner&apos;s name (optional)
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-sm text-white/60 mb-4">Event type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {EVENT_OPTIONS.map((opt) => {
                    const isSelected = eventType === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setEventType(opt.value)}
                        className={`px-4 py-3 rounded-xl border text-center text-sm transition-all duration-300 ${
                          isSelected
                            ? 'bg-accent/20 border-accent text-white'
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    Event date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                    placeholder="City or venue"
                  />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-10">
              <motion.section
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <Camera className="w-7 h-7 text-accent" />
                  <div>
                    <h2 className="text-xl font-serif text-white">{photoColumnTitle}</h2>
                    <p className="text-xs text-white/45 uppercase tracking-wider mt-1">
                      {photoColumnSubtitle}
                    </p>
                  </div>
                </div>

                {photoSelected.size > 0 && photoHasMultipleTiers ? (
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
                    {!photoBrowseAllTiers ? (
                      <>
                        <p className="text-xs text-white/55 leading-snug">
                          Showing your selected package{photoSelected.size > 1 ? 's' : ''} only.
                        </p>
                        <button
                          type="button"
                          onClick={() => setPhotoBrowseAllTiers(true)}
                          className="inline-flex items-center gap-1.5 shrink-0 rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/85 hover:bg-white/10 hover:border-white/30 transition-colors"
                        >
                          <List className="w-3.5 h-3.5" aria-hidden />
                          Browse all collections
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-white/55 leading-snug">
                          All photography options — your picks stay selected.
                        </p>
                        <button
                          type="button"
                          onClick={() => setPhotoBrowseAllTiers(false)}
                          className="inline-flex items-center gap-1.5 shrink-0 rounded-md border border-accent/45 bg-accent/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent hover:bg-accent/25 transition-colors"
                        >
                          Focus on selection
                        </button>
                      </>
                    )}
                  </div>
                ) : null}

                <ul className="space-y-4">
                  {visiblePhotoPackages.map((item) => (
                    <CatalogOption
                      key={item.id}
                      item={item}
                      selected={photoSelected.has(item.id)}
                      enhancementCatalog={addonCatalog}
                      enhancementSectionTitle={addonSectionTitle}
                      enhancementSectionSubtitle={addonSectionSubtitle}
                      enhancementSelectedIds={
                        photoEnhanceByTier[item.id] ?? FALLBACK_EMPTY_OPTIONAL
                      }
                      onAddEnhancement={(addonId) => {
                        setPhotoEnhanceByTier((prev) => {
                          const base = new Set(prev[item.id] ?? [])
                          if (base.has(addonId)) return prev
                          base.add(addonId)
                          return { ...prev, [item.id]: base }
                        })
                      }}
                      onRemoveEnhancement={(addonId) => {
                        setPhotoEnhanceByTier((prev) => {
                          const base = new Set(prev[item.id] ?? [])
                          base.delete(addonId)
                          const merged = { ...prev }
                          if (base.size === 0) delete merged[item.id]
                          else merged[item.id] = base
                          return merged
                        })
                        setPhotoEnhanceLineExcl((nex) => {
                          const tier = nex[item.id]
                          if (!tier?.[addonId]) return nex
                          const tierNext = { ...tier }
                          delete tierNext[addonId]
                          const merged = { ...nex }
                          if (Object.keys(tierNext).length === 0) delete merged[item.id]
                          else merged[item.id] = tierNext
                          return merged
                        })
                      }}
                      enhancementLineExclusionsGetter={(addonId) =>
                        getPhotoEnhancementExcluded(item.id, addonId)
                      }
                      onEnhancementLineIncludeChange={(addonId, lineId, nowIncluded) => {
                        setPhotoEnhanceLineExcl((prev) => {
                          const tierNested = prev[item.id] ?? {}
                          const cur = new Set(tierNested[addonId] ?? [])
                          if (nowIncluded) cur.delete(lineId)
                          else cur.add(lineId)
                          return {
                            ...prev,
                            [item.id]: { ...tierNested, [addonId]: cur },
                          }
                        })
                      }}
                      optionalSelectedIds={
                        photoPackageOptionalAdds[item.id] ?? FALLBACK_EMPTY_OPTIONAL
                      }
                      onToggleOptionalAdd={(addonId) => {
                        setPhotoPackageOptionalAdds((prev) => {
                          const base = new Set(prev[item.id] ?? [])
                          return {
                            ...prev,
                            [item.id]: toggleInSet(base, addonId),
                          }
                        })
                      }}
                      excludedLineIds={
                        photoLineExclusions[item.id] ?? emptyExcluded
                      }
                      onLineIncludeChange={(lineId, nowIncluded) => {
                        setPhotoLineExclusions((prev) => {
                          const cur = new Set(prev[item.id] ?? [])
                          if (nowIncluded) cur.delete(lineId)
                          else cur.add(lineId)
                          return { ...prev, [item.id]: cur }
                        })
                      }}
                      onToggle={() => {
                        const removing = photoSelected.has(item.id)
                        setPhotoSelected((prev) => toggleInSet(prev, item.id))
                        if (removing) {
                          setPhotoLineExclusions((er) => {
                            const next = { ...er }
                            delete next[item.id]
                            return next
                          })
                          setPhotoPackageOptionalAdds((pa) => {
                            const next = { ...pa }
                            delete next[item.id]
                            return next
                          })
                          setPhotoEnhanceByTier((en) => {
                            const next = { ...en }
                            delete next[item.id]
                            return next
                          })
                          setPhotoEnhanceLineExcl((exn) => {
                            const next = { ...exn }
                            delete next[item.id]
                            return next
                          })
                        }
                      }}
                    />
                  ))}
                </ul>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <Video className="w-7 h-7 text-accent" />
                  <div>
                    <h2 className="text-xl font-serif text-white">{videoColumnTitle}</h2>
                    <p className="text-xs text-white/45 uppercase tracking-wider mt-1">
                      {videoColumnSubtitle}
                    </p>
                  </div>
                </div>

                {videoSelected.size > 0 && videoHasMultipleTiers ? (
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
                    {!videoBrowseAllTiers ? (
                      <>
                        <p className="text-xs text-white/55 leading-snug">
                          Showing your selected package{videoSelected.size > 1 ? 's' : ''} only.
                        </p>
                        <button
                          type="button"
                          onClick={() => setVideoBrowseAllTiers(true)}
                          className="inline-flex items-center gap-1.5 shrink-0 rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/85 hover:bg-white/10 hover:border-white/30 transition-colors"
                        >
                          <List className="w-3.5 h-3.5" aria-hidden />
                          Browse all collections
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-white/55 leading-snug">
                          All cinematography options — your picks stay selected.
                        </p>
                        <button
                          type="button"
                          onClick={() => setVideoBrowseAllTiers(false)}
                          className="inline-flex items-center gap-1.5 shrink-0 rounded-md border border-accent/45 bg-accent/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent hover:bg-accent/25 transition-colors"
                        >
                          Focus on selection
                        </button>
                      </>
                    )}
                  </div>
                ) : null}

                <ul className="space-y-4">
                  {visibleVideoPackages.map((item) => (
                    <CatalogOption
                      key={item.id}
                      item={item}
                      selected={videoSelected.has(item.id)}
                      enhancementCatalog={addonCatalog}
                      enhancementSectionTitle={addonSectionTitle}
                      enhancementSectionSubtitle={addonSectionSubtitle}
                      enhancementSelectedIds={
                        videoEnhanceByTier[item.id] ?? FALLBACK_EMPTY_OPTIONAL
                      }
                      onAddEnhancement={(addonId) => {
                        setVideoEnhanceByTier((prev) => {
                          const base = new Set(prev[item.id] ?? [])
                          if (base.has(addonId)) return prev
                          base.add(addonId)
                          return { ...prev, [item.id]: base }
                        })
                      }}
                      onRemoveEnhancement={(addonId) => {
                        setVideoEnhanceByTier((prev) => {
                          const base = new Set(prev[item.id] ?? [])
                          base.delete(addonId)
                          const merged = { ...prev }
                          if (base.size === 0) delete merged[item.id]
                          else merged[item.id] = base
                          return merged
                        })
                        setVideoEnhanceLineExcl((nex) => {
                          const tier = nex[item.id]
                          if (!tier?.[addonId]) return nex
                          const tierNext = { ...tier }
                          delete tierNext[addonId]
                          const merged = { ...nex }
                          if (Object.keys(tierNext).length === 0) delete merged[item.id]
                          else merged[item.id] = tierNext
                          return merged
                        })
                      }}
                      enhancementLineExclusionsGetter={(addonId) =>
                        getVideoEnhancementExcluded(item.id, addonId)
                      }
                      onEnhancementLineIncludeChange={(addonId, lineId, nowIncluded) => {
                        setVideoEnhanceLineExcl((prev) => {
                          const tierNested = prev[item.id] ?? {}
                          const cur = new Set(tierNested[addonId] ?? [])
                          if (nowIncluded) cur.delete(lineId)
                          else cur.add(lineId)
                          return {
                            ...prev,
                            [item.id]: { ...tierNested, [addonId]: cur },
                          }
                        })
                      }}
                      optionalSelectedIds={
                        videoPackageOptionalAdds[item.id] ?? FALLBACK_EMPTY_OPTIONAL
                      }
                      onToggleOptionalAdd={(addonId) => {
                        setVideoPackageOptionalAdds((prev) => {
                          const base = new Set(prev[item.id] ?? [])
                          return {
                            ...prev,
                            [item.id]: toggleInSet(base, addonId),
                          }
                        })
                      }}
                      excludedLineIds={
                        videoLineExclusions[item.id] ?? emptyExcluded
                      }
                      onLineIncludeChange={(lineId, nowIncluded) => {
                        setVideoLineExclusions((prev) => {
                          const cur = new Set(prev[item.id] ?? [])
                          if (nowIncluded) cur.delete(lineId)
                          else cur.add(lineId)
                          return { ...prev, [item.id]: cur }
                        })
                      }}
                      onToggle={() => {
                        const removing = videoSelected.has(item.id)
                        setVideoSelected((prev) => toggleInSet(prev, item.id))
                        if (removing) {
                          setVideoLineExclusions((er) => {
                            const next = { ...er }
                            delete next[item.id]
                            return next
                          })
                          setVideoPackageOptionalAdds((va) => {
                            const next = { ...va }
                            delete next[item.id]
                            return next
                          })
                          setVideoEnhanceByTier((en) => {
                            const next = { ...en }
                            delete next[item.id]
                            return next
                          })
                          setVideoEnhanceLineExcl((exn) => {
                            const next = { ...exn }
                            delete next[item.id]
                            return next
                          })
                        }
                      }}
                    />
                  ))}
                </ul>
              </motion.section>
            </div>

            {builderVariables.length > 0 ? (
              <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.215 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl mb-10"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <SlidersHorizontal className="w-7 h-7 text-accent shrink-0" />
                  <div>
                    <h2 className="text-xl font-serif text-white">{variablesSectionTitle}</h2>
                    <p className="text-xs text-white/45 uppercase tracking-wider mt-1">
                      {variablesSectionSubtitle}
                    </p>
                  </div>
                </div>
                <div className="space-y-8">
                  {builderVariables.map((node) =>
                    node.kind === 'quantity' ? (
                      <div
                        key={node.reactKey}
                        className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4 md:px-5 md:py-5"
                      >
                        <h3 className="text-lg font-medium text-white">{node.title}</h3>
                        {node.description ? (
                          <p className="text-sm text-white/55 mt-1 leading-snug">{node.description}</p>
                        ) : null}
                        <p className="text-[10px] text-white/38 mt-2">
                          {ADDON_ROLLUP_HINT[node.totalsToward]}
                        </p>
                        {node.pricePerUnit ? (
                          <p className="text-xs text-white/45 mt-2 tabular-nums">{node.pricePerUnit}</p>
                        ) : null}
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          <span className="text-[10px] uppercase tracking-wider text-white/45">
                            {node.unitLabel}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="h-10 w-10 rounded-lg border border-white/20 bg-white/5 text-white flex items-center justify-center hover:bg-white/10 disabled:opacity-30"
                              aria-label="Decrease"
                              disabled={
                                clampInt(qtyByKey[node.key] ?? node.defaultCount, node.min, node.max) <=
                                node.min
                              }
                              onClick={() =>
                                setQtyByKey((prev) => {
                                  const cur = clampInt(
                                    prev[node.key] ?? node.defaultCount,
                                    node.min,
                                    node.max
                                  )
                                  return {
                                    ...prev,
                                    [node.key]: clampInt(cur - 1, node.min, node.max),
                                  }
                                })
                              }
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="min-w-[2.5rem] text-center text-lg font-medium tabular-nums">
                              {clampInt(qtyByKey[node.key] ?? node.defaultCount, node.min, node.max)}
                            </span>
                            <button
                              type="button"
                              className="h-10 w-10 rounded-lg border border-accent/50 bg-accent/20 text-accent flex items-center justify-center hover:bg-accent/30 disabled:opacity-30"
                              aria-label="Increase"
                              disabled={
                                clampInt(qtyByKey[node.key] ?? node.defaultCount, node.min, node.max) >=
                                node.max
                              }
                              onClick={() =>
                                setQtyByKey((prev) => {
                                  const cur = clampInt(
                                    prev[node.key] ?? node.defaultCount,
                                    node.min,
                                    node.max
                                  )
                                  return {
                                    ...prev,
                                    [node.key]: clampInt(cur + 1, node.min, node.max),
                                  }
                                })
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {(() => {
                            const c = clampInt(
                              qtyByKey[node.key] ?? node.defaultCount,
                              node.min,
                              node.max
                            )
                            const est =
                              c > 0 ? estimateQuantityLineTotal(node.pricePerUnit, c) : null
                            return est != null ? (
                              <span className="text-sm font-medium text-accent tabular-nums">
                                × {c} · Est. {formatMoneySimple(est)}
                              </span>
                            ) : c > 0 ? (
                              <span className="text-xs text-amber-200/65">
                                Per-unit pricing will be reflected in your formal quote.
                              </span>
                            ) : null
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div
                        key={node.reactKey}
                        className="rounded-xl border border-white/10 bg-white/[0.02] px-2 py-2 md:px-3 md:py-4"
                      >
                        <div className="px-3 pt-3 pb-2 md:px-2">
                          <h3 className="text-lg font-medium text-white">{node.title}</h3>
                          {node.description ? (
                            <p className="text-sm text-white/55 mt-1 leading-snug">{node.description}</p>
                          ) : null}
                          <p className="text-[10px] text-white/35 mt-2">
                            {node.allowMultiple ? 'Pick any that apply.' : 'Pick one option.'}
                          </p>
                        </div>
                        <ul className="space-y-3 px-2 pb-2 mt-4">
                          {node.optionsCatalog.map((item) => (
                            <CatalogOption
                              key={item.id}
                              item={item}
                              selected={variablePickSelections[node.key]?.has(item.id) ?? false}
                              showAddonRollupHint
                              excludedLineIds={
                                variablePickLineExclusions[item.id] ?? emptyExcluded
                              }
                              onLineIncludeChange={(lineId, nowIncluded) => {
                                setVariablePickLineExclusions((er) => {
                                  const cur = new Set(er[item.id] ?? [])
                                  if (nowIncluded) cur.delete(lineId)
                                  else cur.add(lineId)
                                  return { ...er, [item.id]: cur }
                                })
                              }}
                              onToggle={() => {
                                let clearedItemId: string | null = null
                                setVariablePickSelections((prev) => {
                                  const base = prev[node.key] ?? new Set<string>()
                                  const had = base.has(item.id)
                                  const nextRow = togglePickIds(
                                    node.allowMultiple,
                                    base,
                                    item.id
                                  )
                                  if (had && !nextRow.has(item.id)) clearedItemId = item.id
                                  return { ...prev, [node.key]: nextRow }
                                })
                                if (clearedItemId) {
                                  setVariablePickLineExclusions((er) => {
                                    const next = { ...er }
                                    delete next[clearedItemId!]
                                    return next
                                  })
                                }
                              }}
                            />
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </motion.section>
            ) : null}

            {(selectedPhotoItems.length > 0 ||
              selectedVideoItems.length > 0 ||
              hasEnhancementOnAnyTier ||
              hasVariableSelections ||
              hasPkgOptionalAddsSelected) && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="bg-gradient-to-br from-accent/10 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-accent/25 p-6 md:p-8 shadow-2xl mb-10"
              >
                <h2 className="text-xl font-serif text-white mb-2">Approximate totals</h2>
                <p className="text-xs text-white/45 leading-relaxed mb-6">
                  Figures here are <span className="text-white/60">ballpark estimates</span> before
                  tax (GST not included). We take the first <span className="text-white/60">$</span>{' '}
                  amount in each package or line where shown. Unchecking optional lines may lower the
                  package estimate when those lines carry a credit. Enhancements you add from the
                  dropdown roll into the photography total, cinematography total, or the combined
                  total depending on how each item is set up. Optional quantity fields multiply the
                  first <span className="text-white/60">$</span> on the per-unit price when shown.
                  Your final proposal may differ—we&apos;ll confirm everything in writing.
                </p>
                <div
                  className={`grid gap-4 text-sm tabular-nums ${
                    showStandaloneTotalsTile
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : 'grid-cols-1 md:grid-cols-2'
                  }`}
                >
                  <div className="rounded-xl bg-black/40 border border-white/10 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/45 mb-1">
                      Photography ({selectedPhotoItems.length}
                      {photoExtrasMerged != null && photoExtrasMerged > 0
                        ? ` · +${formatMoneySimple(photoExtrasMerged)} extras`
                        : ''}
                      )
                    </p>
                    <p className="text-lg font-medium text-accent">
                      {photoMergedApprox != null
                        ? formatMoneySimple(photoMergedApprox)
                        : '—'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-black/40 border border-white/10 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/45 mb-1">
                      Cinematography ({selectedVideoItems.length}
                      {videoExtrasMerged != null && videoExtrasMerged > 0
                        ? ` · +${formatMoneySimple(videoExtrasMerged)} extras`
                        : ''}
                      )
                    </p>
                    <p className="text-lg font-medium text-accent">
                      {videoMergedApprox != null
                        ? formatMoneySimple(videoMergedApprox)
                        : '—'}
                    </p>
                  </div>
                  {showStandaloneTotalsTile ? (
                    <div className="rounded-xl bg-black/40 border border-white/10 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-wider text-white/45 mb-1">
                        Standalone ({standaloneSelectionTally} selections)
                      </p>
                      <p className="text-lg font-medium text-accent">
                        {standaloneEstimated != null
                          ? formatMoneySimple(standaloneEstimated)
                          : '—'}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-wider text-white/45">
                    Combined estimate (pre-tax)
                  </span>
                  <span className="text-2xl font-serif text-white tabular-nums">
                    {combinedApproxSubtotal != null
                      ? formatMoneySimple(combinedApproxSubtotal)
                      : '—'}
                  </span>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl"
            >
              <h2 className="text-xl font-serif text-white mb-6">Review & notes</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/45 mb-3">
                    In your photo package ({selectedPhotoItems.length})
                  </p>
                  <AnimatePresence mode="popLayout">
                    {selectedPhotoItems.length === 0 ? (
                      <p className="text-sm text-white/35 italic">Nothing added yet.</p>
                    ) : (
                      <ul className="space-y-3">
                        {selectedPhotoItems.map((item) => (
                          <motion.li
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-sm flex flex-col gap-2"
                          >
                            <span className="flex gap-2">
                              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <span className="text-white/85">
                                <span className="font-medium text-white">{item.title}</span>
                                {item.price?.trim() ? (
                                  <span className="text-white/50 font-normal"> · {item.price}</span>
                                ) : null}
                                {(() => {
                                  const { subtotal } = computePackageEstimate(
                                    item,
                                    photoLineExclusions[item.id] ?? emptyExcluded
                                  )
                                  return subtotal != null ? (
                                    <span className="text-accent/90 font-normal">
                                      {' '}
                                      · Est. {formatMoneySimple(subtotal)}
                                    </span>
                                  ) : null
                                })()}
                              </span>
                            </span>
                            {(item.optionalAddOns ?? [])
                              .filter((a) => photoPackageOptionalAdds[item.id]?.has(a.id))
                              .map((a) => {
                                const addEst = extractFirstDollarAmount(a.price ?? '')
                                return (
                                  <span
                                    key={a.id}
                                    className="pl-11 text-[13px] border-l border-emerald-500/30 text-emerald-100/90"
                                  >
                                    <span className="text-emerald-300/80 text-[10px] uppercase tracking-wider">
                                      Add-on ·{' '}
                                    </span>
                                    <span className="font-medium text-white">{a.title}</span>
                                    {a.price?.trim() ? (
                                      <span className="text-white/45 font-normal">
                                        {' '}
                                        · {a.price}
                                      </span>
                                    ) : null}
                                    {typeof addEst === 'number' ? (
                                      <span className="text-accent tabular-nums font-normal">
                                        {' '}
                                        · +{formatMoneySimple(addEst)} est.
                                      </span>
                                    ) : null}
                                  </span>
                                )
                              })}
                            {[...(photoEnhanceByTier[item.id] ?? [])].map((addonId) => {
                              const add = addonCatalog.find((x) => x.id === addonId)
                              if (!add) return null
                              const { subtotal } = computePackageEstimate(
                                add,
                                photoEnhanceLineExcl[item.id]?.[addonId] ?? emptyExcluded
                              )
                              return (
                                <span
                                  key={`${item.id}_enh_${addonId}`}
                                  className="pl-11 text-[13px] border-l border-violet-400/40 text-violet-100/92"
                                >
                                  <span className="text-violet-300/85 text-[10px] uppercase tracking-wider">
                                    Enhancement ·{' '}
                                  </span>
                                  <span className="font-medium text-white">{add.title}</span>
                                  {add.price?.trim() ? (
                                    <span className="text-white/45 font-normal">
                                      {' '}
                                      · {add.price}
                                    </span>
                                  ) : null}
                                  {subtotal != null ? (
                                    <span className="text-accent tabular-nums font-normal">
                                      {' '}
                                      · Est. {formatMoneySimple(subtotal)}
                                    </span>
                                  ) : null}
                                  {add.addonTotalsToward ? (
                                    <span className="block text-[10px] text-white/38 mt-0.5">
                                      {ADDON_ROLLUP_HINT[add.addonTotalsToward]}
                                    </span>
                                  ) : null}
                                </span>
                              )
                            })}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/45 mb-3">
                    In your video package ({selectedVideoItems.length})
                  </p>
                  <AnimatePresence mode="popLayout">
                    {selectedVideoItems.length === 0 ? (
                      <p className="text-sm text-white/35 italic">Nothing added yet.</p>
                    ) : (
                      <ul className="space-y-3">
                        {selectedVideoItems.map((item) => (
                          <motion.li
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-sm flex flex-col gap-2"
                          >
                            <span className="flex gap-2">
                              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <span className="text-white/85">
                                <span className="font-medium text-white">{item.title}</span>
                                {item.price?.trim() ? (
                                  <span className="text-white/50 font-normal"> · {item.price}</span>
                                ) : null}
                                {(() => {
                                  const { subtotal } = computePackageEstimate(
                                    item,
                                    videoLineExclusions[item.id] ?? emptyExcluded
                                  )
                                  return subtotal != null ? (
                                    <span className="text-accent/90 font-normal">
                                      {' '}
                                      · Est. {formatMoneySimple(subtotal)}
                                    </span>
                                  ) : null
                                })()}
                              </span>
                            </span>
                            {(item.optionalAddOns ?? [])
                              .filter((a) => videoPackageOptionalAdds[item.id]?.has(a.id))
                              .map((a) => {
                                const addEst = extractFirstDollarAmount(a.price ?? '')
                                return (
                                  <span
                                    key={a.id}
                                    className="pl-11 text-[13px] border-l border-emerald-500/30 text-emerald-100/90"
                                  >
                                    <span className="text-emerald-300/80 text-[10px] uppercase tracking-wider">
                                      Add-on ·{' '}
                                    </span>
                                    <span className="font-medium text-white">{a.title}</span>
                                    {a.price?.trim() ? (
                                      <span className="text-white/45 font-normal">
                                        {' '}
                                        · {a.price}
                                      </span>
                                    ) : null}
                                    {typeof addEst === 'number' ? (
                                      <span className="text-accent tabular-nums font-normal">
                                        {' '}
                                        · +{formatMoneySimple(addEst)} est.
                                      </span>
                                    ) : null}
                                  </span>
                                )
                              })}
                            {[...(videoEnhanceByTier[item.id] ?? [])].map((addonId) => {
                              const add = addonCatalog.find((x) => x.id === addonId)
                              if (!add) return null
                              const { subtotal } = computePackageEstimate(
                                add,
                                videoEnhanceLineExcl[item.id]?.[addonId] ?? emptyExcluded
                              )
                              return (
                                <span
                                  key={`${item.id}_enh_${addonId}`}
                                  className="pl-11 text-[13px] border-l border-violet-400/40 text-violet-100/92"
                                >
                                  <span className="text-violet-300/85 text-[10px] uppercase tracking-wider">
                                    Enhancement ·{' '}
                                  </span>
                                  <span className="font-medium text-white">{add.title}</span>
                                  {add.price?.trim() ? (
                                    <span className="text-white/45 font-normal">
                                      {' '}
                                      · {add.price}
                                    </span>
                                  ) : null}
                                  {subtotal != null ? (
                                    <span className="text-accent tabular-nums font-normal">
                                      {' '}
                                      · Est. {formatMoneySimple(subtotal)}
                                    </span>
                                  ) : null}
                                  {add.addonTotalsToward ? (
                                    <span className="block text-[10px] text-white/38 mt-0.5">
                                      {ADDON_ROLLUP_HINT[add.addonTotalsToward]}
                                    </span>
                                  ) : null}
                                </span>
                              )
                            })}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {builderVariables.length > 0 ? (
                <div className="mt-10 pt-8 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wider text-white/45 mb-4">
                    Your variables ({activeVariableLineCount} active lines)
                  </p>
                  <ul className="space-y-3 text-sm text-white/80">
                    {builderVariables.flatMap((v) => {
                      if (v.kind === 'quantity') {
                        const c = clampInt(qtyByKey[v.key] ?? v.defaultCount, v.min, v.max)
                        if (c <= 0) return []
                        const est = estimateQuantityLineTotal(v.pricePerUnit, c)
                        return [
                          <li key={v.reactKey} className="flex gap-2">
                            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span>
                              <span className="font-medium text-white">{v.title}</span>
                              <span className="text-white/50"> · ×{c}</span>{' '}
                              {typeof est === 'number' ? (
                                <span className="text-accent/90 tabular-nums">
                                  Est. {formatMoneySimple(est)}
                                </span>
                              ) : null}
                              <span className="block text-[10px] text-white/40 mt-0.5">
                                {ADDON_ROLLUP_HINT[v.totalsToward]}
                              </span>
                            </span>
                          </li>,
                        ]
                      }
                      const sel = variablePickSelections[v.key] ?? new Set<string>()
                      if (sel.size === 0) return []
                      return [
                        ...v.optionsCatalog.filter((item) => sel.has(item.id)).map((item) => (
                          <li key={`${v.reactKey}_${item.id}`} className="flex gap-2">
                            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span>
                              <span className="text-white/50 text-[10px] uppercase tracking-wide">
                                {v.title}
                                {' · '}
                              </span>
                              <span className="font-medium text-white">{item.title}</span>
                              {item.price?.trim() ? (
                                <span className="text-white/50"> · {item.price}</span>
                              ) : null}
                              {(() => {
                                const { subtotal } = computePackageEstimate(
                                  item,
                                  variablePickLineExclusions[item.id] ?? emptyExcluded
                                )
                                return subtotal != null ? (
                                  <span className="text-accent/90 tabular-nums">
                                    {' '}
                                    · Est. {formatMoneySimple(subtotal)}
                                  </span>
                                ) : null
                              })()}
                            </span>
                          </li>
                        )),
                      ]
                    })}
                  </ul>
                  {activeVariableLineCount === 0 ? (
                    <p className="text-sm text-white/35 italic">No variables adjusted yet.</p>
                  ) : null}
                </div>
              ) : null}

              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Anything else we should know?
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent resize-none"
                  placeholder="Timeline, vibe, references…"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-10 pt-8 border-t border-white/10">
                <p className="text-sm text-white/45">
                  {!canSubmit && (
                    <span>
                      Add your details, pick an event type, and choose at least one photography or
                      cinematography package—or optional tier upgrades, enhancements from the
                      dropdown, or extras in the sections above.
                    </span>
                  )}
                  {canSubmit && (
                    <span>
                      Ready to send—your selections go to our team the same way as our contact form.
                    </span>
                  )}
                </p>
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all shrink-0 ${
                    canSubmit && !isSubmitting
                      ? 'bg-accent hover:bg-accent/90 text-white'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" aria-hidden>
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Submit package
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </form>

          <p className="text-center mt-10 text-white/40 text-sm">
            We typically respond within 24–48 hours
          </p>
        </div>
      </div>
    </main>
  )
}
