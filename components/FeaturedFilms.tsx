'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Helper to extract YouTube ID from any URL format
function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  }),
};

const popIn = {
  hidden: { opacity: 0, scale: 0.82, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

const titleReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 24 },
  },
};

export default function FeaturedFilms({ films }: { films: any[] }) {
  const [playingFilm, setPlayingFilm] = useState<string | null>(null);

  if (!films || films.length === 0) return null;

  return (
    <motion.section
      className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.55, margin: '80px 0px 0px 0px' }}
      variants={container}
    >
      <motion.div
        className="flex flex-col items-center text-center mb-16"
        variants={titleReveal}
      >
        <motion.h2
          className="text-3xl md:text-5xl font-serif text-white mb-6"
          variants={titleReveal}
        >
          Featured Films
        </motion.h2>
        <motion.div
          className="h-[1px] w-20 bg-accent/50"
          variants={titleReveal}
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-10"
        variants={container}
      >
        {films.map((film) => {
          const videoId = getYouTubeId(film.youtubeUrl);
          if (!film.slug?.current) return null;

          return (
            <motion.div
              key={film.slug.current}
              className="group relative"
              variants={popIn}
            >
              <button 
                onClick={() => videoId && setPlayingFilm(videoId)}
                className="w-full relative aspect-video bg-neutral-900/40 border border-white/10 overflow-hidden mb-6 cursor-pointer block backdrop-blur-sm"
              >
                {/* 1. YOUTUBE THUMBNAIL LOGIC */}
                {videoId ? (
                  <Image 
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                    alt={film.title} 
                    fill 
                    unoptimized // Essential for external YouTube images
                    className="object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-white/20">
                    No Video Link
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </button>

              <div className="text-center">
                <h3 className="text-xl font-serif text-white group-hover:text-accent transition-colors">
                  {film.title}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="flex justify-center mt-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.2 }}
      >
        <Link
          href="/films"
          className="px-8 py-3 border border-white/20 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          See All Films
        </Link>
      </motion.div>

      {playingFilm && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-md"
          onClick={() => setPlayingFilm(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white text-4xl font-light">
            &times;
          </button>
          <div className="w-full max-w-6xl aspect-video relative bg-black shadow-2xl border border-white/10">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${playingFilm}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </motion.section>
  );
}