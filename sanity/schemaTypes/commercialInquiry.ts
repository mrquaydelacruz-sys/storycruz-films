import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'commercialInquiry',
  title: 'Commercial Inquiries',
  type: 'document',
  fields: [
    // Status field for tracking
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'In Discussion', value: 'in-discussion' },
          { title: 'Proposal Sent', value: 'proposal-sent' },
          { title: 'Booked', value: 'booked' },
          { title: 'Declined', value: 'declined' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),

    // Section 1: The Basics
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
    }),
    defineField({
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'website',
      title: 'Website / Social Media',
      type: 'string',
    }),
    defineField({
      name: 'timeline',
      title: 'Project Timeline',
      type: 'string',
    }),

    // Section 2: Project Scope
    defineField({
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          { title: 'Photography Only', value: 'photography' },
          { title: 'Video Only', value: 'video' },
          { title: 'Full Photo & Video Package', value: 'full-package' },
        ],
      },
    }),
    defineField({
      name: 'projectGoal',
      title: 'Project Goal',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'estimatedAssets',
      title: 'Estimated Assets Needed',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'musicLicensing',
      title: 'Music Licensing Needed',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'voiceover',
      title: 'Professional Voiceover Needed',
      type: 'boolean',
      initialValue: false,
    }),

    // Section 3: Production Details
    defineField({
      name: 'location',
      title: 'Location',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'At our studio', value: 'studio' },
          { title: 'On-site (at your office/facility)', value: 'onsite' },
          { title: 'External location', value: 'external' },
        ],
      },
    }),
    defineField({
      name: 'talent',
      title: 'Talent & Styling',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'We will provide staff/models', value: 'provide-staff' },
          { title: 'We need you to source professional talent', value: 'source-talent' },
          { title: 'We need hair/makeup/prop styling services', value: 'styling' },
        ],
      },
    }),
    defineField({
      name: 'projectDescription',
      title: 'Project Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'inspirationLinks',
      title: 'Inspiration / Moodboard Links',
      type: 'array',
      of: [{ type: 'url' }],
    }),

    // Section 4: Licensing & Usage
    defineField({
      name: 'usageTypes',
      title: 'Usage Types',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Organic Social Media / Website', value: 'organic-social' },
          { title: 'Paid Digital Advertising (Ads)', value: 'paid-ads' },
          { title: 'Print / Billboards / Physical Signage', value: 'print' },
          { title: 'Broadcast TV / Cinema', value: 'broadcast' },
        ],
      },
    }),
    defineField({
      name: 'usageDuration',
      title: 'Duration of Use',
      type: 'string',
      options: {
        list: [
          { title: '1 Year', value: '1 Year' },
          { title: '2 Years', value: '2 Years' },
          { title: '5 Years', value: '5 Years' },
          { title: 'Perpetual', value: 'Perpetual' },
        ],
      },
    }),

    // Section 5: Investment
    defineField({
      name: 'budget',
      title: 'Budget Range',
      type: 'string',
      options: {
        list: [
          { title: '$2,000 – $5,000', value: '$2,000 – $5,000' },
          { title: '$5,000 – $10,000', value: '$5,000 – $10,000' },
          { title: '$10,000 – $25,000', value: '$10,000 – $25,000' },
          { title: '$25,000+', value: '$25,000+' },
          { title: 'Need custom quote', value: "I'm not sure, I need a custom quote" },
        ],
      },
    }),
    defineField({
      name: 'additionalNotes',
      title: 'Additional Notes',
      type: 'text',
      rows: 4,
    }),

    // Metadata
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 4,
      description: 'Private notes for your team (not visible to client)',
    }),
  ],

  preview: {
    select: {
      title: 'companyName',
      subtitle: 'contactPerson',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ title, subtitle, status, date }) {
      const statusEmoji: Record<string, string> = {
        'new': '🆕',
        'contacted': '📞',
        'in-discussion': '💬',
        'proposal-sent': '📧',
        'booked': '✅',
        'declined': '❌',
      }
      const formattedDate = date ? new Date(date).toLocaleDateString() : ''
      return {
        title: `${statusEmoji[status] || '🆕'} ${title || 'Unknown Company'}`,
        subtitle: `${subtitle || 'No contact'} • ${formattedDate}`,
      }
    },
  },

  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Oldest First',
      name: 'submittedAtAsc',
      by: [{ field: 'submittedAt', direction: 'asc' }],
    },
    {
      title: 'By Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
})
