/**
 * Canonical Investment Guide content (2026).
 * Display cards and the interactive package builder both read from here
 * so list prices and estimate totals cannot drift apart.
 */

import type { PackageBuilderResolvedProps } from '@/lib/package-builder-content'
import type { PackageCatalogItem, PackageIncludedLine } from '@/lib/package-catalog-types'
import {
  enrichCatalogItems,
  ensureCoverageHourDeductionOnPackages,
} from '@/lib/package-catalog-math'

const CDN =
  'https://cdn.sanity.io/images/a2hh2h81/production'

export const INVESTMENT_GUIDE_IMAGES = {
  hero: `${CDN}/846e3003f5cf95dc516ae9f97bd09e2fb0bdbf14-6048x4032.jpg`,
  story: `${CDN}/6153a22653c623a815284a833c94bfce28f49475-4032x6048.jpg`,
  vowHour: `${CDN}/56fee0335771bfd95d69d328cb452f58eafe7bfa-5152x7728.jpg`,
  microWedding: `${CDN}/5ea4e3873698ecbfde92b6bbfbefb66b0865d24b-3327x4987.jpg`,
  elopementCollective: `${CDN}/846e3003f5cf95dc516ae9f97bd09e2fb0bdbf14-6048x4032.jpg`,
  theStory: `${CDN}/1acbdfad8ddc9a4bb916bac6a6c23cec625db9ce-5152x7728.jpg`,
  theLegacy: `${CDN}/ba0ff00089fa7b822c57eeae4f9543cedc0b256d-1366x2048.jpg`,
  theMasterpiece: `${CDN}/3d4636e6f8a5c3702d1c701b210006bb820b0ac9-4893x7339.jpg`,
  cta: `${CDN}/da93a8d90e8fa9df53db09838c3a482c6ccac859-6048x4032.jpg`,
} as const

const RATE_TEAM = '$250/hr + GST'
const RATE_SINGLE = '$150/hr + GST'
const ENGAGEMENT_CREDIT = 150

function lines(
  packageId: string,
  rows: Array<{ label: string; removable?: boolean; removeCreditUsd?: number }>
): PackageIncludedLine[] {
  return rows.map((row, i) => ({
    id: `${packageId}__ln__${i}`,
    label: row.label,
    removable: row.removable === true,
    removeCreditUsd: row.removeCreditUsd ?? 0,
  }))
}

function packageItem(
  partial: Omit<PackageCatalogItem, 'included' | 'includedLines'> & {
    includedRows: Array<{ label: string; removable?: boolean; removeCreditUsd?: number }>
  }
): PackageCatalogItem {
  const { includedRows, ...rest } = partial
  const includedLines = lines(rest.id, includedRows)
  return {
    ...rest,
    included: includedLines.map((l) => l.label),
    includedLines,
  }
}

/** Photography-only wedding collections (§5). */
export const PHOTO_CATALOG: PackageCatalogItem[] = [
  packageItem({
    id: 'invest-p-collection-i',
    title: 'Collection I',
    description: 'Getting ready through your first dance.',
    price: '$2,200 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_SINGLE,
    includedRows: [
      { label: '6 hours of photography coverage' },
      { label: 'Lead photographer' },
      { label: 'Curated gallery of every successful image' },
      { label: 'Private online gallery & personal printing rights' },
    ],
  }),
  packageItem({
    id: 'invest-p-collection-ii',
    title: 'Collection II',
    description: 'Full-day photography with a complimentary engagement session.',
    price: '$2,800 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_SINGLE,
    includedRows: [
      { label: '8 hours of photography coverage' },
      { label: 'Lead photographer' },
      { label: 'Curated gallery of every successful image' },
      { label: 'Private online gallery & personal printing rights' },
      {
        label: 'Complimentary 30-minute engagement session',
        removable: true,
        removeCreditUsd: ENGAGEMENT_CREDIT,
      },
    ],
  }),
  packageItem({
    id: 'invest-p-collection-iii',
    title: 'Collection III',
    description: 'Extended coverage with a second photographer and engagement session.',
    price: '$3,400 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_SINGLE,
    includedRows: [
      { label: '10 hours of photography coverage' },
      { label: 'Lead photographer' },
      { label: 'Second photographer for 3 hours' },
      { label: 'Curated gallery of every successful image' },
      { label: 'Private online gallery & personal printing rights' },
      { label: 'Complimentary 1-hour engagement session' },
    ],
  }),
]

