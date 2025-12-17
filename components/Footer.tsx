'use client' // Added because we are using Framer Motion (Client Side)
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
    client.fetch(`*[_type == "siteContent"][0]{ socialLinks, copyrightText }`)
      .then(setData);
  }, []);

  return (
    <footer className="relative z-10 py-20 flex flex-col items-center justify-center gap-8 bg-transparent">
      {/* Social Icons Grid */}
      <div className="flex gap-10">
        {data?.socialLinks?.map((link: any, i: number) => {
          const platformKey = link.platform.toLowerCase().trim();
          const IconComponent = iconMap[platformKey];

          return (
            <motion.a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/40 hover:text-accent transition-colors duration-300"
              aria-label={link.platform}
              // Floating Animation
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2 // Staggers the movement
              }}
              whileHover={{ scale: 1.2, y: -8 }}
            >
              {IconComponent ? (
                <IconComponent size={20} strokeWidth={1.5} />
              ) : (
                <span className="text-[10px] uppercase tracking-widest">{link.platform}</span>
              )}
            </motion.a>
          );
        })}
      </div>
    </footer>
  );
}