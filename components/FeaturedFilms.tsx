'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import WhitePhotoFrame from '@/components/WhitePhotoFrame'

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url?.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

const easeOut = [0.22, 1, 0.36, 1] as const

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

export default function FeaturedFilms({
  films,
  forceVisible,
}: {
  films: any[]
  forceVisible?: boolean
}) {
  const [playingFilm, setPlayingFilm] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()

  if (!films || films.length === 0) return null

  const motionProps = reducedMotion
    ? {}
    : {
        initial: forceVisible ? ('visible' as const) : ('hidden' as const),
        animate: forceVisible ? ('visible' as const) : undefined,
        whileInView: forceVisible ? undefined : ('visible' as const),
        viewport: forceVisible
          ? undefined
          : { once: true, amount: 0.15, margin: '0px 0px -40px 0px' },
        variants: container,
      }

  return (
    <motion.section
      className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12"
      {...motionProps}
    >
      <motion.div
        className="mb-16 flex flex-col items-center text-center"
        variants={reducedMotion ? undefined : fadeUp}
      >
        <h2 className="mb-6 font-serif text-3xl text-white md:text-5xl">
          Featured Films
        </h2>
        <div className="h-px w-20 bg-accent/50" />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-10 md:grid-cols-2"
        variants={reducedMotion ? undefined : container}
      >
        {films.map((film) => {
          const videoId = getYouTubeId(film.youtubeUrl)
          if (!film.slug?.current) return null

          return (
            <motion.div
              key={film.slug.current}
              className="group relative"
              variants={reducedMotion ? undefined : fadeUp}
            >
              <button
                type="button"
                onClick={() => videoId && setPlayingFilm(videoId)}
                className="mb-6 block w-full cursor-pointer text-left"
              >
                <WhitePhotoFrame contentClassName="aspect-video">
                  {videoId ? (
                    <Image
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={film.title}
                      fill
                      loading="lazy"
                      unoptimized
                      className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-white/20">
                      No Video Link
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10">
                      <div className="ml-1 h-0 w-0 border-y-[10px] border-y-transparent border-l-[18px] border-l-white" />
                    </div>
                  </div>
                </WhitePhotoFrame>
              </button>

              <div className="text-center">
                <h3 className="font-serif text-xl text-white transition-colors group-hover:text-accent">
                  {film.title}
                </h3>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        className="mt-16 flex justify-center"
        variants={reducedMotion ? undefined : fadeUp}
      >
        <Link
          href="/films"
          className="border border-white/20 px-8 py-3 text-sm uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black"
        >
          See All Films
        </Link>
      </motion.div>

      {playingFilm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12"
          onClick={() => setPlayingFilm(null)}
        >
          <button className="absolute top-6 right-6 text-4xl font-light text-white/50 hover:text-white">
            &times;
          </button>
          <div className="relative aspect-video w-full max-w-6xl border border-white/10 bg-black shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${playingFilm}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </motion.section>
  )
}
