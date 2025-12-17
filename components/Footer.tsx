'use client'
import { useEffect, useState } from 'react';
import { client } from "@/sanity/client";
import { Instagram, Facebook, Youtube, Mail, Twitter, Video, Music2 } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: { [key: string]: any } = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  email: Mail,
  vimeo: Video,
  tiktok: Music2,
};

export default function Footer() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    client.fetch(`*[_type == "siteContent"] | order(_updatedAt desc) [0]{ socialLinks, copyrightText }`)
      .then((res) => {
        console.log("Sanity Footer Data:", res);
        setData(res);
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="relative z-10 py-20 flex flex-col items-center justify-center gap-8 bg-transparent">
      <div className="flex gap-10">
        {data?.socialLinks?.map((link: any, i: number) => {
          const platformKey = link.platform?.toLowerCase().trim();
          const IconComponent = iconMap[platformKey];

          return (
            <motion.a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              // Bright white icons
              className="text-white/60 hover:text-white transition-colors duration-300"
              aria-label={link.platform}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
              whileHover={{ scale: 1.2, y: -8 }}
            >
              {IconComponent ? (
                <IconComponent size={24} strokeWidth={1.5} />
              ) : (
                <span className="text-[10px] uppercase tracking-widest border border-red-500 p-1">
                  {link.platform}
                </span>
              )}
            </motion.a>
          );
        })}
      </div>
      
      {data?.copyrightText && (
        // Bright white copyright text
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
          {data.copyrightText}
        </p>
      )}
    </footer>
  );
} 
// <--- This final bracket was likely missing!