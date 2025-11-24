"use client";

import { useMemo } from "react";
import MediaCard from "./MediaCard";
import type { GalleryProps } from "@/types";

export default function Gallery({
  posts,
  onMediaClick,
  columns = 3,
}: GalleryProps) {
  // Filter to photos only for gallery
  const photoPosts = useMemo(
    () => posts.filter((post) => post.type === "photo"),
    [posts]
  );

  if (photoPosts.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-400 text-sm uppercase tracking-widest font-light">
          No photos available at the moment
        </p>
      </div>
    );
  }

  // Premium masonry-style grid with varying heights
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
      role="region"
      aria-label="Photo gallery"
    >
      {photoPosts.map((post, index) => {
        // Create varied heights for masonry effect
        const heightVariants = [
          "aspect-[4/5]",
          "aspect-square",
          "aspect-[5/4]",
          "aspect-[3/4]",
        ];
        const heightClass =
          heightVariants[index % heightVariants.length];

        return (
          <div key={post.id} className={heightClass}>
            <MediaCard
              post={post}
              onOpen={onMediaClick}
              index={index}
            />
          </div>
        );
      })}
    </div>
  );
}
