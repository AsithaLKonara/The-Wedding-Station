import { NextRequest, NextResponse } from "next/server";
import { getVideos, addVideo } from "@/lib/storage/videos";
import { validateString, validateUrl, combineValidationResults } from "@/lib/validation";
import { createErrorResponse } from "@/lib/errors";
import { withAuth } from "@/lib/api-helpers";
import type { Video } from "@/types";

export async function GET() {
  try {
    const videos = await getVideos();
    return NextResponse.json({ success: true, videos });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

async function postHandler(request: NextRequest, session: any) {
  try {
    const body: Omit<Video, "id" | "created_at"> = await request.json();

    // Validate video data
    const videoUrlValidation = validateUrl(body.video_url, "Video URL");
    const thumbnailValidation = body.thumbnail_url ? validateUrl(body.thumbnail_url, "Thumbnail URL") : { valid: true, errors: [] };
    const titleValidation = validateString(body.title || "", "Title", { maxLength: 200 });

    const validation = combineValidationResults(videoUrlValidation, thumbnailValidation, titleValidation);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const newVideo = await addVideo(body);
    return NextResponse.json({ success: true, video: newVideo });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

export const POST = withAuth(postHandler);

