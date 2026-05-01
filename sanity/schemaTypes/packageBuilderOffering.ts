import { defineField, defineType } from 'sanity'

/** Reusable row: one add-on inside Photo or Video on the package builder page */
export default defineType({
  name: 'packageBuilderOffering',
  title: 'Package item',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      title: 'Item key',
      type: 'string',
      description:
        'Stable ID — no spaces (e.g. photo-full-day, video-highlight). Unique within this list.',
      validation: (Rule) =>
        Rule.required().regex(/^[a-zA-Z0-9_-]+$/, {
          name: 'key',
          invert: false,
        }),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (shown to clients)',
      type: 'string',
      description: 'e.g. $950 + GST or From $2,400. Leave empty to hide.',
    }),
    defineField({
      name: 'addonTotalsToward',
      title: 'Add-on totals (when used in À la carte list)',
      type: 'string',
      description:
        'Pricing column for à la carte + variable picker rows only. Override per **Optional upgrades on this listing** below.',
      options: {
        list: [
          { title: 'Add to Photography estimate column', value: 'photography' },
          { title: 'Add to Cinematography estimate column', value: 'cinematography' },
          { title: 'Separate — only in combined grand total', value: 'standalone' },
        ],
        layout: 'radio',
      },
      initialValue: 'standalone',
    }),
    defineField({
      name: 'optionalPackageAddOns',
      title: 'Optional upgrades on this listing',
      description:
        'Appear inside this card after “What’s included” — couples tick to add coverage, RAW, trailers, … (first $ feeds estimate).',
      type: 'array',
      of: [{ type: 'packageOptionalAddOn' }],
    }),
    defineField({
      name: 'included',
      title: 'What’s included',
      type: 'array',
      description:
        '**Feature** = removable + optional $ deduction · **Plain text line** = simple bullet.',
      of: [
        { type: 'pricingPackageFeature', title: 'Feature (removable & $)' },
        { type: 'pricingPlainFeatureLine', title: 'Plain text line' },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', price: 'price', key: 'key' },
    prepare({ title, price, key }) {
      return {
        title: title || 'Untitled',
        subtitle: [key, price].filter(Boolean).join(' · '),
      }
    },
  },
})
