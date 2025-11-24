import { NextRequest, NextResponse } from "next/server";
import { getSEOSettings, saveSEOSettings } from "@/lib/storage/seo";
import { validateString, combineValidationResults } from "@/lib/validation";
import { createErrorResponse } from "@/lib/errors";
import { withAuth } from "@/lib/api-helpers";
import type { SEOSettings } from "@/types";

export async function GET() {
  try {
    const settings = await getSEOSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

async function putHandler(request: NextRequest, session: any) {
  try {
    const body: SEOSettings = await request.json();
    
    // Basic validation for SEO settings
    const validation = combineValidationResults(
      validateString(body.home_meta_description || "", "Home Meta Description", { maxLength: 500 }),
      validateString(body.home_meta_keywords || "", "Home Meta Keywords", { maxLength: 200 })
    );

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    await saveSEOSettings(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

export const PUT = withAuth(putHandler);

