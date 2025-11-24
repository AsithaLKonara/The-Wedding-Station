"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { VideoReelProps, SanitizedPost } from "@/types";

export default function VideoReel({ videos }: VideoReelProps) {
  const [selectedVideo, setSelectedVideo] = useState<SanitizedPost | null>(null);

  if (videos.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-400 text-sm uppercase tracking-widest font-light">
          No videos available at the moment
        </p>
      </div>
    );
  }

  const handleVideoClick = (video: SanitizedPost) => {
    setSelectedVideo(video);
  };

  const handleClose = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="group relative w-full aspect-video overflow-hidden bg-black cursor-pointer"
            onClick={() => handleVideoClick(video)}
            role="button"
            tabIndex={0}
            aria-label={`Play video: ${video.caption || "Video"}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleVideoClick(video);
              }
            }}
          >
            <div className="relative w-full h-full">
              {video.thumbnail_url ? (
                <Image
                  src={video.thumbnail_url}
                  alt={video.caption || "Video thumbnail"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
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
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
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

            {/* Caption - Premium style */}
            {video.caption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent transform translate-y-full group-hover:translate-y-0 transition-all duration-500"
              >
                <p className="text-white text-sm font-light leading-relaxed line-clamp-3">
                  {video.caption}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                aria-label="Close video"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="relative aspect-video bg-black overflow-hidden">
                <video
                  src={selectedVideo.media_url}
                  controls
                  autoPlay
                  className="w-full h-full"
                  aria-label={selectedVideo.caption || "Video player"}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {selectedVideo.caption && (
                <div className="mt-6 text-white">
                  <p className="font-light">{selectedVideo.caption}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
