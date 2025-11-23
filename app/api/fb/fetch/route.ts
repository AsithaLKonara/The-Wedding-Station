import { NextRequest, NextResponse } from "next/server";
import { fetchAndNormalizePosts } from "@/lib/fb";
import { cacheManager } from "@/lib/cache";
import type { PostsApiResponse } from "@/types";

/**
 * GET /api/fb/fetch
 * Fetches Facebook posts with caching
 */
export async function GET(request: NextRequest) {
  try {
    const pageId = process.env.FB_PAGE_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
      return NextResponse.json(
        {
          posts: [],
          cached: false,
          error: "Facebook API credentials not configured",
        },
        { status: 500 }
      );
    }

    // Check cache first
    const cachedPosts = await cacheManager.get();
    const cacheAge = await cacheManager.getCacheAge();

    if (cachedPosts && cachedPosts.length > 0) {
      const response: PostsApiResponse = {
        posts: cachedPosts,
        cached: true,
        cache_age_seconds: cacheAge || undefined,
        last_updated: new Date().toISOString(),
      };
      return NextResponse.json(response);
    }

    // Cache miss - fetch from Facebook
    const posts = await fetchAndNormalizePosts(pageId, accessToken);

    // Cache the results
    if (posts.length > 0) {
      await cacheManager.set(posts);
    }

    const response: PostsApiResponse = {
      posts,
      cached: false,
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in /api/fb/fetch:", error);
    
    // Try to return cached data even if fresh fetch fails
    const cachedPosts = await cacheManager.get();
    if (cachedPosts && cachedPosts.length > 0) {
      return NextResponse.json({
        posts: cachedPosts,
        cached: true,
        error: "Failed to refresh, returning cached data",
        last_updated: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        posts: [],
        cached: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/fb/fetch
 * Force refresh cache (admin endpoint - should be protected in production)
 */
export async function POST(request: NextRequest) {
  try {
    const pageId = process.env.FB_PAGE_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
      return NextResponse.json(
        { error: "Facebook API credentials not configured" },
        { status: 500 }
      );
    }

    // Clear cache and fetch fresh
    await cacheManager.clear();
    const posts = await fetchAndNormalizePosts(pageId, accessToken);

    if (posts.length > 0) {
      await cacheManager.set(posts);
    }

    const response: PostsApiResponse = {
      posts,
      cached: false,
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in /api/fb/fetch POST:", error);
    return NextResponse.json(
      {
        posts: [],
        cached: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

