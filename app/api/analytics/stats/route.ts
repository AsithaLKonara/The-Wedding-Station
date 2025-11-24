import { NextResponse } from "next/server";
import { getAnalyticsStats, saveAnalyticsStats } from "@/lib/storage/analytics";
import { getGalleryImages } from "@/lib/storage/gallery";
import { getVideos } from "@/lib/storage/videos";
import { getFeaturedImages } from "@/lib/featured";
import { getContactSubmissions } from "@/lib/storage/contacts";
import { cacheManager } from "@/lib/cache";
import type { AnalyticsStats } from "@/types";

export async function GET() {
  try {
    // Calculate current stats
    const galleryImages = await getGalleryImages();
    const videos = await getVideos();
    const featuredImages = await getFeaturedImages();
    const contacts = await getContactSubmissions();
    const fbPosts = await cacheManager.get();
    
    const stats: AnalyticsStats = {
      total_images: galleryImages.length + (fbPosts?.length || 0),
      total_videos: videos.length,
      featured_count: featuredImages.length,
      facebook_posts: fbPosts?.length || 0,
      total_contacts: contacts.length,
      unread_contacts: contacts.filter((c) => c.status === "new").length,
    };

    // Save stats
    await saveAnalyticsStats(stats);

    return NextResponse.json({ success: true, stats });
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

