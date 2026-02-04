import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'wedding',
  title: 'Wedding Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Couple Name (Title)',
      type: 'string',
      description: 'e.g. "Sarah & Mike - Lake Louise"',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' }, // This auto-generates the URL
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Video Link',
      type: 'url',
      description: 'Paste the full YouTube URL here'
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [{ type: 'image' }],
      options: { layout: 'grid' }
    }),
    defineField({
      name: 'date',
      title: 'Wedding Date',
      type: 'date',
    }),
  ],
})