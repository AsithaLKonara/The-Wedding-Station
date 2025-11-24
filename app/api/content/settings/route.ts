import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/storage/settings";
import { validateString, validateUrl, validateEmail, combineValidationResults } from "@/lib/validation";
import { createErrorResponse } from "@/lib/errors";
import { withAuth } from "@/lib/api-helpers";
import type { SiteSettings } from "@/types";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

async function putHandler(request: NextRequest, session: any) {
  try {
    const body: SiteSettings = await request.json();

    // Validate settings
    const titleValidation = validateString(body.site_title, "Site Title", { maxLength: 200 });
    const logoValidation = body.site_logo ? validateUrl(body.site_logo, "Site Logo") : { valid: true, errors: [] };
    const emailValidation = body.contact_email ? validateEmail(body.contact_email, "Contact Email") : { valid: true, errors: [] };

    const validation = combineValidationResults(titleValidation, logoValidation, emailValidation);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    await saveSiteSettings(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

export const PUT = withAuth(putHandler);

