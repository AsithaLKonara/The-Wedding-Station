import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/storage/users";
import { createAdminSession } from "@/lib/auth";
import { validateString, validateRequired, combineValidationResults } from "@/lib/validation";
import { createErrorResponse } from "@/lib/errors";
import { rateLimitMiddleware } from "@/lib/rate-limit";

async function loginHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    const usernameValidation = combineValidationResults(
      validateRequired(username, "Username"),
      validateString(username, "Username", { minLength: 3, maxLength: 50 })
    );

    const passwordValidation = combineValidationResults(
      validateRequired(password, "Password"),
      validateString(password, "Password", { minLength: 6, maxLength: 100 })
    );

    const validation = combineValidationResults(usernameValidation, passwordValidation);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const user = await verifyPassword(username, password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session
    const sessionData = await createAdminSession(user.username, user.id, user.role);
    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

export const POST = rateLimitMiddleware(loginHandler);

