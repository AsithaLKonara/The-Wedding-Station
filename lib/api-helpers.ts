import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "./errors";
import { rateLimitMiddleware } from "./rate-limit";
import { requireAuth } from "./auth";

export function withAuth(handler: (request: NextRequest, session: any) => Promise<Response>) {
  return rateLimitMiddleware(requireAuth(handler));
}

export function withRateLimit(handler: (request: NextRequest) => Promise<Response>) {
  return rateLimitMiddleware(handler);
}

export function handleApiError(error: unknown) {
  return NextResponse.json(createErrorResponse(error), { status: 500 });
}