/** Elopement & intimate single-medium rows (shown under photography appendix). */
export const INTIMATE_PHOTO_CATALOG: PackageCatalogItem[] = [
  packageItem({
    id: 'invest-intimate-vow-hour-single',
    title: 'The Vow Hour — Photo or Film Only',
    description:
      'Elopement & Intimate (40 guests or fewer). 1 creator: either 50+ images & online gallery, or Vow Edit film + 1-minute social teaser.',
    price: '$850 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_SINGLE,
    includedRows: [
      { label: '1 hour of coverage' },
      { label: '1 creator' },
      { label: '50+ high-resolution images & online gallery — or — Vow Edit film + 1-minute social teaser' },
    ],
  }),
  packageItem({
    id: 'invest-intimate-micro-photo',
    title: 'The Micro-Wedding — Photo Only',
    description:
      'Elopement & Intimate (40 guests or fewer). 3 hrs, 1 lead photographer, 200+ images + private gallery.',
    price: '$1,650 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_SINGLE,
    includedRows: [
      { label: '3 hours of coverage' },
      { label: '1 lead photographer' },
      { label: '200+ high-resolution edited images & private gallery' },
      { label: 'Under 40 guests' },
    ],
  }),
]

/** Cinematography-only wedding collections (§5). */
export const VIDEO_CATALOG: PackageCatalogItem[] = [
  packageItem({
    id: 'invest-v-signature-film',
    title: 'The Signature Film',
    description: '3–4 min highlight film · full ceremony edit.',
    price: '$2,800 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_SINGLE,
    includedRows: [
      { label: '8 hours of cinematography coverage' },
      { label: 'Two cinematographers' },
      { label: '3–4 minute cinematic highlight film' },
      { label: 'Full ceremony edit' },
      { label: 'Digital delivery · music licensed and selected for you' },
    ],
  }),
  packageItem({
    id: 'invest-v-legacy-film',
    title: 'The Legacy Film',
    description: '5–8 min film · ceremony & speeches · 60-sec teaser.',
    price: '$3,500 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_SINGLE,
    includedRows: [
      { label: '10 hours of cinematography coverage' },
      { label: 'Two cinematographers' },
      { label: '5–8 minute cinematic film' },
      { label: 'Ceremony & speeches edits' },
      { label: '60-second social media teaser' },
      { label: 'Digital delivery · music licensed and selected for you' },
    ],
  }),
  packageItem({
    id: 'invest-v-masterpiece-film',
    title: 'The Masterpiece Film',
    description:
      '8–10 min feature · ceremony, speeches, first dances · teaser · drone.',
    price: '$4,200 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_SINGLE,
    includedRows: [
      { label: '10 hours of cinematography coverage' },
      { label: 'Two cinematographers' },
      { label: '8–10 minute extended feature film' },
      { label: 'Ceremony, speeches & first dances edits' },
      { label: '60-second social media teaser' },
      { label: 'Drone cinematography (location & weather permitting)' },
      { label: 'Digital delivery · music licensed and selected for you' },
    ],
  }),
]

export const INTIMATE_VIDEO_CATALOG: PackageCatalogItem[] = [
  packageItem({
    id: 'invest-intimate-micro-film',
    title: 'The Micro-Wedding — Film Only',
    description:
      'Elopement & Intimate (40 guests or fewer). 3 hrs, 1 lead cinematographer, 3–4 min highlight film.',
    price: '$1,850 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_SINGLE,
    includedRows: [
      { label: '3 hours of coverage' },
      { label: '1 lead cinematographer' },
      { label: '3–4 minute cinematic highlight film' },
      { label: 'Under 40 guests' },
    ],
  }),
]

