import { NextRequest, NextResponse } from "next/server";
import { fetchAndNormalizePosts } from "@/lib/fb";
import { cacheManager } from "@/lib/cache";
import { addSyncHistory } from "@/lib/storage/sync-history";
import type { PostsApiResponse } from "@/types";

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

    const startTime = Date.now();
    
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

    // Log sync history
    await addSyncHistory({
      status: "success",
      posts_found: posts.length,
      posts_added: posts.length,
    });

    return NextResponse.json(response);
  } catch (error) {
    // Log error
    await addSyncHistory({
      status: "error",
      posts_found: 0,
      posts_added: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    });

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

