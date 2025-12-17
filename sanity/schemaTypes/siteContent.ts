import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteContent',
  title: 'Site Page Content',
  type: 'document',
  fieldsets: [
    { name: 'about', title: 'About Page' },
    { name: 'inquire', title: 'Inquire Page' },
    { name: 'titles', title: 'Gallery Page Titles' },
    { name: 'footer', title: 'Footer Content' }, // New Fieldset
  ],
  fields: [
    defineField({
      name: 'navbarLogo',
      title: 'Website Logo (Navbar)',
      type: 'image',
      description: 'Upload a white PNG with transparent background.',
      options: { hotspot: true }
    }),
    // --- ABOUT PAGE ---
    defineField({
      name: 'aboutTitle',
      title: 'Title',
      type: 'string',
      fieldset: 'about',
      initialValue: 'About Us'
    }),
    defineField({
      name: 'aboutImage',
      title: 'Bio Photo',
      type: 'image',
      fieldset: 'about',
      options: { hotspot: true }
    }),
    defineField({
      name: 'aboutText',
      title: 'Bio Text',
      type: 'text',
      fieldset: 'about',
      initialValue: 'We are a husband and wife team...'
    }),

    // --- INQUIRE PAGE ---
    defineField({
      name: 'inquireTitle',
      title: 'Title',
      type: 'string',
      fieldset: 'inquire',
      initialValue: "Let's Create Something Beautiful"
    }),
    defineField({
      name: 'inquireText',
      title: 'Intro Text',
      type: 'text',
      fieldset: 'inquire',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      fieldset: 'inquire',
      initialValue: 'hello@storycruzfilms.com'
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      fieldset: 'inquire',
      initialValue: 'High River, Alberta'
    }),

    // --- GALLERY TITLES ---
    defineField({
      name: 'photosTitle',
      title: 'Photos Page Heading',
      type: 'string',
      fieldset: 'titles',
      initialValue: 'Selected Photography'
    }),
    defineField({
      name: 'filmsTitle',
      title: 'Films Page Heading',
      type: 'string',
      fieldset: 'titles',
      initialValue: 'Cinematic Films'
    }),
    // --- FOOTER CONTENT ---
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      fieldset: 'footer',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', title: 'Platform Name', type: 'string', description: 'e.g. Instagram' },
            { name: 'url', title: 'URL', type: 'url' }
          ]
        }
      ]
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      fieldset: 'footer',
      initialValue: '© 2025 StoryCruz Films',
      description: 'The text that appears at the very bottom.'
    }),
    defineField({
  name: 'aboutSignature',
  title: 'About Page Signature',
  type: 'string',
  description: 'This will appear in a handwritten font (e.g., "Love, Quay & Christine")',
  initialValue: 'Love, Quay & Christine',
   }),
  ],
})