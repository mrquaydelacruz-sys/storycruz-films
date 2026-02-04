'use client'
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const ph1 = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";
const ph2 = "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=800&auto=format&fit=crop";
const ph3 = "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop";

export default function Gallery() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start end', 'end start'] });
  
  // Parallax speeds for columns
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]); // Moves faster
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  const images = [ph1, ph2, ph3, ph1, ph2, ph3];

  return (
    <div ref={container} className="relative min-h-[150vh] bg-background flex gap-4 p-4 md:p-10 overflow-hidden">
      
      {/* Column 1 */}
      <motion.div style={{ y: y1 }} className="flex flex-col gap-8 w-1/3">
        {images.slice(0, 3).map((src, i) => (
          <div key={i} className="relative w-full aspect-[2/3] border-[5px] border-[#f7f7f7] rounded-[5px] overflow-hidden">
            <Image src={src} alt="wedding" fill className="object-cover" />
          </div>
        ))}
      </motion.div>

      {/* Column 2 */}
      <motion.div style={{ y: y2 }} className="flex flex-col gap-8 w-1/3 -mt-[15vh]">
        {images.slice(1, 4).map((src, i) => (
          <div key={i} className="relative w-full aspect-[2/3] border-[5px] border-[#f7f7f7] rounded-[5px] overflow-hidden">
            <Image src={src} alt="wedding" fill className="object-cover" />
          </div>
        ))}
      </motion.div>

      {/* Column 3 */}
      <motion.div style={{ y: y3 }} className="flex flex-col gap-8 w-1/3">
        {images.slice(2, 5).map((src, i) => (
          <div key={i} className="relative w-full aspect-[2/3] border-[5px] border-[#f7f7f7] rounded-[5px] overflow-hidden">
            <Image src={src} alt="wedding" fill className="object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}