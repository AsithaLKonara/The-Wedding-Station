import { NextResponse } from "next/server";
import { fetchPosts } from "@/lib/fb";
import type { FacebookStatus } from "@/types";

export async function GET() {
  try {
    const pageId = process.env.FB_PAGE_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
      const status: FacebookStatus = {
        connected: false,
        error: "Facebook credentials not configured",
      };
      return NextResponse.json({ success: true, status });
    }

    // Test connection
    try {
      await fetchPosts(pageId, accessToken);
      const status: FacebookStatus = {
        connected: true,
        page_id: pageId,
        last_sync: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, status });
    } catch (error) {
      const status: FacebookStatus = {
        connected: false,
        page_id: pageId,
        error: error instanceof Error ? error.message : "Connection failed",
      };
      return NextResponse.json({ success: true, status });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

