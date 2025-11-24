import { NextRequest, NextResponse } from "next/server";
import { getSectionVisibility, saveSectionVisibility } from "@/lib/storage/sections";
import { createErrorResponse } from "@/lib/errors";
import { withAuth } from "@/lib/api-helpers";
import type { SectionVisibility } from "@/types";

export async function GET() {
  try {
    const visibility = await getSectionVisibility();
    return NextResponse.json({ success: true, visibility });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

async function putHandler(request: NextRequest, session: any) {
  try {
    const body: SectionVisibility = await request.json();
    await saveSectionVisibility(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

export const PUT = withAuth(putHandler);