/** Photo + film wedding collections (§4) + intimate combos (§3). */
export const PHOTO_FILM_BUNDLE_OFFERS: PackageCatalogItem[] = [
  packageItem({
    id: 'invest-pf-the-story',
    title: 'The Story',
    description: 'Getting ready through your first dance. Collection IV · 8 hours · Quay & Christine.',
    price: '$4,400 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_TEAM,
    includedRows: [
      { label: '8 hours of photo & film coverage' },
      { label: '2-person specialist team' },
      { label: '4–5 minute cinematic highlight film' },
      { label: 'Full ceremony edit' },
      { label: 'Curated gallery of every successful image' },
      { label: 'Private online gallery & personal printing rights' },
      {
        label: 'Complimentary 30-minute engagement session',
        removable: true,
        removeCreditUsd: ENGAGEMENT_CREDIT,
      },
    ],
  }),
  packageItem({
    id: 'invest-pf-the-legacy',
    title: 'The Legacy ★ Most Booked',
    description: 'Our recommended sweet spot. Collection V · 10 hours · team of three.',
    price: '$5,900 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_TEAM,
    includedRows: [
      { label: '10 hours of photo & film coverage' },
      { label: 'Quay & Christine + associate for 4 hours' },
      { label: '5–6 minute cinematic highlight film' },
      { label: 'Full ceremony edit' },
      { label: 'Full speeches edit' },
      { label: 'Curated gallery of every successful image' },
      {
        label: 'Complimentary 30-minute engagement session',
        removable: true,
        removeCreditUsd: ENGAGEMENT_CREDIT,
      },
      { label: '60-second social media teaser' },
    ],
  }),
  packageItem({
    id: 'invest-pf-the-masterpiece',
    title: 'The Masterpiece',
    description: 'The ultimate archival collection. Collection VI · 12 hours · full archival team.',
    price: '$7,400 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_TEAM,
    includedRows: [
      { label: '12 hours of photo & film coverage' },
      { label: 'Quay & Christine + associate for 6 hours' },
      { label: '8–10 minute extended feature film' },
      { label: 'Full ceremony, speeches & first dance edits' },
      { label: '60-second social media teaser' },
      { label: 'Drone cinematography (location & weather permitting)' },
      { label: 'Complimentary 1-hour engagement session' },
      { label: 'Surprise photobook' },
    ],
  }),
  packageItem({
    id: 'invest-intimate-vow-hour-combo',
    title: 'The Vow Hour — Photo + Film',
    description:
      'Elopement & Intimate (40 guests or fewer). For courthouse signings or a quick mountain vow exchange.',
    price: '$1,550 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_TEAM,
    includedRows: [
      { label: '1 hour of coverage' },
      { label: 'Quay & Christine, together' },
      { label: '50+ high-resolution images & online gallery' },
      { label: '"Vow Edit" documentary film' },
      { label: '1-minute social teaser' },
    ],
  }),
  packageItem({
    id: 'invest-intimate-micro-combo',
    title: 'The Micro-Wedding — Photo + Film',
    description:
      'Elopement & Intimate (40 guests or fewer). For intimate celebrations that need more time, with a little dinner and a few toasts.',
    price: '$2,650 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_TEAM,
    includedRows: [
      { label: '3 hours of coverage' },
      { label: 'Lead photographer & lead cinematographer' },
      { label: '200+ high-resolution edited images & private gallery' },
      { label: '3–4 minute cinematic highlight film' },
      { label: 'Under 40 guests' },
    ],
  }),
  packageItem({
    id: 'invest-intimate-elopement-collective',
    title: 'The Elopement Collective ★ Most Booked',
    description:
      'Elopement & Intimate (40 guests or fewer). The uncompromised elopement experience.',
    price: '$2,950 + GST',
    coverageHourDeductionEnabled: true,
    coverageHourDeductionRatePerHour: RATE_TEAM,
    includedRows: [
      { label: '4 hours of coverage' },
      { label: 'Quay on cinema, Christine on photo' },
      { label: '200+ high-resolution images' },
      { label: '3–4 minute storytelling film' },
      { label: 'Documentary edit of your vows' },
      { label: '60-second social teaser' },
    ],
  }),
]

