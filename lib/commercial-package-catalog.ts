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
  /** Optional secondary line under the price (e.g. which shoot length applies). */
  priceNote?: string
}

export function formatCad(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-CA')}`
}

/** Included in every filming package before add-ons. */
export const COMMERCIAL_INCLUDED_CAMERAS = 2

/** Max total cameras a client can select in the builder (included + extras). */
export const COMMERCIAL_MAX_CAMERAS = 4

/**
 * Extra camera + operator / angle, priced by shoot length.
 * Half-day: $300 · Full-day: $500 (pre-tax) per additional camera.
 */
export function commercialExtraCameraUnitPrice(
  filmingId: CommercialFilmingId | null
): number {
  if (filmingId === 'full-day') return 500
  return 300
}

export function commercialExtraCameraUnitLabel(
  filmingId: CommercialFilmingId | null
): string {
  if (filmingId === 'full-day') return '$500 + GST each'
  if (filmingId === 'half-day') return '$300 + GST each'
  return '$300 – $500 + GST each'
}

export function clampExtraCameras(count: number): number {
  const maxExtra = COMMERCIAL_MAX_CAMERAS - COMMERCIAL_INCLUDED_CAMERAS
  if (!Number.isFinite(count) || count < 0) return 0
  return Math.min(maxExtra, Math.floor(count))
}

/** Optional gear included by default — clients can remove for a credit if they bring their own. */
export type CommercialGearId = 'cameras' | 'audio' | 'lighting'

export type CommercialGearOption = {
  id: CommercialGearId
  title: string
  description: string
  /** Shown when the item is included. */
  includedLabel: string
  /** Shown when the client opts out (bringing their own). */
  removedLabel: string
  /** Disclaimer shown when client opts out. */
  removedDisclaimer: string
  /** Pre-tax credit when removed, by shoot length. */
  creditHalfDay: number
  creditFullDay: number
}

export const COMMERCIAL_GEAR_OPTIONS: CommercialGearOption[] = [
  {
    id: 'cameras',
    title: 'Production cameras',
    description:
      'Our 2-camera bodies / kit are included by default. Uncheck if you supply matching cameras — our operators still run them.',
    includedLabel: '2 production camera bodies / kit included',
    removedLabel: 'Client provides cameras',
    removedDisclaimer:
      'Note: Client-supplied cameras must include matching power, media cards, and compatible settings. Additional post-production grading may apply if color profiles differ significantly.',
    creditHalfDay: 100,
    creditFullDay: 150,
  },
  {
    id: 'audio',
    title: 'Production audio',
    description:
      'Lapel mics + room audio for up to 4 speakers. Uncheck if you already have a house or AV audio feed.',
    includedLabel: 'Professional lapel + room audio for up to 4 speakers',
    removedLabel: 'Client provides audio / house feed',
    removedDisclaimer:
      "Note: If using client-supplied audio, final audio quality relies on the venue / in-house technician's feed.",
    creditHalfDay: 100,
    creditFullDay: 150,
  },
  {
    id: 'lighting',
    title: 'Basic lighting',
    description:
      'Simple key / fill for seated interviews and meetings. Uncheck if the room is already lit or you supply lights.',
    includedLabel: 'Basic lighting for seated interview / meeting setups',
    removedLabel: 'Client provides lighting',
    removedDisclaimer:
      'Note: If using client-supplied lighting, look and consistency rely on whoever is controlling those lights on site.',
    creditHalfDay: 75,
    creditFullDay: 100,
  },
]

export function commercialGearCredit(
  gearId: CommercialGearId,
  filmingId: CommercialFilmingId | null
): number {
  const gear = COMMERCIAL_GEAR_OPTIONS.find((g) => g.id === gearId)
  if (!gear || !filmingId) return 0
  return filmingId === 'full-day' ? gear.creditFullDay : gear.creditHalfDay
}

