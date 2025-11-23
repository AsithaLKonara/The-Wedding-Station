"use client";

import { useMemo } from "react";
import MediaCard from "./MediaCard";
import type { GalleryProps, SanitizedPost } from "@/types";

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
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No photos available at the moment.</p>
      </div>
    );
  }

  // Create masonry-style grid
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[3]} gap-6`}
      role="region"
      aria-label="Photo gallery"
    >
      {photoPosts.map((post, index) => (
        <MediaCard
          key={post.id}
          post={post}
          onOpen={onMediaClick}
          index={index}
        />
      ))}
    </div>
  );
}

