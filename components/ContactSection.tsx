'use client'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Heart, Film, Camera } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="relative py-20 md:py-32 px-6 md:px-12 pb-28 md:pb-32 bg-gradient-to-b from-black via-neutral-950 to-black overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <Heart className="w-5 h-5 text-accent fill-accent" />
            <span className="text-xs text-accent uppercase tracking-[0.3em]">Let's Connect</span>
            <Heart className="w-5 h-5 text-accent fill-accent" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight"
          >
            Ready to Tell Your Story?
          </motion.h2>
        </div>

        {/* Description Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-12 shadow-2xl"
        >
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
              Every love story is unique, and we believe yours deserves to be captured in a way that's authentic,
              cinematic, and timeless. Whether you're planning an intimate elopement in the mountains or a grand
              celebration with all your loved ones, we're here to document every precious moment.
            </p>

            <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
              Our approach is simple: we get to know you as a couple, understand your vision, and create films
              and photos that feel genuinely <span className="text-accent italic">you</span>. From the quiet,
              tender glances to the joyful celebration on the dance floor, we'll be there to capture it all.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 pt-8 md:pt-8 pb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Film className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Cinematic Films</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Beautifully crafted wedding films that capture the emotion and essence of your day
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Stunning Photos</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Timeless imagery that tells your story with artistry and authentic emotion
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Personal Touch</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  A relaxed, friendly approach that makes you feel comfortable and celebrated
                </p>
              </motion.div>
            </div>

            {/* CTA Button — extra top margin on mobile so it sits above footer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-10 md:pt-8 pb-4 flex flex-col items-center"
            >
              <motion.div
                className="relative inline-block"
                animate={{
                  scale: [1, 1.02, 1, 1.02, 1],
                  boxShadow: [
                    '0 0 20px rgba(212, 175, 55, 0.25)',
                    '0 0 32px rgba(212, 175, 55, 0.4)',
                    '0 0 20px rgba(212, 175, 55, 0.25)',
                  ],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Link
                  href="/inquire"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wider text-sm rounded-full transition-colors duration-300"
                >
                  Connect With Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>

              <p className="text-xs text-neutral-500 mt-4 uppercase tracking-widest">
                Let&apos;s start planning your perfect day
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
