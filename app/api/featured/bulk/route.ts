import { NextRequest, NextResponse } from "next/server";
import { bulkDeleteFeaturedImages, bulkUpdateFeaturedImages } from "@/lib/featured";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ids, updates } = body;

    if (action === "delete") {
      if (!Array.isArray(ids)) {
        return NextResponse.json(
          { success: false, error: "IDs must be an array" },
          { status: 400 }
        );
      }
      const deletedCount = await bulkDeleteFeaturedImages(ids);
      return NextResponse.json({ success: true, deletedCount });
    }

    if (action === "update") {
      if (!Array.isArray(updates)) {
        return NextResponse.json(
          { success: false, error: "Updates must be an array" },
          { status: 400 }
        );
      }
      const updatedCount = await bulkUpdateFeaturedImages(updates);
      return NextResponse.json({ success: true, updatedCount });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
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

