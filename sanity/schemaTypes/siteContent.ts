import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteContent',
  title: 'Site Page Content',
  type: 'document',
  fieldsets: [
    { name: 'about', title: 'About Page' },
    { name: 'inquire', title: 'Inquire Page' },
    { name: 'photos', title: 'Photos Page' },
    { name: 'titles', title: 'Gallery Page Titles' },
    { name: 'footer', title: 'Footer Content' },
  ],
  fields: [
    defineField({
      name: 'navbarLogo',
      title: 'Website Logo (Navbar)',
      type: 'image',
      description: 'Upload a white PNG with transparent background.',
      options: { hotspot: true }
    }),
    
// --- NEW: WELCOME POPUP ---
    defineField({
      name: 'popupActive',
      title: 'Enable Welcome Popup?',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle this ON to show a popup message to new visitors.',
    }),
    defineField({
      name: 'popupImage',
      title: 'Popup Image',
      type: 'image',
      hidden: ({document}) => !document?.popupActive, // Hides if toggle is OFF
      options: { hotspot: true }
    }),
    defineField({
      name: 'popupTitle',
      title: 'Popup Title',
      type: 'string',
      hidden: ({document}) => !document?.popupActive,
      initialValue: 'Now Booking 2026'
    }),
    defineField({
      name: 'popupText',
      title: 'Popup Message',
      type: 'text',
      hidden: ({document}) => !document?.popupActive,
      rows: 3
    }),
    defineField({
      name: 'popupLink',
      title: 'Button Link (Optional)',
      type: 'string',
      hidden: ({document}) => !document?.popupActive,
      description: 'e.g., /inquire or https://google.com'
    }),
    defineField({
      name: 'popupLinkText',
      title: 'Button Label',
      type: 'string',
      hidden: ({document}) => !document?.popupActive,
      initialValue: 'Learn More'
    }),
    // --------------------------

    // --- PHOTOS PAGE ---
    defineField({
      name: 'photoHeaderImages',
      title: 'Photo Page Header Slideshow',
      type: 'array',
      fieldset: 'photos',
      description: 'Upload 6-10 high-quality photos. They will cross-fade automatically.',
      of: [{ type: 'image', options: { hotspot: true } }],
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
    // 1. RESTORED MISSING FIELD: Bio Text
    defineField({
      name: 'aboutText',
      title: 'Bio Text',
      type: 'text',
      fieldset: 'about', 
    }),
    // 2. RESTORED MISSING FIELD: Text Signature
    defineField({
      name: 'aboutSignature',
      title: 'Signature Text (e.g. Quay, & Christine)',
      type: 'string',
      fieldset: 'about',
    }),
    // 3. New GIF Field
    defineField({
      name: 'signatureGif',
      title: 'Signature Animation (GIF)',
      type: 'image',
      fieldset: 'about',
      description: 'Upload a transparent GIF of your signature writing itself (Overrides text).',
      options: { hotspot: true }
    }),
    // 4. New Slideshow Field
    defineField({
      name: 'aboutSlideshow',
      title: 'About Page Slideshow',
      type: 'array',
      fieldset: 'about',
      description: 'Upload 6-10 photos to appear below your bio.',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

// --- NEW: CHRISTINE'S SECTION ---
    defineField({
      name: 'christineTitle',
      title: "Christine's Title",
      type: 'string',
      fieldset: 'about',
      initialValue: 'Christine'
    }),
    defineField({
      name: 'christineImage',
      title: "Christine's Photo",
      type: 'image',
      fieldset: 'about',
      options: { hotspot: true }
    }),
    defineField({
      name: 'christineText',
      title: "Christine's Bio",
      type: 'text',
      fieldset: 'about',
    }),
    defineField({
      name: 'christineSignature',
      title: "Christine's Signature Text",
      type: 'string',
      fieldset: 'about',
      description: 'Optional: Animated signature text for this section.'
    }),
    // --------------------------------

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
      name: 'inquireHeroVideo',
      title: 'Inquire Page Hero Video',
      type: 'file', 
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
  ],
})