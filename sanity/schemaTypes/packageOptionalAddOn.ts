import { defineField, defineType } from 'sanity'

/**
 * Priced upgrades clients opt into **on top of** a specific package card
 * (shows inside “Customize”, separate from removals).
 */
export default defineType({
  name: 'packageOptionalAddOn',
  title: 'Package optional upgrade',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      validation: (Rule) =>
        Rule.required().regex(/^[a-zA-Z0-9_-]+$/, { name: 'key', invert: false }),
      description:
        'Unique within this package (extra-hour-coll1, raw-stills-addon, …)',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Add-on price (client-facing)',
      type: 'string',
      description: 'First $amount is summed when they check this upgrade.',
      placeholder: '$350/hr · + GST',
    }),
    defineField({
      name: 'addonTotalsToward',
      title: 'Roll into estimate column…',
      type: 'string',
      options: {
        list: [
          { title: 'Photography', value: 'photography' },
          { title: 'Cinematography', value: 'cinematography' },
          { title: 'Standalone combined total only', value: 'standalone' },
        ],
        layout: 'radio',
      },
      initialValue: 'photography',
    }),
  ],
  preview: {
    select: { title: 'title', price: 'price', key: 'key' },
    prepare({ title, price, key }) {
      return { title: title || 'Upgrade', subtitle: [key, price].filter(Boolean).join(' · ') }
    },
  },
})
