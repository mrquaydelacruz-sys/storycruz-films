'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  poster?: string
  className?: string
  videoClassName?: string
  /** On viewports ≤768px, wait until idle before autoplay to improve first paint. */
  deferOnMobile?: boolean
  /** When true, skip autoplay under prefers-reduced-motion and show a play control. */
  respectReducedMotion?: boolean
}

export default function BackgroundVideo({
  src,
  poster,
  className = 'absolute inset-0',
  videoClassName = 'h-full w-full object-cover',
  deferOnMobile = true,
  respectReducedMotion = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [shouldPlay, setShouldPlay] = useState(!deferOnMobile)
  const [userPlaying, setUserPlaying] = useState(false)

  useEffect(() => {
    if (!respectReducedMotion) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [respectReducedMotion])

  useEffect(() => {
    if (respectReducedMotion && reducedMotion) {
      setShouldPlay(false)
      return
    }

    if (!deferOnMobile) {
      setShouldPlay(true)
      return
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (!isMobile) {
      setShouldPlay(true)
      return
    }

    const start = () => setShouldPlay(true)

    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(start, { timeout: 2500 })
      return () => cancelIdleCallback(id)
    }

    const timer = setTimeout(start, 400)
    return () => clearTimeout(timer)
  }, [deferOnMobile, respectReducedMotion, reducedMotion])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    if (shouldPlay || userPlaying) {
      void el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [shouldPlay, userPlaying, src])

  const showPlayControl = respectReducedMotion && reducedMotion && !userPlaying

  return (
    <div className={className} aria-hidden={!showPlayControl}>
      <video
        ref={videoRef}
        autoPlay={shouldPlay && !reducedMotion}
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
        className={videoClassName}
      >
        <source src={src} type="video/mp4" />
      </video>

      {showPlayControl && (
        <button
          type="button"
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 border border-white/30 bg-black/70 px-5 py-2 font-sans text-[10px] uppercase tracking-[0.3em] text-white transition-colors hover:border-white/60"
          onClick={() => setUserPlaying(true)}
          aria-label="Play hero video"
        >
          Play video
        </button>
      )}
    </div>
  )
}
