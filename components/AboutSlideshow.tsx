'use client'
import { useState, useEffect } from 'react';
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutSlideshow({ images }: { images: any[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    // UPDATED: Removed "border-y" so there are no lines.
    <div className="relative w-full h-[35vh] md:h-[45vh] overflow-hidden bg-black">
      
      {/* --- STATIC OVERLAYS (Sit on top of images) --- */}
      {/* 1. Top Fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/70 to-transparent z-20 pointer-events-none" />
      {/* 2. Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent z-20 pointer-events-none" />
      {/* 3. Overall Dark Tint */}
      <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />


      {/* --- FADING IMAGES --- */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={urlFor(images[index]).url()}
            alt="Slideshow"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

    </div>
  );
}