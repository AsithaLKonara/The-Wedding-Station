import { NextRequest, NextResponse } from "next/server";
import { getVideos, addVideo } from "@/lib/storage/videos";
import type { Video } from "@/types";

export async function GET() {
  try {
    const videos = await getVideos();
    return NextResponse.json({ success: true, videos });
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

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Video, "id" | "created_at"> = await request.json();
    const newVideo = await addVideo(body);
    return NextResponse.json({ success: true, video: newVideo });
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

