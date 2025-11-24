import { NextRequest, NextResponse } from "next/server";
import { getAboutContent, saveAboutContent } from "@/lib/storage/about";
import type { AboutContent } from "@/types";

export async function GET() {
  try {
    const content = await getAboutContent();
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
    const body: AboutContent = await request.json();
    await saveAboutContent(body);
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

