'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Review {
  quote: string;
  couple: string;
  location?: string;
}

export default function Testimonials({ reviews }: { reviews: Review[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate every 7 seconds
  useEffect(() => {
    if (!reviews || reviews.length === 0 || isPaused) return;
    const timer = setInterval(() => {
      goToNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [reviews, isPaused, currentIndex]);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  if (!reviews || reviews.length === 0) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <section
      className="relative py-32 px-6 md:px-12 bg-gradient-to-b from-black via-neutral-900 to-black border-y border-white/5 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
            Kind Words From Our Couples
          </h2>
          <p className="text-sm md:text-base text-neutral-400 uppercase tracking-[0.3em]">
            Love Letters That Inspire Us
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[350px] md:min-h-[300px] flex items-center">

          {/* Previous Button */}
          <button
            onClick={goToPrev}
            className="absolute left-0 md:-left-16 z-20 w-12 h-12 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 flex items-center justify-center transition-all duration-300 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-white/60 group-hover:text-accent transition-colors" />
          </button>

          {/* Quote Area */}
          <div className="flex-1 px-4 md:px-20 text-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="flex flex-col items-center justify-center"
              >
                {/* Quote */}
                <div className="relative mb-10">
                  <span className="absolute -top-6 -left-4 text-6xl md:text-8xl font-serif text-accent/20">"</span>
                  <p className="text-xl md:text-3xl font-serif text-white/90 leading-relaxed italic max-w-3xl relative z-10 px-4">
                    {reviews[currentIndex].quote}
                  </p>
                  <span className="absolute -bottom-8 -right-4 text-6xl md:text-8xl font-serif text-accent/20 rotate-180">"</span>
                </div>

                {/* Author Info */}
                <div className="space-y-2 mt-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-4" />
                  <p className="text-base md:text-lg font-sans tracking-wider text-accent">
                    {reviews[currentIndex].couple}
                  </p>
                  {reviews[currentIndex].location && (
                    <p className="text-xs md:text-sm text-neutral-500 font-sans tracking-widest uppercase">
                      {reviews[currentIndex].location}
                    </p>
                  )}
                  <div className="flex gap-1 justify-center mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-accent/60 text-accent/60" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-0 md:-right-16 z-20 w-12 h-12 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 flex items-center justify-center transition-all duration-300 group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-accent transition-colors" />
          </button>
        </div>

        {/* Enhanced Dot Navigation */}
        <div className="flex justify-center gap-3 mt-16">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`relative transition-all duration-500 ${
                index === currentIndex
                  ? 'w-12 h-3'
                  : 'w-3 h-3'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? 'bg-accent shadow-lg shadow-accent/50'
                  : 'bg-white/20 hover:bg-white/40'
              }`} />
              {index === currentIndex && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-center mt-8 text-sm text-neutral-600 font-mono">
          {String(currentIndex + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
        </div>
      </div>
    </section>
  );
}
