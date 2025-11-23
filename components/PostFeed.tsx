"use client";

import { useState, useEffect } from "react";
import type { PostFeedProps, SanitizedPost, PostsApiResponse } from "@/types";

export default function PostFeed({
  initialPosts = [],
  autoRefresh = false,
  refreshInterval = 300000, // 5 minutes
}: PostFeedProps) {
  const [posts, setPosts] = useState<SanitizedPost[]>(initialPosts);
  const [loading, setLoading] = useState(!initialPosts.length);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/fb/fetch");
      const data: PostsApiResponse = await response.json();

      if (data.posts) {
        setPosts(data.posts);
        setLastUpdated(new Date());
      } else {
        setError(data.error || "Failed to fetch posts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch if no initial posts
    if (!initialPosts.length) {
      fetchPosts();
    }

    // Auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(fetchPosts, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, initialPosts.length]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-500">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchPosts}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No posts available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lastUpdated && (
        <div className="text-sm text-gray-500 text-center">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden p-4"
          >
            {post.type === "photo" && (
              <img
                src={post.media_url}
                alt={post.caption || "Post"}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            {post.type === "video" && (
              <video
                src={post.media_url}
                controls
                className="w-full h-64 object-cover rounded-lg mb-4"
              >
                Your browser does not support the video tag.
              </video>
            )}
            {post.caption && (
              <p className="text-gray-700 mb-2 line-clamp-3">{post.caption}</p>
            )}
            <a
              href={post.source_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View on Facebook →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

