import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { validateUrl, validateFile } from "@/lib/validation";
import { createErrorResponse } from "@/lib/errors";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/auth";

// Configure Cloudinary
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

async function optimizeHandler(request: NextRequest) {
  try {
    if (!hasCloudinaryConfig) {
      return NextResponse.json(
        { success: false, error: "Cloudinary not configured" },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const imageUrl = formData.get("image_url") as string | null;

    if (!file && !imageUrl) {
      return NextResponse.json(
        { success: false, error: "File or image_url is required" },
        { status: 400 }
      );
    }

    let uploadResult: any;

    if (file) {
      // Validate file
      const fileValidation = validateFile(file, {
        maxSizeMB: 10,
        allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      });

      if (!fileValidation.valid) {
        return NextResponse.json(
          { success: false, error: fileValidation.errors.join(", ") },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary with optimization
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              transformation: [
                { quality: "auto" },
                { fetch_format: "auto" },
                { width: 1920, crop: "limit" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });
    } else if (imageUrl) {
      // Validate URL
      const urlValidation = validateUrl(imageUrl, "image_url");
      if (!urlValidation.valid) {
        return NextResponse.json(
          { success: false, error: urlValidation.errors.join(", ") },
          { status: 400 }
        );
      }

      // Upload from URL with optimization
      uploadResult = await cloudinary.uploader.upload(imageUrl, {
        transformation: [
          { quality: "auto" },
          { fetch_format: "auto" },
          { width: 1920, crop: "limit" },
        ],
      });
    }

    if (!uploadResult) {
      return NextResponse.json(
        { success: false, error: "Failed to upload image" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
      },
    });
  } catch (error) {
    return NextResponse.json(createErrorResponse(error), { status: 500 });
  }
}

export const POST = rateLimitMiddleware(requireAuth(optimizeHandler));

