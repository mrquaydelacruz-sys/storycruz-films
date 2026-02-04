'use client'
import { motion } from "framer-motion";

export default function SignatureAnimation({ text }: { text: string }) {
  const parts = text.includes(',') ? text.split(',') : [text];

  return (
    <div className="flex flex-col items-start">
      {parts.map((part, i) => (
        <div key={i} className={`relative ${i > 0 ? 'mt-2 pl-8' : ''}`}>
          
          <motion.span
            // I changed text-accent to text-white just in case 'accent' isn't defined in your Tailwind config
            className="block text-4xl md:text-6xl text-white opacity-90 leading-[1.2] whitespace-nowrap pb-2 pr-2"
            style={{ fontFamily: 'var(--font-cursive), cursive' }}
            
            // --- THE FIX: CLIP-PATH ---
            // This acts like a sliding window mask instead of squishing the width
            initial={{ clipPath: "inset(0 100% 0 0)" }} 
            animate={{ clipPath: "inset(0 0% 0 0)" }}   
            
            transition={{ 
              duration: 3,
              ease: "easeInOut", 
              delay: i * 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2
            }}
          >
            {part.trim()}{i === 0 && parts.length > 1 ? ',' : ''}
          </motion.span>
          
        </div>
      ))}
    </div>
  );
}