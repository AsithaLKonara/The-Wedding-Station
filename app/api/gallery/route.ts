import { NextRequest, NextResponse } from "next/server";
import { getGalleryImages, addGalleryImage } from "@/lib/storage/gallery";
import { v2 as cloudinary } from "cloudinary";
import type { GalleryImage } from "@/types";

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

export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json({ success: true, images });
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
    const formData = await request.formData();
    const imageFile = formData.get("file") as File | null;
    const imageUrl = formData.get("image_url") as string | null;
    const title = formData.get("title") as string | null;
    const caption = formData.get("caption") as string | null;
    const album = formData.get("album") as string | null;
    const category = formData.get("category") as string | null;

    let finalImageUrl: string;
    let thumbnailUrl: string | undefined;

    if (imageFile) {
      if (!hasCloudinaryConfig) {
        return NextResponse.json(
          {
            success: false,
            error: "Cloudinary is not configured. Please use image_url instead.",
          },
          { status: 400 }
        );
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "gallery",
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
      thumbnailUrl = uploadResult.secure_url.replace("/upload/", "/upload/w_800,c_limit/");
    } else if (imageUrl) {
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

    const newImage = await addGalleryImage({
      image_url: finalImageUrl,
      thumbnail_url: thumbnailUrl,
      title: title || undefined,
      caption: caption || undefined,
      album: album || undefined,
      category: category || undefined,
    });

    return NextResponse.json({ success: true, image: newImage });
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

