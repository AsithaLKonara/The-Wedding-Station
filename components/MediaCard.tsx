"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { MediaCardProps } from "@/types";

export default function MediaCard({ post, onOpen, index = 0 }: MediaCardProps) {
  const handleClick = () => {
    if (onOpen) {
      onOpen(post);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group relative w-full h-full overflow-hidden bg-black cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${post.type === "video" ? "video" : "photo"}: ${post.caption || "Media"}`}
    >
      {post.type === "video" ? (
        <div className="relative w-full h-full">
          {post.thumbnail_url ? (
            <Image
              src={post.thumbnail_url}
              alt={post.caption || "Video thumbnail"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-white/30"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          )}
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-500">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 border-2 border-white/90 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/10 group-hover:bg-white/20 transition-all duration-500"
            >
              <svg
                className="w-8 h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={post.media_url}
            alt={post.caption || "Photo"}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      {/* Caption overlay - Premium style */}
      {post.caption && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent transform translate-y-full group-hover:translate-y-0 transition-all duration-500"
        >
          <p className="text-white text-sm font-light leading-relaxed line-clamp-3">
            {post.caption}
          </p>
        </motion.div>
      )}

      {/* Minimal type indicator */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-light uppercase tracking-widest">
          {post.type}
        </span>
      </div>
    </motion.div>
  );
}