/** Unified à la carte menu (§7) — builder totals must match displayed prices. */
export const ADDON_CATALOG: PackageCatalogItem[] = [
  {
    id: 'addon__hour-single',
    title: 'Additional hour · single creator',
    description: 'Extend coverage by one hour with a single creator.',
    price: '$150 + GST',
    addonTotalsToward: 'standalone',
  },
  {
    id: 'addon__hour-team',
    title: 'Additional hour · photo + film team',
    description: 'One rate for the two-person team.',
    price: '$250 + GST',
    addonTotalsToward: 'standalone',
  },
  {
    id: 'addon__second-photographer',
    title: 'Second photographer',
    description: 'Additional photographer coverage for your day.',
    price: '$500 + GST',
    addonTotalsToward: 'photography',
  },
  {
    id: 'addon__split-day',
    title: 'Split day fee',
    description: 'Coverage across two separate parts of the day.',
    price: '$250 + GST',
    addonTotalsToward: 'standalone',
  },
  {
    id: 'addon__park-fee',
    title: 'National / Provincial Park location fee (from $100)',
    description: 'Depending on location — estimate uses from $100.',
    price: '$100 + GST',
    addonTotalsToward: 'standalone',
  },
  {
    id: 'addon__same-day-edit',
    title: 'Same-day edit film',
    description: 'Timeline sensitive, so please coordinate with us.',
    price: '$1,500 + GST',
    addonTotalsToward: 'cinematography',
  },
  {
    id: 'addon__teaser-film',
    title: 'Teaser film',
    description: '60 seconds, ready within 2 weeks.',
    price: '$250 + GST',
    addonTotalsToward: 'cinematography',
  },
  {
    id: 'addon__ceremony-film',
    title: 'Full ceremony film',
    description: 'Complete ceremony edit.',
    price: '$300 + GST',
    addonTotalsToward: 'cinematography',
  },
  {
    id: 'addon__speeches-film',
    title: 'Full speeches film',
    description: 'Complete speeches edit.',
    price: '$200 + GST',
    addonTotalsToward: 'cinematography',
  },
  {
    id: 'addon__first-dances-film',
    title: 'First dances film',
    description: 'First dances edit.',
    price: '$250 + GST',
    addonTotalsToward: 'cinematography',
  },
  {
    id: 'addon__documentary-edit',
    title: 'The Documentary Edit',
    description: 'Ceremony, speeches & first dances together.',
    price: '$650 + GST',
    addonTotalsToward: 'cinematography',
  },
  {
    id: 'addon__surprise-photobook',
    title: 'Surprise photobook',
    description: 'A keepsake photobook.',
    price: '$250 + GST',
    addonTotalsToward: 'photography',
  },
  {
    id: 'addon__engagement-photo',
    title: 'Engagement photography session',
    description: '1 hour · 40+ edited images.',
    price: '$450 + GST',
    addonTotalsToward: 'photography',
  },
  {
    id: 'addon__engagement-film',
    title: 'Engagement film session',
    description: '1.5 hours · personalized film for save-the-dates.',
    price: '$450 + GST',
    addonTotalsToward: 'cinematography',
  },
  {
    id: 'addon__boudoir',
    title: 'Boudoir photography',
    description: 'Private boudoir photography session.',
    price: '$250 + GST',
    addonTotalsToward: 'photography',
  },
]

export const BUILDER_VARIABLES: PackageBuilderResolvedProps['builderVariables'] = [
  {
    kind: 'quantity',
    reactKey: 'qty_hour_single',
    key: 'additional_hour_single',
    title: 'Additional hour · single creator',
    description: 'Quantity of single-creator coverage hours.',
    unitLabel: 'hours',
    min: 0,
    max: 8,
    defaultCount: 0,
    pricePerUnit: '$150 + GST',
    totalsToward: 'standalone',
  },
  {
    kind: 'quantity',
    reactKey: 'qty_hour_team',
    key: 'additional_hour_team',
    title: 'Additional hour · photo + film team',
    description: 'Quantity of two-person team coverage hours.',
    unitLabel: 'hours',
    min: 0,
    max: 8,
    defaultCount: 0,
    pricePerUnit: '$250 + GST',
    totalsToward: 'standalone',
  },
]

