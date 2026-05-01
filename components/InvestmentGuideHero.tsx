import { Star } from 'lucide-react'
import {
  INVESTMENT_GUIDE_EYEBROW,
  INVESTMENT_GUIDE_TAGLINE,
} from '@/lib/investment-guide-copy'

type Props = {
  title: string
  /** MP4 URL from Hidden Pricing hero video, or fallback. */
  videoSrc: string
}

export default function InvestmentGuideHero({ title, videoSrc }: Props) {
  return (
    <section className="relative flex h-[85vh] w-full items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />

      <div className="relative z-10 mx-auto mt-10 max-w-5xl px-6 text-center animate-in fade-in zoom-in duration-1000">
        <div className="mb-6 flex justify-center gap-2 text-yellow-500/80">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="currentColor" />
          ))}
        </div>
        <p className="mb-8 text-xs font-bold uppercase tracking-[0.4em] text-white/60 md:text-sm">
          {INVESTMENT_GUIDE_EYEBROW}
        </p>
        <h1 className="mb-8 font-serif text-5xl leading-tight text-white md:text-7xl lg:text-8xl">
          {title.trim() || 'Your Legacy.'}
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-white/80 md:text-xl">
          {INVESTMENT_GUIDE_TAGLINE}
        </p>
      </div>
    </section>
  )
}
