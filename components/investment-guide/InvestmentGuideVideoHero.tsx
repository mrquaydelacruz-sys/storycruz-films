'use client'

import BackgroundVideo from '@/components/BackgroundVideo'
import { INVESTMENT_GUIDE_IMAGES } from '@/lib/investment-guide-data'

const DEFAULT_HERO_VIDEO = '/inquire-bg.mp4'

type Props = {
  /** Sanity hero video URL from the live investment guide, when available. */
  videoSrc?: string | null
}

export default function InvestmentGuideVideoHero({ videoSrc }: Props) {
  const src = videoSrc?.trim() || DEFAULT_HERO_VIDEO

  return (
    <header className="ig-hero" id="top">
      <BackgroundVideo
        src={src}
        poster={INVESTMENT_GUIDE_IMAGES.hero}
        className="absolute inset-0"
        videoClassName="h-full w-full object-cover opacity-[0.78]"
      />
      <div className="ig-hero-inner">
        <span className="ig-eyebrow">The Investment Guide</span>
        <h1>
          Heirlooms,
          <br />
          <em>not just footage.</em>
        </h1>
        <p>
          We don&apos;t just capture events; we craft heirlooms. One husband-and-wife team, one
          cinematic eye, from a courthouse vow to a ten-hour celebration in the Rockies.
        </p>
        <div className="ig-hero-meta">
          <div>
            <b>Since 2019</b>Telling love stories
          </div>
          <div>
            <b>10–20</b>Couples per year
          </div>
          <div>
            <b>Alberta</b>No travel fees
          </div>
        </div>
      </div>
    </header>
  )
}