export const INVESTMENT_GUIDE_FAQS: PackageBuilderResolvedProps['faqs'] = [
  {
    category: 'Experience & Philosophy',
    question: 'How would you describe your presence and style?',
    answer:
      'We prioritize an observational, candid approach, emphasizing natural light and genuine moments. While we provide guidance for refined portraits, our goal is minimal interference so you can remain fully present in the celebration.',
  },
  {
    category: 'Experience & Philosophy',
    question: 'Who will be capturing our day?',
    answer:
      'Quay and Christine are the primary storytellers for every wedding. For larger celebrations, we can add additional professional shooters to our team to ensure every angle is preserved.',
  },
  {
    category: 'Experience & Philosophy',
    question: 'How many weddings do you take each year?',
    answer:
      'To ensure an intentional and bespoke experience for every couple, we limit ourselves to 10–20 weddings and elopements per year.',
  },
  {
    category: 'Travel & Logistics',
    question: 'Do you travel for destination weddings?',
    answer:
      'Absolutely. We have been capturing stories together since 2019. Within Alberta there are no travel fees; for destination celebrations, we ask the couple to handle travel arrangements. National and Provincial Park location fees of $100–$500 may apply.',
  },
  {
    category: 'Travel & Logistics',
    question: "What's the difference between an elopement and a wedding collection?",
    answer:
      'Elopement & Intimate collections are for 40 guests or fewer, with 1–4 hours of coverage. Wedding collections cover the full day (8–12 hours) and include longer films, ceremony and speech edits.',
  },
  {
    category: 'Creative & Delivery',
    question: 'When will we see our photos and films?',
    answer:
      'You will receive photo sneak peeks and a film trailer within 1–2 weeks. Your full heirloom collection is delivered with care within about 3 months.',
  },
  {
    category: 'Creative & Delivery',
    question: 'How is the music selected?',
    answer:
      'To maintain the cinematic integrity of our films, we select the music ourselves, choosing tracks that reflect the soul of your day while avoiding copyright issues.',
  },
  {
    category: 'Creative & Delivery',
    question: 'Do you provide raw footage?',
    answer:
      'We believe the true value lies in the finished, edited work. While we do not provide raw files, the Documentary Edit offers longer, more complete films of your key moments.',
  },
  {
    category: 'Booking & Investment',
    question: 'How do we secure our date?',
    answer:
      'A signed agreement and a 30% non-refundable deposit officially reserve your date, following a complimentary 30-minute consultation.',
  },
  {
    category: 'Booking & Investment',
    question: 'Do you offer payment plans?',
    answer:
      'Yes: interest-free payment plans split into up to five instalments with adaptable dates. All prices exclude GST.',
  },
]

/** Display data for static tier cards (same prices as builder catalogs). */
export const INTIMATE_TIER_CARDS = [
  {
    numeral: 'Collection I',
    name: 'The Vow Hour',
    hours: '1 hour · 2-person team',
    priceLabel: 'Photo + Film',
    price: 1550,
    alt: 'Photo or film only, from $850',
    description: 'For courthouse signings or a quick mountain vow exchange.',
    inclusions: [
      '1 hour of coverage',
      'Quay & Christine, together',
      '50+ high-resolution images & online gallery',
      '"Vow Edit" documentary film',
      '1-minute social teaser',
    ],
    featured: false,
    cta: 'Check your date',
    image: INVESTMENT_GUIDE_IMAGES.vowHour,
    imageAlt: 'Couple crossing a downtown street after a courthouse ceremony',
  },
  {
    numeral: 'Collection II',
    name: 'The Micro-Wedding',
    hours: '3 hours · 2-person team',
    priceLabel: 'Photo + Film',
    price: 2650,
    alt: 'Photo only $1,650 · Film only $1,850',
    description:
      'For intimate celebrations that need more time, with a little dinner and a few toasts.',
    inclusions: [
      '3 hours of coverage',
      'Lead photographer & lead cinematographer',
      '200+ high-resolution edited images & private gallery',
      '3–4 minute cinematic highlight film',
      'Under 40 guests',
    ],
    featured: false,
    cta: 'Check your date',
    image: INVESTMENT_GUIDE_IMAGES.microWedding,
    imageAlt: 'Couple with their dogs at an intimate celebration',
  },
  {
    numeral: 'Collection III',
    name: 'The Elopement Collective',
    hours: '4 hours · specialist team',
    priceLabel: 'Photo + Film',
    price: 2950,
    alt: 'The uncompromised elopement experience',
    description:
      'The focus remains on the "I do", but nothing is missed: vows, portraits and the quiet moments in between.',
    inclusions: [
      '4 hours of coverage',
      'Quay on cinema, Christine on photo',
      '200+ high-resolution images',
      '3–4 minute storytelling film',
      'Documentary edit of your vows',
      '60-second social teaser',
    ],
    featured: true,
    cta: 'Reserve this collection',
    image: INVESTMENT_GUIDE_IMAGES.elopementCollective,
    imageAlt: 'Elopement on a frozen lake beneath the Rockies',
  },
] as const

