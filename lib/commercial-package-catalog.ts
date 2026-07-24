/**
 * Corporate / commercial rate card for the package builder.
 * Adjust these numbers to match your market — UI reads from here only.
 */

export type CommercialFilmingId = 'half-day' | 'full-day'
export type CommercialEditId = 'raw' | 'basic-edit'
export type CommercialProjectType =
  | 'meeting'
  | 'conference'
  | 'interview'
  | 'brand'
  | 'custom'

export type CommercialCatalogOption = {
  id: string
  title: string
  subtitle?: string
  description: string
  /** Base pre-tax price in CAD. Null = included / no charge. */
  priceCad: number | null
  priceLabel: string
  included: string[]
}

/** Filming & gear — pick one. */
export const COMMERCIAL_FILMING: CommercialCatalogOption[] = [
  {
    id: 'half-day',
    title: 'Half-Day',
    subtitle: 'Up to 4 hours',
    description:
      'Ideal for board meetings, panels, and short corporate captures with a compact crew.',
    priceCad: 800,
    priceLabel: '$800 + GST',
    included: [
      '2 camera operators / 2-camera setup',
      '2 camera angles',
      'Professional lapel + room audio for up to 4 speakers',
      'Basic lighting for seated interview / meeting setups',
    ],
  },
  {
    id: 'full-day',
    title: 'Full-Day',
    subtitle: 'Up to 8 hours',
    description:
      'Best when the agenda runs long, you need multiple segments, or want buffer for setup and resets.',
    priceCad: 1600,
    priceLabel: '$1,600 + GST',
    included: [
      '2 camera operators / 2-camera setup',
      '2 camera angles',
      'Professional lapel + room audio for up to 4 speakers',
      'Basic lighting for seated interview / meeting setups',
      'Full production day coverage',
    ],
  },
]

/**
 * Editing prices scale slightly with shoot length (matches typical commercial baselines).
 * Raw delivery stays included either way.
 */
export function commercialBasicEditPrice(filmingId: CommercialFilmingId | null): number {
  if (filmingId === 'full-day') return 650
  return 400
}

export function commercialBasicEditLabel(filmingId: CommercialFilmingId | null): string {
  if (filmingId === 'full-day') return '$650 + GST'
  if (filmingId === 'half-day') return '$400 + GST'
  return '$400 – $650 + GST'
}

export function getCommercialEditOptions(
  filmingId: CommercialFilmingId | null
): CommercialCatalogOption[] {
  const basicPrice = filmingId ? commercialBasicEditPrice(filmingId) : null
  return [
    {
      id: 'raw',
      title: 'Raw / Unedited Delivery',
      subtitle: 'Included with filming',
      description:
        'Organized camera files delivered as-shot. Light audio cleanup is available as an add-on if needed later.',
      priceCad: 0,
      priceLabel: 'Included',
      included: [
        'Synced multi-cam file handoff',
        'Organized folders by camera / take',
        'No color grade or picture edit',
      ],
    },
    {
      id: 'basic-edit',
      title: 'Basic Multi-Cam Edit',
      subtitle: 'Most clients choose this',
      description:
        'Clean, presentation-ready cut: camera switching, trims, audio leveling, and light color correction.',
      priceCad: basicPrice,
      priceLabel: commercialBasicEditLabel(filmingId),
      included: [
        'Multi-cam angle switching',
        'Trimming & basic cuts',
        'Audio leveling / cleanup',
        'Light color correction',
      ],
    },
  ]
}

export const COMMERCIAL_PROJECT_TYPES: {
  value: CommercialProjectType
  label: string
}[] = [
  { value: 'meeting', label: 'Meeting / panel' },
  { value: 'conference', label: 'Conference' },
  { value: 'interview', label: 'Interview' },
  { value: 'brand', label: 'Brand / promo' },
  { value: 'custom', label: 'Custom' },
]

/** One-tap presets that fill both columns. */
export type CommercialPreset = {
  id: string
  title: string
  badge?: string
  filmingId: CommercialFilmingId
  editId: CommercialEditId
  blurb: string
}

export const COMMERCIAL_PRESETS: CommercialPreset[] = [
  {
    id: 'half-day-basic',
    title: 'Half-Day Package',
    badge: 'Popular for meetings',
    filmingId: 'half-day',
    editId: 'basic-edit',
    blurb: 'Half-day crew + basic multi-cam edit — typical for 4-person seated captures.',
  },
  {
    id: 'full-day-basic',
    title: 'Full-Day Package',
    filmingId: 'full-day',
    editId: 'basic-edit',
    blurb: 'Full production day with a finished multi-cam edit delivered.',
  },
]

export function estimateCommercialTotal(
  filmingId: CommercialFilmingId | null,
  editId: CommercialEditId | null
): number | null {
  if (!filmingId) return null
  const filming = COMMERCIAL_FILMING.find((f) => f.id === filmingId)
  if (!filming || filming.priceCad == null) return null

  let total = filming.priceCad
  if (editId === 'basic-edit') {
    total += commercialBasicEditPrice(filmingId)
  }
  return total
}

export function formatCad(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-CA')}`
}
