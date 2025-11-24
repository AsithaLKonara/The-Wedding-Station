import { NextResponse } from "next/server";
import { getSyncHistory } from "@/lib/storage/sync-history";

export async function GET() {
  try {
    const history = await getSyncHistory();
    return NextResponse.json({ success: true, history });
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

