'use client'

import { useMemo } from 'react'
import Footer from '@/components/Footer'
import FeaturedFilms from '@/components/FeaturedFilms'
import ContactSection from '@/components/ContactSection'
import HomeHero from '@/components/home/HomeHero'
import PhotoTrio from '@/components/home/PhotoTrio'
import HomeTestimonials from '@/components/home/HomeTestimonials'
import type { VisionData } from '@/app/vision/types'
import type { SiteChromeData } from '@/lib/site-chrome'

type Props = {
  data: VisionData
  chrome: SiteChromeData
}

export default function HomePage({ data, chrome }: Props) {
  const centerUrls = useMemo(() => {
    const slideshow =
      data.introSlideshowUrls && data.introSlideshowUrls.length > 0
        ? data.introSlideshowUrls
        : [data.introCenterUrl]
    return [...new Set(slideshow.filter(Boolean))]
  }, [data.introSlideshowUrls, data.introCenterUrl])

  return (
    <main className="overflow-x-clip bg-[#050505] font-serif text-white">
      <HomeHero heroVideoUrl={data.heroVideoUrl} heroPosterUrl={data.heroPosterUrl} />

      <PhotoTrio
        leftUrl={data.introLeftUrl}
        centerUrls={centerUrls}
        rightUrl={data.introRightUrl}
        backgroundUrl={data.dividerImageUrl}
      />

      <FeaturedFilms films={data.featuredVideos.map((v) => ({ ...v, youtubeUrl: v.videoUrl }))} />

      {data.testimonials && data.testimonials.length > 0 && (
        <HomeTestimonials testimonials={data.testimonials} />
      )}

      <ContactSection />
      <Footer data={chrome} />
    </main>
  )
}
