import { NextRequest, NextResponse } from "next/server";
import { updateFeaturedImageOrder } from "@/lib/featured";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: "Updates must be an array" },
        { status: 400 }
      );
    }

    await updateFeaturedImageOrder(updates);
    return NextResponse.json({ success: true });
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

