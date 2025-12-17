import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'film',
  title: 'Films (Portfolio)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Film Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),

    // --- ADDED THIS SECTION ---
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Click Generate to create a URL friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    // --------------------------

    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Just paste the full link (e.g. https://www.youtube.com/watch?v=...)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date Published',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
      validation: Rule => Rule.required()
    }),
    // We keep coverImage optional. If you leave it empty, our code will grab it from YouTube automatically.
    defineField({
      name: 'customThumbnail',
      title: 'Custom Cover Image (Optional)',
      type: 'image',
      description: 'Leave empty to automatically use the YouTube thumbnail.',
      options: { hotspot: true }
    }),
    defineField({
      name: 'featured',
      title: 'Featured?',
      type: 'boolean',
      description: 'Toggle ON to show this film on the Homepage.',
      initialValue: false, // Default is OFF
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'customThumbnail'
    }
  }
})