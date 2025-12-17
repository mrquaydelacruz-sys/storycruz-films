'use client'
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  videoUrl: string;
}

export default function Hero({ title, subtitle, videoUrl }: HeroProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    // CHANGED: Fixed height to 85vh (85% of screen height) on desktop.
    // This creates that "big but not full screen" look from your reference.
    <div ref={containerRef} className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden flex items-center justify-center bg-background">
      
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10" />
        {videoUrl ? (
          <video 
            autoPlay loop muted playsInline 
            className="object-cover w-full h-full opacity-90"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
           <div className="w-full h-full bg-neutral-900" />
        )}
      </div>

      {/* TEXT LAYER */}
      <motion.div style={{ y, opacity }} className="relative z-10 text-center flex flex-col items-center px-4">
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-5xl md:text-8xl font-serif text-offwhite tracking-tighter"
        >
          {title || "StoryCruz"}
        </motion.h1>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100px" }}
          transition={{ delay: 0.8, duration: 1 }}
          className="h-[1px] bg-accent my-6"
        />

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ delay: 1, duration: 1.5 }}
          className="text-xs md:text-sm font-sans text-white/80 uppercase"
        >
          {subtitle || "Films & Photography"}
        </motion.p>
      </motion.div>
    </div>
  );
}