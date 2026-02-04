'use client'
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/client'; // Import our new helper

// We tell the component to expect an array of images
export default function Gallery({ images }: { images: any[] }) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ['start end', 'end start'] });
  
  // Create 3 different speeds (Parallax)
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]); // Fast column
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // If no images exist yet, show a warning (debugging)
  if (!images || images.length === 0) return null;

  return (
    <div ref={container} className="relative min-h-[150vh] bg-background flex gap-4 p-4 md:p-10 overflow-hidden">
      
      {/* COLUMN 1 */}
      <motion.div style={{ y: y1 }} className="flex flex-col gap-8 w-1/3">
        {images.slice(0, 3).map((img, i) => (
          <div key={i} className="relative w-full aspect-[2/3] border-[5px] border-[#f7f7f7] rounded-[5px] overflow-hidden">
            <Image 
              src={urlFor(img).width(800).url()} 
              alt="Wedding Photo" 
              fill 
              className="object-cover" 
            />
          </div>
        ))}
      </motion.div>

      {/* COLUMN 2 */}
      <motion.div style={{ y: y2 }} className="flex flex-col gap-8 w-1/3 -mt-[15vh]">
        {images.slice(3, 6).map((img, i) => (
          <div key={i} className="relative w-full aspect-[2/3] border-[5px] border-[#f7f7f7] rounded-[5px] overflow-hidden">
            <Image 
              src={urlFor(img).width(800).url()} 
              alt="Wedding Photo" 
              fill 
              className="object-cover" 
            />
          </div>
        ))}
      </motion.div>

      {/* COLUMN 3 */}
      <motion.div style={{ y: y3 }} className="flex flex-col gap-8 w-1/3">
        {images.slice(6, 9).map((img, i) => (
          <div key={i} className="relative w-full aspect-[2/3] border-[5px] border-[#f7f7f7] rounded-[5px] overflow-hidden">
             <Image 
               src={urlFor(img).width(800).url()} 
               alt="Wedding Photo" 
               fill 
               className="object-cover" 
             />
          </div>
        ))}
      </motion.div>
    </div>
  )
}