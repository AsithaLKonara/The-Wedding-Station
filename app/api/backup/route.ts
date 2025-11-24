import { NextRequest, NextResponse } from "next/server";
import { createBackup, getBackups, restoreBackup, deleteBackup } from "@/lib/storage/backup";
import type { Backup } from "@/types";

export async function GET() {
  try {
    const backups = await getBackups();
    return NextResponse.json({ success: true, backups });
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
    const body = await request.json();
    const { action, includes, filename } = body;

    if (action === "create") {
      const dataFiles = includes || [
        "hero",
        "about",
        "settings",
        "gallery",
        "videos",
        "featured",
        "contacts",
        "seo",
        "theme",
        "sections",
      ];
      const backup = await createBackup(dataFiles.map((f: string) => `${f}.json`));
      return NextResponse.json({ success: true, backup });
    }

    if (action === "restore") {
      if (!filename) {
        return NextResponse.json(
          { success: false, error: "Filename is required" },
          { status: 400 }
        );
      }
      await restoreBackup(filename);
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      if (!filename) {
        return NextResponse.json(
          { success: false, error: "Filename is required" },
          { status: 400 }
        );
      }
      await deleteBackup(filename);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
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

