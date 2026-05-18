import { client } from '@/sanity/client'
import { optimizedImageUrl, optimizedImageUrlMobile } from '@/lib/sanity-image'
import type { VisionData } from '@/app/vision/types'

function getYouTubeId(url: string) {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export async function getVisionData(): Promise<VisionData> {
  const homepageQuery = `*[_type == "homepage"][0]{
    heroVideo { asset->{url} },
    introLeftImage,
    introSlideshow,
    introRightImage,
    testimonials,
    dividerImage
  }`

  const filmsQuery = `*[_type == "film"] | order(publishedAt desc)[0...10]{
    title,
    slug,
    youtubeUrl,
    customThumbnail,
    featured
  }`

  const [homepage, films] = await Promise.all([
    client.fetch(homepageQuery),
    client.fetch(filmsQuery),
  ])

  const featuredDocs = films.filter((f: { featured?: boolean }) => f.featured)
  const nonFeatured = films.filter((f: { featured?: boolean }) => !f.featured)
  const displayFilms = [...featuredDocs, ...nonFeatured].slice(0, 4)

  const safeFilms =
    displayFilms.length > 0
      ? displayFilms
      : [
          {
            youtubeUrl: 'https://youtube.com',
            title: 'Fallback 1',
            slug: { current: 'fallback-1' },
          },
          {
            youtubeUrl: 'https://youtube.com',
            title: 'Fallback 2',
            slug: { current: 'fallback-2' },
          },
        ]

  const introCenterFromSanity = homepage?.introSlideshow?.[0]
    ? optimizedImageUrl(homepage.introSlideshow[0], 1400)
    : null

  return {
    heroVideoUrl: homepage?.heroVideo?.asset?.url || '/hero-video.mp4',
    heroPosterUrl:
      introCenterFromSanity ||
      (homepage?.introLeftImage
        ? optimizedImageUrlMobile(homepage.introLeftImage) || '/images/QA-Home.jpg'
        : '/images/QA-Home.jpg'),
    introLeftUrl: homepage?.introLeftImage
      ? optimizedImageUrl(homepage.introLeftImage, 900) || '/images/photo2.jpg'
      : '/images/photo2.jpg',
    introCenterUrl: introCenterFromSanity || '/images/QA-Home.jpg',
    introSlideshowUrls: homepage?.introSlideshow
      ? homepage.introSlideshow
          .map((img: unknown) => optimizedImageUrl(img, 900))
          .filter((url: string | null): url is string => Boolean(url))
      : [],
    introRightUrl: homepage?.introRightImage
      ? optimizedImageUrl(homepage.introRightImage, 1200) || '/images/photo3.jpg'
      : '/images/photo3.jpg',
    dividerImageUrl: homepage?.dividerImage
      ? optimizedImageUrl(homepage.dividerImage, 1600)
      : null,
    testimonials: homepage?.testimonials
      ? homepage.testimonials.map(
          (t: { quote: string; couple: string; location?: string }) => ({
            quote: t.quote,
            couple: t.couple,
            location: t.location,
          })
        )
      : [],
    featuredVideos: safeFilms.map((f: {
      title: string
      slug?: { current: string }
      youtubeUrl?: string
      customThumbnail?: unknown
    }) => {
      const ytId = getYouTubeId(f.youtubeUrl || '')
      const ytThumb = ytId
        ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
        : '/images/photo2.jpg'
      const thumbFromSanity = f.customThumbnail
        ? optimizedImageUrl(f.customThumbnail, 640)
        : null

      return {
        title: f.title,
        slug: f.slug,
        thumbnailUrl: thumbFromSanity || ytThumb,
        videoUrl: f.youtubeUrl || '',
      }
    }),
  }
}
