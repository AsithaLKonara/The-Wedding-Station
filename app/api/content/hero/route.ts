import { NextRequest, NextResponse } from "next/server";
import { getHeroContent, saveHeroContent } from "@/lib/storage/hero";
import type { HeroContent } from "@/types";

export async function GET() {
  try {
    const content = await getHeroContent();
    return NextResponse.json({ success: true, content });
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
    const body: HeroContent = await request.json();
    await saveHeroContent(body);
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

