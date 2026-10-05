'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { frameCopyFor } from '@/components/home/photoFrames'

const MAX_IMAGES = 7
/** Total scroll budget per frame (hold + crossfade), in svh. */
const VH_PER_PHOTO = 60
/**
 * Crossfade as a fraction of one segment.
 * ~0.15 viewport of soft handoff within a 60svh segment → 0.25.
 */
const CROSSFADE_RATIO = 0.25
const EASE = [0.22, 1, 0.36, 1] as const
const ACCENT = '#B89A5E'

type Props = {
  images: string[]
}

function opacityForIndex(progress: number, index: number, count: number): number {
  if (count <= 1) return 1

  const scaled = Math.min(count, Math.max(0, progress * count))
  const fade = CROSSFADE_RATIO
  const fadeInStart = index === 0 ? 0 : index - fade
  const fadeOutEnd = index === count - 1 ? count : index + 1
  const fadeOutStart = index === count - 1 ? count : index + 1 - fade

  if (scaled < fadeInStart || scaled > fadeOutEnd) return 0

  if (index > 0 && scaled < index) {
    return Math.max(0, Math.min(1, (scaled - fadeInStart) / fade))
  }

  if (index < count - 1 && scaled > fadeOutStart) {
    return Math.max(0, Math.min(1, (fadeOutEnd - scaled) / fade))
  }

  return 1
}

function kenBurnsScale(
  progress: number,
  index: number,
  count: number,
  reducedMotion: boolean | null
): number {
  if (reducedMotion || count <= 0) return 1

  const scaled = Math.min(count, Math.max(0, progress * count))
  const local = scaled - index
  if (local < 0 || local > 1) return 1

  // Slow 1.0 → 1.03 across the frame's segment
  return 1 + Math.min(1, Math.max(0, local)) * 0.03
}

function activeIndexFromProgress(progress: number, count: number): number {
  if (count <= 1) return 0
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)))
}

function PhotosCta({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/photos"
      className={`font-sans text-[11px] uppercase tracking-[0.28em] text-white/70 transition-colors hover:text-accent ${className}`}
    >
      See more in Photos →
    </Link>
  )
}

function FrameCaption({
  index,
  reducedMotion,
}: {
  index: number
  reducedMotion: boolean | null
}) {
  const copy = frameCopyFor(index)

  if (reducedMotion) {
    return (
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/40">
          Frame {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="mt-3 font-serif text-2xl leading-snug text-white/90 lg:text-3xl">
          {copy.title}
        </h3>
        <p className="mt-3 max-w-[34ch] font-sans text-sm leading-relaxed text-white/75 lg:text-base">
          {copy.story}
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/40">
          Frame {String(index + 1).padStart(2, '0')}
        </p>
        <motion.h3
          className="mt-3 font-serif text-2xl leading-snug text-white/90 lg:text-3xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {copy.title}
        </motion.h3>
        <motion.p
          className="mt-3 max-w-[34ch] font-sans text-sm leading-relaxed text-white/75 lg:text-base"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.08 }}
        >
          {copy.story}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}

function StackedFrame({
  src,
  index,
  animate,
}: {
  src: string
  index: number
  animate: boolean
}) {
  const copy = frameCopyFor(index)

  return (
    <motion.figure
      className="w-full"
      initial={animate ? { opacity: 0, y: 16 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/20">
        <Image
          src={src}
          alt={copy.title}
          fill
          sizes="(max-width: 768px) 100vw, 512px"
          className="object-cover"
          priority={index === 0}
        />
      </div>
      <figcaption className="mt-4">
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40">
          Frame {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="mt-2 font-serif text-xl text-white/90">{copy.title}</h3>
        <p className="mt-2 max-w-[36ch] font-sans text-sm leading-relaxed text-white/75">
          {copy.story}
        </p>
      </figcaption>
    </motion.figure>
  )
}

export default function IntroPhotoStory({ images }: Props) {
  const reducedMotion = useReducedMotion()
  const photos = useMemo(() => images.slice(0, MAX_IMAGES), [images])
  const count = photos.length
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(v)
  })

  if (count === 0) return null

  const active = activeIndexFromProgress(progress, count)

  // Reduced motion: static stack, no pin flourishes
  if (reducedMotion) {
    return (
      <section className="relative z-10 px-4 pb-16 pt-8 md:px-8" aria-label="Featured photographs">
        <div className="mx-auto flex max-w-lg flex-col gap-10">
          {photos.map((src, i) => (
            <StackedFrame key={src} src={src} index={i} animate={false} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <PhotosCta />
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Mobile: stacked reveals, no pin */}
      <section
        className="relative z-10 px-4 pb-16 pt-8 md:hidden"
        aria-label="Featured photographs"
      >
        <div className="mx-auto flex max-w-lg flex-col gap-10">
          {photos.map((src, i) => (
            <StackedFrame key={src} src={src} index={i} animate />
          ))}
        </div>
        <div className="mt-12 text-center">
          <PhotosCta />
        </div>
      </section>

      {/* Desktop: pin-and-swap */}
      <section
        ref={sectionRef}
        className="relative z-10 hidden md:block"
        style={{ height: `calc(${count * VH_PER_PHOTO}svh)` }}
        aria-label="Featured photographs"
      >
        <div className="sticky top-0 flex h-[100svh] items-center justify-center px-8 pt-20">
          <div className="relative flex w-full max-w-5xl items-center justify-center gap-10 lg:gap-16">
            <div className="relative aspect-[3/4] h-[min(72svh,680px)] w-auto max-w-[min(42vw,480px)] shrink-0 overflow-hidden border border-white/20">
              {photos.map((src, i) => {
                const opacity = opacityForIndex(progress, i, count)
                const scale = kenBurnsScale(progress, i, count, reducedMotion)
                const eager = i === active || i === active + 1 || i === 0
                if (opacity <= 0.001 && !eager) return null

                const copy = frameCopyFor(i)

                return (
                  <div
                    key={src}
                    className="absolute inset-0"
                    style={{
                      opacity,
                      transform: `scale(${scale})`,
                      willChange:
                        opacity > 0 && opacity < 1 ? 'opacity, transform' : undefined,
                    }}
                    aria-hidden={i !== active}
                  >
                    <Image
                      src={src}
                      alt={copy.title}
                      fill
                      sizes="(min-width: 768px) 42vw, 100vw"
                      className="object-cover"
                      priority={i === 0}
                      loading={eager ? 'eager' : 'lazy'}
                    />
                  </div>
                )
              })}
            </div>

            <div className="flex w-[min(18rem,24vw)] shrink-0 flex-col gap-8">
              <FrameCaption index={active} reducedMotion={reducedMotion} />

              <div className="flex flex-col gap-2.5" aria-hidden>
                {photos.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-px origin-left"
                    animate={{
                      width: i === active ? 40 : 24,
                      backgroundColor: i === active ? ACCENT : 'rgba(255,255,255,0.28)',
                    }}
                    transition={{ duration: 0.22, ease: EASE }}
                  />
                ))}
              </div>

              <PhotosCta className="mt-1" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
