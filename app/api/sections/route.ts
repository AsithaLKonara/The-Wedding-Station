import { NextRequest, NextResponse } from "next/server";
import { getSectionVisibility, saveSectionVisibility } from "@/lib/storage/sections";
import type { SectionVisibility } from "@/types";

export async function GET() {
  try {
    const visibility = await getSectionVisibility();
    return NextResponse.json({ success: true, visibility });
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

export async function PUT(request: NextRequest) {
  try {
    const body: SectionVisibility = await request.json();
    await saveSectionVisibility(body);
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

