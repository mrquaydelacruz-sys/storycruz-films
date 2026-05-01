/** Parsed line-item under a package card (allows optional price credit when deselected). */

export type PackageIncludedLine = {
  id: string
  /** Label shown to clients (trailing "(credit $X)" stripped when parsed from plain strings). */
  label: string
  /** Deduction from list price when client turns this line off (Sanity field or parsed `($…)`). */
  removeCreditUsd: number
  /** When false, line stays in the package in the builder (no uncheck). Default true. */
  removable?: boolean
}

/** One selectable row in the package builder (photo or video column). */

export type AddonTotalsToward =
  /** Roll this add-on dollar amount into photography column totals. */
  | 'photography'
  /** Roll into cinematography column totals. */
  | 'cinematography'
  /** Shows only under combined totals (not bundled into photo or video columns). */
  | 'standalone'

/** Priced upgrades a couple may add onto a specific package row (Investment Guide / brief listings). */

export type PackageOptionalAddOn = {
  id: string
  title: string
  description: string
  price?: string
  /** Where this add-on’s dollar amount rolls into the builder totals card. */
  addonTotalsToward?: AddonTotalsToward | null
}

export type PackageCatalogItem = {
  id: string
  title: string
  description: string
  price?: string
  /** Raw Sanity strings (backward compatible). */
  included?: string[]
  /** Derived from `included` for customize UI — set in `resolvePackageBuilderPage`. */
  includedLines?: PackageIncludedLine[]
  /**
   * For rows in **`addonOfferings`**: which estimate column gets this optional line item sum.
   * Ignored when the row is merged into photography / cinematography catalogs.
   */
  addonTotalsToward?: AddonTotalsToward | null
  /**
   * Optional extras shown under this selection (Hidden Pricing packages or brief extras).
   * Clients check these to include them—not the same flow as removable “what’s included” lines.
   */
  optionalAddOns?: PackageOptionalAddOn[]
}
