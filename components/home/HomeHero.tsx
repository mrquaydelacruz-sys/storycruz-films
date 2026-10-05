'use client'

import { useRef } from 'react'
import Image from 'next/image'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import BackgroundVideo from '@/components/BackgroundVideo'

type Props = {
  heroVideoUrl: string
  heroPosterUrl: string
}

export default function HomeHero({ heroVideoUrl, heroPosterUrl }: Props) {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -24])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      <BackgroundVideo
        src={heroVideoUrl}
        poster={heroPosterUrl}
        className="absolute inset-0"
        videoClassName="h-full w-full object-cover opacity-60"
        respectReducedMotion
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]" />

      <motion.div
        className="relative z-10 flex flex-col items-center px-6 pb-36 pt-24"
        style={
          reducedMotion
            ? undefined
            : { opacity: textOpacity, y: textY }
        }
      >
        <div className="relative mb-10" style={{ perspective: 900 }}>
          {/* Soft ground shadow — shifts with the spin */}
          {!reducedMotion && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-[-10px] left-1/2 h-4 w-[70%] rounded-[100%] bg-black/50 blur-md"
              initial={{ x: '-50%' }}
              animate={{
                scaleX: [1, 0.4, 1, 0.4, 1],
                opacity: [0.35, 0.6, 0.35, 0.6, 0.35],
                x: ['-50%', '-30%', '-50%', '-70%', '-50%'],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
          )}

          <motion.div
            className="relative h-36 w-36 md:h-48 md:w-48"
            style={{ transformStyle: 'preserve-3d' }}
            animate={
              reducedMotion
                ? undefined
                : {
                    rotateY: 360,
                    filter: [
                      // Face-on — subtle lift, dark shadow only (no white glow)
                      'brightness(1.06) drop-shadow(-6px 10px 16px rgba(0,0,0,0.65))',
                      // Edge
                      'brightness(0.82) drop-shadow(-12px 6px 12px rgba(0,0,0,0.8))',
                      // Back face
                      'brightness(0.94) drop-shadow(6px 10px 14px rgba(0,0,0,0.7))',
                      // Edge
                      'brightness(0.82) drop-shadow(12px 6px 12px rgba(0,0,0,0.8))',
                      // Face-on again
                      'brightness(1.06) drop-shadow(-6px 10px 16px rgba(0,0,0,0.65))',
                    ],
                  }
            }
            transition={
              reducedMotion
                ? undefined
                : { duration: 10, repeat: Infinity, ease: 'linear' }
            }
          >
            <Image
              src="/logo.png"
              alt="StoryCruz Films"
              fill
              priority
              sizes="(max-width: 768px) 144px, 192px"
              className="object-contain"
            />
          </motion.div>
        </div>

        <div className="max-w-lg text-center">
          <h1 className="mb-2 font-serif text-3xl font-normal drop-shadow-2xl md:text-5xl">
            Capturing the Unscripted
          </h1>
          <p className="font-sans text-xs uppercase tracking-widest text-white/70 md:text-sm">
            Cinematic Details That Make Your Story Truly Yours
          </p>
        </div>
      </motion.div>
    </section>
  )
}
