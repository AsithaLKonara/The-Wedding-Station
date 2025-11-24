import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_SESSION_KEY = "admin_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminSession {
  username: string;
  userId: string;
  role: "admin" | "editor";
  expiresAt: number;
}

export async function verifyAdminSession(request: NextRequest): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_KEY);
    
    if (!sessionCookie) {
      return null;
    }

    const session: AdminSession = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}

export async function createAdminSession(
  username: string,
  userId: string,
  role: "admin" | "editor"
): Promise<string> {
  const session: AdminSession = {
    username,
    userId,
    role,
    expiresAt: Date.now() + SESSION_DURATION,
  };

  return JSON.stringify(session);
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_KEY);
}

export function requireAuth(handler: (request: NextRequest, session: AdminSession) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const session = await verifyAdminSession(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return handler(request, session);
  };
}

export function requireAdmin(handler: (request: NextRequest, session: AdminSession) => Promise<Response>) {
  return async (request: NextRequest): Promise<Response> => {
    const session = await verifyAdminSession(request);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    return handler(request, session);
  };
}

