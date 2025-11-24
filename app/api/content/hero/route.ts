import { NextRequest, NextResponse } from "next/server";
import { getHeroContent, saveHeroContent } from "@/lib/storage/hero";
import { validateString, validateUrl, combineValidationResults } from "@/lib/validation";
import { createErrorResponse } from "@/lib/errors";
import { withAuth } from "@/lib/api-helpers";
import type { HeroContent } from "@/types";

export async function GET() {
  try {
    const content = await getHeroContent();
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

async function putHandler(request: NextRequest, session: any) {
  try {
    const body: HeroContent = await request.json();

    // Validate hero content
    const titleValidation = validateString(body.title, "Title", { minLength: 1, maxLength: 200 });
    const subtitleValidation = validateString(body.subtitle, "Subtitle", { maxLength: 500 });
    const bgImageValidation = body.background_image
      ? validateUrl(body.background_image, "Background Image")
      : { valid: true, errors: [] };

    const validation = combineValidationResults(
      titleValidation,
      subtitleValidation,
      bgImageValidation
    );

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    await saveHeroContent(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

export const PUT = withAuth(putHandler);

