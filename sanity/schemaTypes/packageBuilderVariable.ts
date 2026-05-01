import { defineField, defineType } from 'sanity'

/**
 * Controlled “inputs” clients can use on package links —
 * countable extras (hours, shooters) or multi-select bundles you curate here.
 */
export default defineType({
  name: 'packageBuilderVariable',
  title: 'Builder variable',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      title: 'Variable key',
      type: 'string',
      validation: (Rule) =>
        Rule.required().regex(/^[a-zA-Z0-9_-]+$/, {
          name: 'key',
          invert: false,
        }),
      description: 'Stable id (e.g. extra-hours-v1). No spaces — appears in inquiries.',
    }),
    defineField({
      name: 'title',
      title: 'Client-facing title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Helper text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'variableKind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {
            title: 'Countable quantity (hours, extra shooters/videographers, …)',
            value: 'quantity',
          },
          {
            title: 'Feature pick (curated list — tiers or items from elsewhere)',
            value: 'feature_pick',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'quantity',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'unitLabel',
      title: 'Unit label',
      type: 'string',
      placeholder: 'hours',
      description: 'Plural-friendly label beside the counter (hours, shooters, …).',
      hidden: ({ parent }) => parent?.variableKind !== 'quantity',
    }),
    defineField({
      name: 'minQuantity',
      title: 'Minimum',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
      hidden: ({ parent }) => parent?.variableKind !== 'quantity',
    }),
    defineField({
      name: 'maxQuantity',
      title: 'Maximum',
      type: 'number',
      initialValue: 12,
      validation: (Rule) => Rule.min(0),
      hidden: ({ parent }) => parent?.variableKind !== 'quantity',
    }),
    defineField({
      name: 'defaultQuantity',
      title: 'Default (start value)',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
      hidden: ({ parent }) => parent?.variableKind !== 'quantity',
    }),
    defineField({
      name: 'pricePerUnit',
      title: 'Price per unit (client-facing)',
      type: 'string',
      description: 'Shown to clients — first dollar amount × quantity feeds the approximate total.',
      placeholder: '$350/hr',
      hidden: ({ parent }) => parent?.variableKind !== 'quantity',
    }),
    defineField({
      name: 'quantityTotalsToward',
      title: 'Quantity total rolls into…',
      type: 'string',
      description: 'Estimate column.',
      hidden: ({ parent }) => parent?.variableKind !== 'quantity',
      options: {
        list: [
          { title: 'Photography column', value: 'photography' },
          { title: 'Cinematography column', value: 'cinematography' },
          { title: 'Standalone (combined grand total only)', value: 'standalone' },
        ],
        layout: 'radio',
      },
      initialValue: 'standalone',
    }),

    defineField({
      name: 'pickAllowMultiple',
      title: 'Allow picking more than one',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.variableKind !== 'feature_pick',
    }),
    defineField({
      name: 'pickOptions',
      title: 'Choices',
      description:
        'Same row shape as other builder items — set Price and **Add-on totals** where each selection should aggregate.',
      type: 'array',
      of: [{ type: 'packageBuilderOffering' }],
      hidden: ({ parent }) => parent?.variableKind !== 'feature_pick',
    }),
  ],
  preview: {
    select: { title: 'title', key: 'key', kind: 'variableKind', unitLabel: 'unitLabel' },
    prepare({ title, key, kind, unitLabel }: Record<string, string | undefined>) {
      const k = kind === 'feature_pick' ? 'Feature pick' : `Quantity (${unitLabel || 'units'})`
      return {
        title: title || key || 'Variable',
        subtitle: [key, k].filter(Boolean).join(' · '),
      }
    },
  },
})
