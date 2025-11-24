import { NextRequest, NextResponse } from "next/server";
import { getContactSubmissions, addContactSubmission } from "@/lib/storage/contacts";
import type { ContactSubmission } from "@/types";

export async function GET() {
  try {
    const contacts = await getContactSubmissions();
    return NextResponse.json({ success: true, contacts });
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
    const body: Omit<ContactSubmission, "id" | "status" | "created_at"> = await request.json();
    const newContact = await addContactSubmission(body);
    return NextResponse.json({ success: true, contact: newContact });
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

