export type VisionData = {
  heroVideoUrl: string
  heroPosterUrl: string
  introLeftUrl: string
  introCenterUrl: string
  introSlideshowUrls?: string[]
  introRightUrl: string
  dividerImageUrl?: string | null
  testimonials?: {
    quote: string
    couple: string
    location?: string
  }[]
  featuredVideos: {
    title: string
    slug?: { current: string }
    thumbnailUrl: string
    videoUrl: string
  }[]
}
