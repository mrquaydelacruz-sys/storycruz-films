import { defineField, defineType } from 'sanity'

/**
 * One line under a photo/video package on the Hidden Pricing Page.
 * Drives optional line-item pricing in the client package builder.
 */
export default defineType({
  name: 'pricingPackageFeature',
  title: 'Feature',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Description',
      type: 'string',
      description:
        'What’s included — same text clients see on the investment page and package builder.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'removable',
      title: 'Client can remove in package builder',
      type: 'boolean',
      description:
        'OFF = always included when they pick this package (no checkbox to turn it off).',
      initialValue: true,
    }),
    defineField({
      name: 'deductionAmount',
      title: 'Price reduction if removed ($)',
      type: 'number',
      description:
        'Optional deduction from this package list price when a client removes this line. Leave blank to split the list total evenly among all removable lines with no dollar amount.',
    }),
  ],
  preview: {
    select: { label: 'label', removable: 'removable', deductionAmount: 'deductionAmount' },
    prepare({ label, removable, deductionAmount }: Record<string, unknown>) {
      const l = typeof label === 'string' ? label : ''
      const parts: string[] = []
      if (removable === false) parts.push('fixed')
      if (
        typeof deductionAmount === 'number' &&
        Number.isFinite(deductionAmount) &&
        deductionAmount > 0
      ) {
        parts.push(`−${deductionAmount}`)
      }
      return { title: l || '(no label)', subtitle: parts.join(' · ') || undefined }
    },
  },
})