export const WEDDING_TIER_CARDS = [
  {
    numeral: 'Collection IV',
    name: 'The Story',
    hours: '8 hours · Quay & Christine',
    priceLabel: 'Starting at',
    price: 4400,
    alt: 'Getting ready through your first dance',
    description: 'The essential flow of your day, beautifully paced and gently directed.',
    inclusions: [
      '8 hours of photo & film coverage',
      '2-person specialist team',
      '4–5 minute cinematic highlight film',
      'Full ceremony edit',
      'Curated gallery of every successful image',
      'Private online gallery & personal printing rights',
      'Complimentary 30-minute engagement session',
    ],
    featured: false,
    cta: 'Check your date',
    image: INVESTMENT_GUIDE_IMAGES.theStory,
    imageAlt: 'Couple embracing beside an ivy-covered wall',
  },
  {
    numeral: 'Collection V',
    name: 'The Legacy',
    hours: '10 hours · team of three',
    priceLabel: 'Starting at',
    price: 5900,
    alt: 'Our recommended sweet spot',
    description:
      'A relaxed timeline with toasts, dances and your grand exit fully documented.',
    inclusions: [
      '10 hours of photo & film coverage',
      'Quay & Christine + associate for 4 hours',
      '5–6 minute cinematic highlight film',
      'Full ceremony edit',
      'Full speeches edit',
      'Curated gallery of every successful image',
      'Complimentary 30-minute engagement session',
      '60-second social media teaser',
    ],
    featured: true,
    cta: 'Reserve this collection',
    image: INVESTMENT_GUIDE_IMAGES.theLegacy,
    imageAlt: 'Sunset dip kiss on the prairie',
  },
  {
    numeral: 'Collection VI',
    name: 'The Masterpiece',
    hours: '12 hours · full archival team',
    priceLabel: 'Starting at',
    price: 7400,
    alt: 'The ultimate archival collection',
    description:
      'From early-morning mimosas to the final sparkler send-off. No moment, detail or speech is left behind.',
    inclusions: [
      '12 hours of photo & film coverage',
      'Quay & Christine + associate for 6 hours',
      '8–10 minute extended feature film',
      'Full ceremony, speeches & first dance edits',
      '60-second social media teaser',
      'Drone cinematography (location & weather permitting)',
      'Complimentary 1-hour engagement session',
      'Surprise photobook',
    ],
    featured: false,
    cta: 'Begin the conversation',
    image: INVESTMENT_GUIDE_IMAGES.theMasterpiece,
    imageAlt: 'Bride in a ballgown at a black-and-white reception venue',
  },
] as const

export const ADDON_DISPLAY_GROUPS = [
  {
    title: 'Coverage & Team',
    items: [
      { name: 'Additional hour · single creator', price: '$150', note: null },
      {
        name: 'Additional hour · photo + film team',
        price: '$250',
        note: 'One rate for the two-person team',
      },
      { name: 'Second photographer', price: '$500', note: null },
      {
        name: 'Split day fee',
        price: '$250',
        note: 'Coverage across two separate parts of the day',
      },
      {
        name: 'National / Provincial Park location fee',
        price: '$100–500',
        note: 'Depending on location',
      },
      {
        name: 'Same-day edit film',
        price: '$1,500',
        note: 'Timeline sensitive, so please coordinate with us',
      },
    ],
  },
  {
    title: 'Films & Edits',
    items: [
      { name: 'Teaser film', price: '$250', note: '60 seconds, ready within 2 weeks' },
      { name: 'Full ceremony film', price: '$300', note: null },
      { name: 'Full speeches film', price: '$200', note: null },
      { name: 'First dances film', price: '$250', note: null },
      {
        name: 'The Documentary Edit',
        price: '$650',
        note: 'Ceremony, speeches & first dances together',
      },
      { name: 'Surprise photobook', price: '$250', note: null },
    ],
  },
  {
    title: 'Sessions',
    items: [
      {
        name: 'Engagement photography session',
        price: '$450',
        note: '1 hour · 40+ edited images',
      },
      {
        name: 'Engagement film session',
        price: '$450',
        note: '1.5 hours · personalized film for save-the-dates',
      },
      { name: 'Boudoir photography', price: '$250', note: null },
    ],
  },
] as const

