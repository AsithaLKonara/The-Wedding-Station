import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, DATA_DIR } from "@/lib/storage/base";
import { promises as fs } from "fs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    // Collect all data files
    const dataFiles = [
      "hero.json",
      "about.json",
      "settings.json",
      "gallery.json",
      "videos.json",
      "featured.json",
      "contacts.json",
      "seo.json",
      "theme.json",
      "sections.json",
    ];

    const exportData: Record<string, unknown> = {};

    for (const file of dataFiles) {
      try {
        const content = await readJsonFile(file);
        if (content) {
          exportData[file.replace(".json", "")] = content;
        }
      } catch (error) {
        console.error(`Error reading ${file}:`, error);
      }
    }

    if (format === "csv") {
      // Simple CSV export for contacts
      const contacts = exportData.contacts as Array<Record<string, unknown>>;
      if (contacts && Array.isArray(contacts)) {
        const headers = ["Name", "Email", "Phone", "Message", "Subject", "Status", "Created At"];
        const rows = contacts.map((c) => [
          c.name || "",
          c.email || "",
          c.phone || "",
          String(c.message || "").replace(/"/g, '""'),
          c.subject || "",
          c.status || "",
          c.created_at || "",
        ]);

        const csv = [
          headers.join(","),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="export.csv"',
          },
        });
      }
    }

    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition": 'attachment; filename="export.json"',
      },
    });
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

