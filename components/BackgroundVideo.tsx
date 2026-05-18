'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  poster?: string
  className?: string
  videoClassName?: string
  /** On viewports ≤768px, wait until idle before autoplay to improve first paint. */
  deferOnMobile?: boolean
}

export default function BackgroundVideo({
  src,
  poster,
  className = 'absolute inset-0',
  videoClassName = 'h-full w-full object-cover',
  deferOnMobile = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldPlay, setShouldPlay] = useState(!deferOnMobile)

  useEffect(() => {
    if (!deferOnMobile) return

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
  }, [deferOnMobile])

  useEffect(() => {
    const el = videoRef.current
    if (!shouldPlay || !el) return
    void el.play().catch(() => {})
  }, [shouldPlay, src])

  return (
    <div className={className} aria-hidden>
      <video
        ref={videoRef}
        autoPlay={shouldPlay}
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
        className={videoClassName}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