export function commercialGearCreditLabel(
  gearId: CommercialGearId,
  filmingId: CommercialFilmingId | null
): string {
  if (!filmingId) {
    const gear = COMMERCIAL_GEAR_OPTIONS.find((g) => g.id === gearId)
    if (!gear) return ''
    return `−$${gear.creditHalfDay} – $${gear.creditFullDay} if removed`
  }
  const credit = commercialGearCredit(gearId, filmingId)
  return `−${formatCad(credit)} credit if removed`
}

/** Filming & gear — pick one. */
export const COMMERCIAL_FILMING: CommercialCatalogOption[] = [
  {
    id: 'half-day',
    title: 'Half-Day',
    subtitle: 'Up to 4 hours',
    description:
      'Ideal for board meetings, panels, and short corporate captures with a compact crew. Cameras, audio, and lighting included by default — customize below if you bring your own.',
    priceCad: 800,
    priceLabel: '$800 + GST',
    included: [
      '2 camera operators / angles (crew labor included)',
      'Cameras, audio + lighting included (customizable below)',
    ],
  },
  {
    id: 'full-day',
    title: 'Full-Day',
    subtitle: 'Up to 8 hours',
    description:
      'Best when the agenda runs long, you need multiple segments, or want buffer for setup and resets. Cameras, audio, and lighting included by default — customize below if you bring your own.',
    priceCad: 1600,
    priceLabel: '$1,600 + GST',
    included: [
      '2 camera operators / angles (crew labor included)',
      'Cameras, audio + lighting included (customizable below)',
      'Full production day coverage',
    ],
  },
]

/**
 * Editing prices scale with shoot length (matches typical commercial baselines).
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
  const durationWord =
    filmingId === 'full-day' ? 'full-day' : filmingId === 'half-day' ? 'half-day' : null

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
        'Clean, presentation-ready cut: camera switching, trims, audio leveling, and light color correction. Covers all cameras in your filming selection.',
      priceCad: basicPrice,
      priceLabel: commercialBasicEditLabel(filmingId),
      priceNote: durationWord
        ? `Applies to your ${durationWord} shoot · Half-day $400 · Full-day $650`
        : 'Select half-day or full-day filming to lock this rate · Half-day $400 · Full-day $650',
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

export type CommercialEstimateInput = {
  filmingId: CommercialFilmingId | null
  editId: CommercialEditId | null
  /** Cameras / operator angles beyond the included 2. */
  extraCameras?: number
  /** Gear kept from the package (default: all included). */
  includeCameras?: boolean
  includeAudio?: boolean
  includeLighting?: boolean
}

export function estimateCommercialTotal(
  filmingIdOrInput: CommercialFilmingId | null | CommercialEstimateInput,
  editId?: CommercialEditId | null,
  extraCameras = 0
): number | null {
  const input: CommercialEstimateInput =
    filmingIdOrInput != null && typeof filmingIdOrInput === 'object'
      ? filmingIdOrInput
      : {
          filmingId: filmingIdOrInput as CommercialFilmingId | null,
          editId: editId ?? null,
          extraCameras,
        }

  const { filmingId } = input
  if (!filmingId) return null
  const filming = COMMERCIAL_FILMING.find((f) => f.id === filmingId)
  if (!filming || filming.priceCad == null) return null

  const extras = clampExtraCameras(input.extraCameras ?? 0)
  const includeCameras = input.includeCameras !== false
  const includeAudio = input.includeAudio !== false
  const includeLighting = input.includeLighting !== false

  let total = filming.priceCad
  if (extras > 0) {
    total += extras * commercialExtraCameraUnitPrice(filmingId)
  }
  if (!includeCameras) {
    total -= commercialGearCredit('cameras', filmingId)
  }
  if (!includeAudio) {
    total -= commercialGearCredit('audio', filmingId)
  }
  if (!includeLighting) {
    total -= commercialGearCredit('lighting', filmingId)
  }
  if (input.editId === 'basic-edit') {
    // Edit rate stays the same even with client cameras — matching mixed profiles often takes more time.
    total += commercialBasicEditPrice(filmingId)
  }
  return Math.max(0, total)
}
