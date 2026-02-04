import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage Content',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title (Big Text)',
      type: 'string',
      initialValue: 'StoryCruz',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle (Small Text)',
      type: 'string',
      initialValue: 'Films & Photography',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Background Video (MP4)',
      type: 'file', 
      options: { accept: 'video/mp4' },
      description: 'Upload a short, compressed MP4 loop (under 10MB recommended).'
    }),
    defineField({
      name: 'introHeading',
      title: 'Intro Section Heading',
      type: 'string',
      initialValue: 'Capturing the Unscripted',
    }),
    defineField({
      name: 'introText',
      title: 'Intro Section Body Text',
      type: 'text',
      initialValue: 'We believe in the beauty of the moment.',
    }),
    defineField({
      name: 'introLeftImage',
      title: 'Intro Left (Portrait)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'introSlideshow',
      title: 'Intro Center Slideshow',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'introRightImage',
      title: 'Intro Right (Large Landscape)',
      type: 'image',
      options: { hotspot: true },
    }), // Removed the extra }), that was here
    defineField({
      name: 'dividerImage',
      title: 'Full-Width Divider Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'testimonials',
      title: 'Love Notes (Testimonials)',
      description: 'Add 3-5 sweet reviews from past couples.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'review',
        title: 'Review',
        fields: [
          defineField({ name: 'quote', title: 'The Words', type: 'text', rows: 4 }),
          defineField({ name: 'couple', title: 'Couple Names', type: 'string' }),
          defineField({ name: 'location', title: 'Wedding Location (Optional)', type: 'string' }),
        ]
      }]
    }),
  ],
})