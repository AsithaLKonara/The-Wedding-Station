import { NextRequest, NextResponse } from "next/server";
import { getAboutContent, saveAboutContent } from "@/lib/storage/about";
import { validateString, combineValidationResults } from "@/lib/validation";
import { createErrorResponse } from "@/lib/errors";
import { withAuth } from "@/lib/api-helpers";
import type { AboutContent } from "@/types";

export async function GET() {
  try {
    const content = await getAboutContent();
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

async function putHandler(request: NextRequest, session: any) {
  try {
    const body: AboutContent = await request.json();

    // Validate about content
    const titleValidation = validateString(body.title, "Title", { maxLength: 200 });
    const validation = combineValidationResults(titleValidation);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    await saveAboutContent(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

export const PUT = withAuth(putHandler);

