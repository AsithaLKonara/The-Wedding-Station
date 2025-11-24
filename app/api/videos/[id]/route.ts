import { NextRequest, NextResponse } from "next/server";
import { updateVideo, deleteVideo } from "@/lib/storage/videos";
import { createErrorResponse } from "@/lib/errors";
import { verifyAdminSession } from "@/lib/auth";
import type { Video } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await verifyAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body: Partial<Video> = await request.json();
    const updated = await updateVideo(params.id, body);
    
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await verifyAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const deleted = await deleteVideo(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

