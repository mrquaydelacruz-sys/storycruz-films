'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  quote: string;
  couple: string;
  location?: string;
}

export default function Testimonials({ reviews }: { reviews: Review[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (!reviews || reviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews]);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-32 px-6 md:px-12 bg-neutral-900 border-y border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Section Header */}
        <h3 className="text-xs md:text-sm font-sans text-accent uppercase tracking-[0.3em] mb-16">
          Love Letters from our Couples
        </h3>

        {/* The Quote Area - FIXED: Removed 'absolute' positioning */}
        {/* We use min-h to prevent the page from jumping when quote lengths differ */}
        <div className="min-h-[250px] flex items-center justify-center mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center"
            >
              <p className="text-2xl md:text-3xl font-serif text-white/90 leading-relaxed italic mb-8 max-w-3xl">
                "{reviews[currentIndex].quote}"
              </p>
              
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-widest text-white">
                  {reviews[currentIndex].couple}
                </p>
                {reviews[currentIndex].location && (
                  <p className="text-xs text-neutral-500 font-sans">
                    — {reviews[currentIndex].location}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal Dots Navigation */}
        <div className="flex justify-center gap-3">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'bg-accent w-6' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}