import { NextRequest, NextResponse } from "next/server";
import {
  getFeaturedImages,
  addFeaturedImage,
  removeFeaturedImage,
  updateFeaturedImageOrder,
} from "@/lib/featured";
import { v2 as cloudinary } from "cloudinary";
import type { FeaturedImagesApiResponse } from "@/types";

// Configure Cloudinary (if credentials are available)
const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });
}

/**
 * GET /api/featured
 * Get all featured images
 */
export async function GET() {
  try {
    const images = await getFeaturedImages();
    const response: FeaturedImagesApiResponse = {
      images,
      success: true,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching featured images:", error);
    return NextResponse.json(
      {
        images: [],
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/featured
 * Add a new featured image
 * Expects: { image_url, thumbnail_url?, title?, caption? }
 * OR: { file: base64 or file upload } for Cloudinary upload
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("file") as File | null;
    const imageUrl = formData.get("image_url") as string | null;
    const title = formData.get("title") as string | null;
    const caption = formData.get("caption") as string | null;

    let finalImageUrl: string;
    let thumbnailUrl: string | undefined;

    // If file is provided, upload to Cloudinary
    if (imageFile) {
      if (!hasCloudinaryConfig) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env.local file, or use the URL upload method instead.",
          },
          { status: 400 }
        );
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "featured",
              resource_type: "image",
              transformation: [
                { quality: "auto", fetch_format: "auto" },
                { width: 1920, height: 1080, crop: "limit" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      finalImageUrl = uploadResult.secure_url;
      thumbnailUrl = uploadResult.secure_url.replace(
        "/upload/",
        "/upload/w_800,c_limit/"
      );
    } else if (imageUrl) {
      // Use provided URL (could be from Google Drive, etc.)
      finalImageUrl = imageUrl;
      thumbnailUrl = formData.get("thumbnail_url") as string | undefined;
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Either 'file' or 'image_url' must be provided",
        },
        { status: 400 }
      );
    }

    const newImage = await addFeaturedImage(
      finalImageUrl,
      thumbnailUrl,
      title || undefined,
      caption || undefined
    );

    return NextResponse.json({
      success: true,
      image: newImage,
    });
  } catch (error) {
    console.error("Error adding featured image:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/featured
 * Remove a featured image
 * Expects: { id: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 }
      );
    }

    const deleted = await removeFeaturedImage(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing featured image:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/featured
 * Update featured image order
 * Expects: { updates: [{ id: string, order: number }] }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: "Updates must be an array" },
        { status: 400 }
      );
    }

    await updateFeaturedImageOrder(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating featured image order:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

