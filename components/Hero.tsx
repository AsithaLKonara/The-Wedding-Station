"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { HeroContent } from "@/types";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const response = await fetch("/api/content/hero");
        const data = await response.json();
        if (data.content) {
          setHeroContent(data.content);
        }
      } catch (error) {
        console.error("Error loading hero content:", error);
      }
    };
    loadHeroContent();
  }, []);

  const siteTitle = heroContent?.title || process.env.NEXT_PUBLIC_SITE_TITLE || "The Wedding Station";
  const subtitle = heroContent?.subtitle || "Capturing Moments, Creating Memories";
  const backgroundImage = heroContent?.background_image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
          transition: "transform 0.1s ease-out",
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
      >
        {/* Decorative Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 100 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-px bg-white/30 mx-auto mb-8"
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-light text-white mb-6 tracking-tight leading-none"
        >
          {siteTitle.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
              className="block"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 100 }}
          transition={{ duration: 1, delay: 1 }}
          className="h-px bg-white/30 mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl text-white/80 font-light tracking-widest uppercase mb-12 letter-spacing-wide"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          {heroContent?.cta_primary && (
            <motion.a
              href={heroContent.cta_primary.link}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-black font-medium text-sm uppercase tracking-widest hover:bg-white/90 transition-all duration-300"
            >
              {heroContent.cta_primary.text}
            </motion.a>
          )}
          {heroContent?.cta_secondary && (
            <motion.a
              href={heroContent.cta_secondary.link}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border border-white/50 text-white font-medium text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all duration-300"
            >
              {heroContent.cta_secondary.text}
            </motion.a>
          )}
          {!heroContent?.cta_primary && !heroContent?.cta_secondary && (
            <>
              <motion.a
                href="#gallery"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-black font-medium text-sm uppercase tracking-widest hover:bg-white/90 transition-all duration-300"
              >
                View Portfolio
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 border border-white/50 text-white font-medium text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                Get In Touch
              </motion.a>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-white/60"
        >
          <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
          <div className="w-px h-12 bg-white/30 relative overflow-hidden">
            <motion.div
              animate={{ y: [0, 40, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-8 bg-white/60"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
