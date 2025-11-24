import { NextRequest, NextResponse } from "next/server";
import { updateGalleryImage, deleteGalleryImage } from "@/lib/storage/gallery";
import { createErrorResponse } from "@/lib/errors";
import { verifyAdminSession } from "@/lib/auth";
import type { GalleryImage } from "@/types";

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
    const body: Partial<GalleryImage> = await request.json();
    const updated = await updateGalleryImage(params.id, body);
    
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
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
    const deleted = await deleteGalleryImage(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

