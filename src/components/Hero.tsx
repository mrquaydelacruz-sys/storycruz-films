'use client'
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax: Background moves slower than text
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-background">
      
      {/* Video Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <video 
          autoPlay loop muted playsInline 
          className="object-cover w-full h-full opacity-90"
        >
          {/* Placeholder video - replace with your own later */}
          <source src="https://cdn.coverr.co/videos/coverr-wedding-couple-in-the-forest-4628/1080p.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Text Layer */}
      <motion.div style={{ y, opacity }} className="relative z-10 text-center flex flex-col items-center">
        <motion.h1 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 1.2 }} 
          className="text-6xl md:text-9xl font-serif text-offwhite tracking-tighter"
        >
          StoryCruz
        </motion.h1>
        
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: "120px" }} 
          transition={{ delay: 0.8, duration: 1 }} 
          className="h-[2px] bg-accent my-6" 
        />
        
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1, letterSpacing: "0.4em" }} 
          transition={{ delay: 1, duration: 1.5 }} 
          className="text-xs md:text-sm font-sans text-white/80 uppercase"
        >
          Films & Photography
        </motion.p>
      </motion.div>
    </div>
  );
}