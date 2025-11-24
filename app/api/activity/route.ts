import { NextRequest, NextResponse } from "next/server";
import { getActivityLogs, addActivityLog } from "@/lib/storage/activity";
import type { ActivityLog } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const logs = await getActivityLogs(limit);
    return NextResponse.json({ success: true, logs });
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

export async function POST(request: NextRequest) {
  try {
    const body: Omit<ActivityLog, "id" | "timestamp"> = await request.json();
    const log = await addActivityLog(body);
    return NextResponse.json({ success: true, log });
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