export const STANDARD_ITEMS = [
  {
    n: 'i.',
    title: 'Quay & Christine',
    text: 'We are the primary storytellers at every wedding and elopement.',
  },
  {
    n: 'ii.',
    title: 'A 30-minute consultation',
    text: 'Before booking, a relaxed call to make sure we are the right fit for your vision.',
  },
  {
    n: 'iii.',
    title: 'Sneak peeks in 1–2 weeks',
    text: 'Photo previews and a film trailer while the day is still fresh.',
  },
  {
    n: 'iv.',
    title: 'Cinema-grade equipment',
    text: 'Professional mirrorless cinema cameras, high-fidelity audio and drones where legal and safe.',
  },
  {
    n: 'v.',
    title: 'Music, handled',
    text: 'Licensed tracks chosen to reflect your day, so your film can be shared anywhere.',
  },
  {
    n: 'vi.',
    title: 'No travel fees in Alberta',
    text: 'No travel fees for weddings within Alberta. For destination celebrations, we ask couples to handle travel arrangements.',
  },
] as const

export const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Inquire',
    text: 'Share your date, location and vision. We typically respond within 24–48 hours.',
  },
  {
    n: '02',
    title: 'Consult',
    text: 'An initial 30-minute consultation to make sure we are a perfect fit.',
  },
  {
    n: '03',
    title: 'Reserve',
    text: 'A signed agreement and a 30% non-refundable deposit officially secure your date.',
  },
  {
    n: '04',
    title: 'Plan & pay with ease',
    text: 'Interest-free payment plans in up to five instalments with adaptable dates.',
  },
] as const

/** Builder props for `/investment/package-builder` — sole source of package totals. */
export function getInvestmentGuideBuilderProps(): PackageBuilderResolvedProps {
  const photoCatalog = ensureCoverageHourDeductionOnPackages(
    enrichCatalogItems([...PHOTO_CATALOG, ...INTIMATE_PHOTO_CATALOG]),
    RATE_SINGLE
  )
  const videoCatalog = ensureCoverageHourDeductionOnPackages(
    enrichCatalogItems([...VIDEO_CATALOG, ...INTIMATE_VIDEO_CATALOG]),
    RATE_SINGLE
  )
  const photoFilmBundleOffers = ensureCoverageHourDeductionOnPackages(
    enrichCatalogItems(PHOTO_FILM_BUNDLE_OFFERS),
    RATE_TEAM
  )

  return {
    eyebrow: 'Interactive Builder',
    title: 'Build your package',
    intro:
      'Choose photography, cinematography, or photo + film collections, customize inclusions, then send your draft.',
    photoColumnTitle: 'Photography',
    photoColumnSubtitle: 'Tap to add · Edit on selected cards to customize inclusions',
    videoColumnTitle: 'Cinematography',
    videoColumnSubtitle: 'Tap to add · Edit on selected cards to customize inclusions',
    photoCatalog,
    photoFilmBundleOffers,
    photoFilmSectionTitle: 'Photo + Film',
    photoFilmSectionSubtitle: 'Wedding collections and elopement combos',
    photoFilmSectionIntro:
      'Booking photo and film together is always the better value compared with booking them separately.',
    videoCatalog,
    addonCatalog: enrichCatalogItems(ADDON_CATALOG),
    addonSectionTitle: 'Enhancements',
    addonSectionSubtitle: 'Add extras from the list below to any selected package.',
    builderVariables: BUILDER_VARIABLES,
    variablesSectionTitle: 'Additional coverage hours',
    variablesSectionSubtitle:
      'Optional hourly extensions — single creator $150/hr, photo + film team $250/hr.',
    useInvestmentStyleHero: false,
    heroVideoSrc: null,
    faqs: INVESTMENT_GUIDE_FAQS,
  }
}
