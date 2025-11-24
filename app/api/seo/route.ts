import { NextRequest, NextResponse } from "next/server";
import { getSEOSettings, saveSEOSettings } from "@/lib/storage/seo";
import type { SEOSettings } from "@/types";

export async function GET() {
  try {
    const settings = await getSEOSettings();
    return NextResponse.json({ success: true, settings });
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
    const body: SEOSettings = await request.json();
    await saveSEOSettings(body);
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

