'use client'

import { motion, useReducedMotion } from 'framer-motion'

type Testimonial = {
  quote: string
  couple: string
  location?: string
}

type Props = {
  testimonials: Testimonial[]
}

const easeOut = [0.22, 1, 0.36, 1] as const

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
}

export default function HomeTestimonials({ testimonials }: Props) {
  const reducedMotion = useReducedMotion()
  const items = testimonials.slice(0, 3)

  if (items.length === 0) return null

  return (
    <motion.section
      className="px-4 py-20 md:px-8"
      initial={reducedMotion ? false : 'hidden'}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.15 }}
      variants={reducedMotion ? undefined : container}
    >
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          className="mb-3 text-2xl tracking-[0.4em] text-white/90"
          aria-hidden
          variants={reducedMotion ? undefined : fadeUp}
        >
          ☆ ☆ ☆ ☆ ☆
        </motion.div>
        <motion.h2
          className="mb-2 font-serif text-3xl text-white md:text-5xl"
          variants={reducedMotion ? undefined : fadeUp}
        >
          Kind Words From Our Couples
        </motion.h2>
        <motion.p
          className="mb-12 font-sans text-sm uppercase tracking-widest text-neutral-400"
          variants={reducedMotion ? undefined : fadeUp}
        >
          Love Letters That Inspire Us
        </motion.p>
        <motion.div
          className="flex flex-col gap-8"
          variants={reducedMotion ? undefined : container}
        >
          {items.map((t, i) => (
            <motion.blockquote
              key={`${t.couple}-${i}`}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-8 text-left"
              variants={reducedMotion ? undefined : fadeUp}
            >
              <p className="mb-6 font-serif text-lg italic text-white/90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="font-sans text-sm font-bold uppercase text-neutral-400">
                — {t.couple}
              </footer>
              {t.location && (
                <p className="mt-2 font-sans text-xs text-neutral-600">{t.location}</p>
              )}
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
