import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pricing',
  title: 'Hidden Pricing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Investment Guide 2025'
    }),

    defineField({
      name: 'slug',
      title: 'Page Link (Slug)',
      type: 'slug',
      description: 'This defines the secret link. e.g. "weddings" becomes .../investment/weddings',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    }),
    
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Upload the background video here (mp4). If empty, it will use the default.'
    }),

    // VIDEO PACKAGES
    defineField({
      name: 'videoPackages',
      title: 'Video Packages',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Package Name' },
          { name: 'price', type: 'string', title: 'Price' },
          { name: 'description', type: 'text', title: 'Short Description' },
          { name: 'features', type: 'array', title: 'Features List', of: [{ type: 'string' }] }
        ]
      }]
    }),

    // PHOTO PACKAGES
    defineField({
      name: 'photoPackages',
      title: 'Photography Packages',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Package Name' },
          { name: 'price', type: 'string', title: 'Price' },
          { name: 'description', type: 'text', title: 'Short Description' },
          { name: 'features', type: 'array', title: 'Features List', of: [{ type: 'string' }] }
        ]
      }]
    }),

    // SEASONAL & INTIMATE COLLECTIONS
    defineField({
      name: 'seasonalCollections',
      title: 'Seasonal & Intimate Collections',
      type: 'object',
      description: 'Special pricing for elopements, micro-weddings, and intimate celebrations',
      fields: [
        {
          name: 'enabled',
          title: 'Show on Pricing Page',
          type: 'boolean',
          initialValue: true,
          description: 'Toggle this section on/off'
        },
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: 'The Seasonal & Intimate Collections'
        },
        {
          name: 'availability',
          title: 'Availability Note',
          type: 'text',
          description: 'e.g., "November 1 – March 31 (Any Day) | April 1 – October 31 (Mon–Thu Only)"'
        },
        {
          name: 'tiers',
          title: 'Collection Tiers',
          type: 'array',
          of: [{
            type: 'object',
            title: 'Tier',
            fields: [
              {
                name: 'tierNumber',
                title: 'Tier Number',
                type: 'number',
                description: 'e.g., 1, 2, 3, 4'
              },
              {
                name: 'tierName',
                title: 'Tier Name',
                type: 'string',
                description: 'e.g., "The Power Hour Collections"'
              },
              {
                name: 'duration',
                title: 'Duration',
                type: 'string',
                description: 'e.g., "1 Hour", "2 Hours", "4 Hours"'
              },
              {
                name: 'tagline',
                title: 'Tagline',
                type: 'text',
                description: 'Short description of who this tier is for'
              },
              {
                name: 'hasMultipleOptions',
                title: 'Has Multiple Options (A/B)?',
                type: 'boolean',
                initialValue: false,
                description: 'Enable if this tier has Option A and Option B'
              },
              // Single option fields (used when hasMultipleOptions is false)
              {
                name: 'singlePrice',
                title: 'Price',
                type: 'string',
                description: 'Price for single-option tiers (e.g., "$1,800 + GST")',
                hidden: ({ parent }) => parent?.hasMultipleOptions === true
              },
              {
                name: 'singleCoverage',
                title: 'Coverage',
                type: 'string',
                description: 'e.g., "2 Hours Continuous"',
                hidden: ({ parent }) => parent?.hasMultipleOptions === true
              },
              {
                name: 'singleTeam',
                title: 'The Team',
                type: 'string',
                description: 'e.g., "Single Lead Creator (Quay OR Christine)"',
                hidden: ({ parent }) => parent?.hasMultipleOptions === true
              },
              {
                name: 'singleDeliverables',
                title: 'Deliverables',
                type: 'array',
                of: [{ type: 'string' }],
                description: 'List of what\'s included',
                hidden: ({ parent }) => parent?.hasMultipleOptions === true
              },
              {
                name: 'singleBestFor',
                title: 'Best For',
                type: 'text',
                description: 'Who is this option ideal for?',
                hidden: ({ parent }) => parent?.hasMultipleOptions === true
              },
              {
                name: 'singleGuestCap',
                title: 'Guest Cap',
                type: 'string',
                description: 'e.g., "40 guests or fewer" (optional)',
                hidden: ({ parent }) => parent?.hasMultipleOptions === true
              },
              // Multiple options (A/B) - used when hasMultipleOptions is true
              {
                name: 'options',
                title: 'Options',
                type: 'array',
                hidden: ({ parent }) => parent?.hasMultipleOptions !== true,
                of: [{
                  type: 'object',
                  title: 'Option',
                  fields: [
                    {
                      name: 'optionLabel',
                      title: 'Option Label',
                      type: 'string',
                      description: 'e.g., "Option A", "Option B", "Photo Only", "Video Only"'
                    },
                    {
                      name: 'optionName',
                      title: 'Option Name',
                      type: 'string',
                      description: 'e.g., "Single Focus (Photo OR Video)", "The Power Combo"'
                    },
                    {
                      name: 'price',
                      title: 'Price',
                      type: 'string',
                      description: 'e.g., "$1,000", "$1,500 + GST"'
                    },
                    {
                      name: 'coverage',
                      title: 'Coverage',
                      type: 'string',
                      description: 'e.g., "1 Hour Continuous"'
                    },
                    {
                      name: 'team',
                      title: 'The Team',
                      type: 'string',
                      description: 'e.g., "1 Creator", "2-Person Team (Quay & Christine)"'
                    },
                    {
                      name: 'mediaChoice',
                      title: 'Media Choice Description',
                      type: 'text',
                      description: 'For options where client chooses Photo OR Video (optional)'
                    },
                    {
                      name: 'deliverables',
                      title: 'Deliverables',
                      type: 'array',
                      of: [{ type: 'string' }],
                      description: 'List of what\'s included'
                    },
                    {
                      name: 'whyItWorks',
                      title: 'Why It Works / Best For',
                      type: 'text',
                      description: 'Selling point for this option'
                    },
                    {
                      name: 'guestCap',
                      title: 'Guest Cap',
                      type: 'string',
                      description: 'e.g., "40 guests or fewer" (optional)'
                    }
                  ],
                  preview: {
                    select: {
                      title: 'optionLabel',
                      subtitle: 'price'
                    }
                  }
                }]
              }
            ],
            preview: {
              select: {
                tierNumber: 'tierNumber',
                tierName: 'tierName',
                duration: 'duration'
              },
              prepare({ tierNumber, tierName, duration }) {
                return {
                  title: `Tier ${tierNumber}: ${tierName || 'Untitled'}`,
                  subtitle: duration || ''
                }
              }
            }
          }]
        }
      ]
    }),

    // FAQ SECTION WITH CATEGORIES
    defineField({
      name: 'faqs',
      title: 'Frequently Asked Questions',
      type: 'array',
      description: 'Add common questions and answers for this specific investment guide.',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'category', 
              title: 'Category', 
              type: 'string',
              options: {
                list: [
                  { title: 'Experience & Philosophy', value: 'Experience & Philosophy' },
                  { title: 'Travel & Logistics', value: 'Travel & Logistics' },
                  { title: 'Creative & Delivery', value: 'Creative & Delivery' },
                  { title: 'Booking & Investment', value: 'Booking & Investment' },
                ],
              },
              validation: Rule => Rule.required()
            },
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' }
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'category'
            }
          }
        }
      ]
    }),
  ]
})