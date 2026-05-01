import { defineField, defineType } from 'sanity'

/**
 * Simple feature bullet (replaces raw strings in array — Sanity forbids string + object in the same `of`).
 */
export default defineType({
  name: 'pricingPlainFeatureLine',
  title: 'Plain text line',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Line',
      type: 'string',
      description: 'Same as the old one-line bullets. Use “Feature” instead for removable + dollar amount.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { text: 'text' },
    prepare({ text }: { text?: string }) {
      return { title: text || '(empty)' }
    },
  },
})
