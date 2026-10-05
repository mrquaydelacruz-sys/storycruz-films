'use client'
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Heart, Film, Camera } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: easeOut },
  },
};

export default function ContactSection() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      className="relative overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-black px-6 py-32 md:px-12"
      initial={reducedMotion ? false : 'hidden'}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.15 }}
      variants={reducedMotion ? undefined : container}
    >
      <div className="absolute top-1/4 left-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <motion.div
            variants={reducedMotion ? undefined : fadeUp}
            className="mb-6 inline-flex items-center gap-2"
          >
            <Heart className="h-5 w-5 fill-accent text-accent" />
            <span className="text-xs uppercase tracking-[0.3em] text-accent">Let&apos;s Connect</span>
            <Heart className="h-5 w-5 fill-accent text-accent" />
          </motion.div>

          <motion.h2
            variants={reducedMotion ? undefined : fadeUp}
            className="mb-6 font-serif text-4xl leading-tight text-white md:text-6xl"
          >
            Ready to Tell Your Story?
          </motion.h2>
        </div>

        <motion.div
          variants={reducedMotion ? undefined : fadeUp}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 shadow-2xl md:p-12"
        >
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <p className="text-lg font-light leading-relaxed text-white/90 md:text-xl">
              Every love story is unique, and we believe yours deserves to be captured in a way that&apos;s authentic,
              cinematic, and timeless. Whether you&apos;re planning an intimate elopement in the mountains or a grand
              celebration with all your loved ones, we&apos;re here to document every precious moment.
            </p>

            <p className="text-base leading-relaxed text-neutral-400 md:text-lg">
              Our approach is simple: we get to know you as a couple, understand your vision, and create films
              and photos that feel genuinely <span className="italic text-accent">you</span>. From the quiet,
              tender glances to the joyful celebration on the dance floor, we&apos;ll be there to capture it all.
            </p>

            <motion.div
              className="grid grid-cols-1 gap-6 pt-8 pb-4 md:grid-cols-3"
              variants={reducedMotion ? undefined : container}
            >
              <motion.div variants={reducedMotion ? undefined : fadeUp} className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Film className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Cinematic Films</h3>
                <p className="text-xs leading-relaxed text-neutral-500">
                  Beautifully crafted wedding films that capture the emotion and essence of your day
                </p>
              </motion.div>

              <motion.div variants={reducedMotion ? undefined : fadeUp} className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Camera className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Stunning Photos</h3>
                <p className="text-xs leading-relaxed text-neutral-500">
                  Timeless imagery that tells your story with artistry and authentic emotion
                </p>
              </motion.div>

              <motion.div variants={reducedMotion ? undefined : fadeUp} className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Personal Touch</h3>
                <p className="text-xs leading-relaxed text-neutral-500">
                  A relaxed, friendly approach that makes you feel comfortable and celebrated
                </p>
              </motion.div>
            </motion.div>

            <motion.div variants={reducedMotion ? undefined : fadeUp} className="flex flex-col items-center pt-8">
              <Link
                href="/inquire"
                className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-accent/90"
              >
                Connect With Us
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <p className="mt-4 text-xs uppercase tracking-widest text-neutral-500">
                Let&apos;s start planning your perfect day
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
