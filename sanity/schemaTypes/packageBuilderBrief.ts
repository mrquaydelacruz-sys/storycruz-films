import { defineField, defineType } from 'sanity'

/**
 * One document per client (or per campaign). Typical share URL: /package/&lt;slug&gt;
 * Site-wide builder: publish one brief with slug `package-builder` for /investment/package-builder.
 */
export default defineType({
  name: 'packageBuilderBrief',
  title: 'Client Package Link',
  type: 'document',
  description:
    'Personalized links use /package/your-slug. For the public page at /investment/package-builder, publish a brief whose slug is exactly package-builder (lowercase). Hero and tiers can mirror your Hidden Pricing Page when that option is on.',
  fields: [
    defineField({
      name: 'internalName',
      title: 'Internal label',
      type: 'string',
      description: 'Just for Studio — client name / event (e.g. “Kim & Avery — Nov 2026”).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description:
        'Personalized link: yoursitename.com/package/this-part. Use slug package-builder for yoursitename.com/investment/package-builder.',
      options: {
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
        source: 'internalName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'useInvestmentGuide',
      title: 'Include curated packs from Investment Guide',
      type: 'boolean',
      description:
        'When checked (recommended), photography/videography columns start from your Hidden Pricing Page for this slug — same tiers as /investment/&lt;slug&gt;. Turn OFF only if this brief lists packages exclusively manually.',
      initialValue: true,
    }),

    defineField({
      name: 'investmentPricingSlug',
      title: 'Which Hidden Pricing Page to mirror',
      type: 'string',
      description:
        'Slug shown after /investment/ … Typically investment-guide for https://www.storycruzfilms.com/investment/investment-guide — matches CMS ”Hidden Pricing Page” slug.',
      initialValue: 'investment-guide',
      validation: (Rule) =>
        Rule.custom((value, ctx) => {
          if (ctx.document?.useInvestmentGuide === false) return true
          return `${value ?? ''}`.trim().length > 0 || 'Enter the Hidden Pricing Page slug'
        }),
      hidden: ({ document }) => document?.useInvestmentGuide === false,
    }),

    defineField({
      name: 'pageEyebrow',
      title: 'Eyebrow label',
      type: 'string',
      description:
        'Only used when Investment Guide sync is OFF. Otherwise the hero matches your Hidden Pricing Page.',
      hidden: ({ document }) => document?.useInvestmentGuide !== false,
    }),
    defineField({
      name: 'pageTitle',
      title: 'Main headline',
      type: 'string',
      initialValue: 'Build your package',
      description:
        'Only used when Investment Guide sync is OFF. When sync is ON, the title comes from the Hidden Pricing document.',
      hidden: ({ document }) => document?.useInvestmentGuide !== false,
    }),
    defineField({
      name: 'pageIntro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 4,
      description:
        'Only used when Investment Guide sync is OFF. When sync is ON, clients see the same intro as /investment.',
      hidden: ({ document }) => document?.useInvestmentGuide !== false,
    }),
    defineField({
      name: 'photoColumnTitle',
      title: 'Photo column title',
      type: 'string',
      initialValue: 'Photography',
    }),
    defineField({
      name: 'photoColumnSubtitle',
      title: 'Photo column subtitle',
      type: 'string',
      initialValue: 'Tap to add or remove',
    }),
    defineField({
      name: 'photoOfferings',
      title: 'Extra photography items (optional)',
      description:
        'Added after the packs from the Hidden Pricing Page — e.g. client-only add-ons.',
      type: 'array',
      of: [{ type: 'packageBuilderOffering' }],
    }),
    defineField({
      name: 'videoColumnTitle',
      title: 'Video column title',
      type: 'string',
      description: 'Defaults to Cinematography to match your Investment Guide. Override here if needed.',
      initialValue: 'Cinematography',
    }),
    defineField({
      name: 'videoColumnSubtitle',
      title: 'Video column subtitle',
      type: 'string',
      initialValue: 'Tap to add or remove',
    }),
    defineField({
      name: 'videoOfferings',
      title: 'Extra videography items (optional)',
      description:
        'Added after the cinematography packs from the Hidden Pricing Page.',
      type: 'array',
      of: [{ type: 'packageBuilderOffering' }],
    }),

    defineField({
      name: 'addonSectionTitle',
      title: 'À la carte section heading',
      type: 'string',
      description: 'Shown above optional add-ons (extra hour, second shooter, …). Leave blank for default.',
    }),
    defineField({
      name: 'addonSectionSubtitle',
      title: 'À la carte section subtitle',
      type: 'string',
    }),
    defineField({
      name: 'addonOfferings',
      title: 'À la carte add-ons (optional)',
      description:
        'Extra hour, additional photographer/videographer, raw delivery, travel block, … Each row: set Price, use **Add-on totals** to tie dollars to the photo column, cinema column, or standalone combined total only.',
      type: 'array',
      of: [{ type: 'packageBuilderOffering' }],
    }),

    defineField({
      name: 'variablesSectionTitle',
      title: 'Variables section heading',
      type: 'string',
      description:
        'Optional counter / multi-pick widgets (configured below). Blank uses site default.',
    }),
    defineField({
      name: 'variablesSectionSubtitle',
      title: 'Variables section subtitle',
      type: 'string',
    }),
    defineField({
      name: 'packageVariables',
      title: 'Client variables',
      description:
        'Countable extras (multiply first $ in Price per unit) or curated feature lists (reuse package rows from any tier — set Add-on totals on each choice). Clients only see definitions you publish here.',
      type: 'array',
      of: [{ type: 'packageBuilderVariable' }],
    }),
  ],
  preview: {
    select: {
      internalName: 'internalName',
      slug: 'slug.current',
    },
    prepare({ internalName, slug }) {
      const path =
        slug === 'package-builder'
          ? '/investment/package-builder'
          : slug
            ? `/package/${slug}`
            : '(set slug)'
      return {
        title: internalName || 'Package link',
        subtitle: path,
      }
    },
  },
})
