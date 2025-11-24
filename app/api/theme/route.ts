import { NextRequest, NextResponse } from "next/server";
import { getThemeSettings, saveThemeSettings } from "@/lib/storage/theme";
import { createErrorResponse } from "@/lib/errors";
import { withAuth } from "@/lib/api-helpers";
import type { ThemeSettings } from "@/types";

export async function GET() {
  try {
    const settings = await getThemeSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

async function putHandler(request: NextRequest, session: any) {
  try {
    const body: ThemeSettings = await request.json();
    await saveThemeSettings(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

export const PUT = withAuth(putHandler);

