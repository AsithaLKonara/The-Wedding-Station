"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { FeaturedImage } from "@/types";

interface FeaturedProps {
  images: FeaturedImage[];
  onImageClick?: (image: FeaturedImage) => void;
}

export default function Featured({ images, onImageClick }: FeaturedProps) {
  // Display up to 6 featured images in a grid
  const displayImages = useMemo(() => images.slice(0, 6), [images]);

  if (displayImages.length === 0) {
    return null;
  }

  // Grid layout: 2 columns on mobile, 3 on tablet, 4 on desktop
  const gridCols = displayImages.length <= 2 ? 2 : displayImages.length <= 4 ? 3 : 4;

  return (
    <section id="featured" className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-light mb-4 block">
            Showcase
          </span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif font-light text-gray-900 mb-6 tracking-tight">
            Featured Work
          </h2>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto mb-8">
            Selected highlights from our portfolio
          </p>
          <div className="w-24 h-px bg-gray-300 mx-auto" />
        </motion.div>

        <div
          className={`grid grid-cols-2 md:grid-cols-3 ${
            gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } gap-1`}
        >
          {displayImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative aspect-square overflow-hidden group cursor-pointer"
              onClick={() => onImageClick?.(image)}
            >
              <Image
                src={image.thumbnail_url || image.image_url}
                alt={image.title || image.caption || "Featured image"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              
              {/* Caption overlay (optional) */}
              {(image.title || image.caption) && (
                <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white">
                    {image.title && (
                      <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                    )}
                    {image.caption && (
                      <p className="text-xs text-white/80 line-clamp-2">{image.caption}</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

