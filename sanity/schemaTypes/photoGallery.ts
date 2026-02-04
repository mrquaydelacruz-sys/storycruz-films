import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'photoGallery',
  title: 'Photo Albums',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Album Title',
      type: 'string',
      description: 'e.g. "Sarah & Mike - Lake Louise"',
      validation: Rule => Rule.required()
    }),
    // AUTO-GENERATED SLUG (One click generation)
    defineField({
      name: 'slug',
      title: 'Page Link (Slug)',
      type: 'slug',
      options: {
        source: 'title', // This auto-fills from the title
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Drag and drop your selected photos here.'
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'date'
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage'
    }
  }
})