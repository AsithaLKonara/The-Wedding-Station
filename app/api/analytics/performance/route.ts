import { NextRequest, NextResponse } from "next/server";
import { getPerformanceMetrics, addPerformanceMetric } from "@/lib/storage/analytics";
import type { PerformanceMetric } from "@/types";

export async function GET() {
  try {
    const metrics = await getPerformanceMetrics();
    return NextResponse.json({ success: true, metrics });
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
    const body: Omit<PerformanceMetric, "timestamp"> = await request.json();
    const metric: PerformanceMetric = {
      ...body,
      timestamp: new Date().toISOString(),
    };
    await addPerformanceMetric(metric);
    return NextResponse.json({ success: true });
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

