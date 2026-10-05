'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import WhitePhotoFrame from '@/components/WhitePhotoFrame'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = {
  leftUrl?: string | null
  centerUrls: string[]
  rightUrl?: string | null
  backgroundUrl?: string | null
}

function CenterSlideshow({ urls, reducedMotion }: { urls: string[]; reducedMotion: boolean | null }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion || urls.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % urls.length)
    }, 4000)
    return () => window.clearInterval(id)
  }, [urls.length, reducedMotion])

  if (urls.length === 0) return null

  return (
    <div className="absolute inset-0">
      {urls.map((src, i) => {
        const active = i === index
        return (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{
              opacity: active ? 1 : 0,
              zIndex: active ? 1 : 0,
            }}
            aria-hidden={!active}
          >
            <Image
              src={src}
              alt="StoryCruz wedding photograph"
              fill
              sizes="(max-width: 768px) 70vw, 30vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        )
      })}
    </div>
  )
}

/**
 * Live-style photo trio over the divider panorama.
 * Uses a fluid grid so left + right stay fully in view at any desktop width.
 */
export default function PhotoTrio({ leftUrl, centerUrls, rightUrl, backgroundUrl }: Props) {
  const reducedMotion = useReducedMotion()
  const centers = centerUrls.filter(Boolean)
  const mobileSlides = centers.length
    ? centers
    : ([leftUrl, rightUrl].filter(Boolean) as string[])

  if (!leftUrl && centers.length === 0 && !rightUrl) return null

  return (
    <section
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-x-clip py-24 md:py-16"
      aria-label="Featured photographs"
    >
      {backgroundUrl && (
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={backgroundUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-black/35" />
        </div>
      )}

      {/* Mobile: single framed slideshow */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-md px-4 md:hidden"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <WhitePhotoFrame contentClassName="aspect-[3/4]">
          <CenterSlideshow urls={mobileSlides} reducedMotion={reducedMotion} />
        </WhitePhotoFrame>
        <div className="mt-8 text-center">
          <Link
            href="/photos"
            className="font-sans text-[11px] uppercase tracking-[0.28em] text-white/70 transition-colors hover:text-accent"
          >
            See more in Photos →
          </Link>
        </div>
      </motion.div>

      {/* Desktop: fluid 3-column grid — always fits viewport width */}
      <motion.div
        className="relative z-10 hidden w-full px-[clamp(1rem,3vw,2.5rem)] md:block"
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <div
          className="mx-auto grid w-full max-w-[1100px] items-center gap-[clamp(0.75rem,2vw,1.5rem)]"
          style={{
            gridTemplateColumns: 'minmax(0,0.85fr) minmax(0,0.85fr) minmax(0,1.35fr)',
          }}
        >
          {leftUrl && (
            <WhitePhotoFrame contentClassName="aspect-[17/24]">
              <Image
                src={leftUrl}
                alt="Wedding photograph"
                fill
                sizes="22vw"
                className="object-cover"
                priority
              />
            </WhitePhotoFrame>
          )}

          <WhitePhotoFrame contentClassName="aspect-[17/24]">
            <CenterSlideshow
              urls={centers.length ? centers : leftUrl ? [leftUrl] : []}
              reducedMotion={reducedMotion}
            />
          </WhitePhotoFrame>

          {rightUrl && (
            <WhitePhotoFrame contentClassName="aspect-[3/2]">
              <Image
                src={rightUrl}
                alt="Wedding photograph"
                fill
                sizes="36vw"
                className="object-cover"
              />
            </WhitePhotoFrame>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/photos"
            className="font-sans text-[11px] uppercase tracking-[0.28em] text-white/70 transition-colors hover:text-accent"
          >
            See more in Photos →
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
