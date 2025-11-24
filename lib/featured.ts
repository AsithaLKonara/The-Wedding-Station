/**
 * Featured Images Storage Utility
 * Stores featured images metadata in a JSON file
 * Images are stored in Cloudinary
 */

import { promises as fs } from "fs";
import path from "path";
import type { FeaturedImage } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const FEATURED_FILE = path.join(DATA_DIR, "featured.json");

/**
 * Ensure data directory exists
 */
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Read featured images from storage
 */
export async function getFeaturedImages(): Promise<FeaturedImage[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(FEATURED_FILE, "utf-8");
    const images: FeaturedImage[] = JSON.parse(data);
    // Sort by order
    return images.sort((a, b) => a.order - b.order);
  } catch (error) {
    // File doesn't exist yet, return empty array
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    console.error("Error reading featured images:", error);
    return [];
  }
}

/**
 * Save featured images to storage
 */
export async function saveFeaturedImages(
  images: FeaturedImage[]
): Promise<void> {
  try {
    await ensureDataDir();
    // Sort by order before saving
    const sorted = images.sort((a, b) => a.order - b.order);
    await fs.writeFile(FEATURED_FILE, JSON.stringify(sorted, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving featured images:", error);
    throw error;
  }
}

/**
 * Add a new featured image
 */
export async function addFeaturedImage(
  imageUrl: string,
  thumbnailUrl?: string,
  title?: string,
  caption?: string
): Promise<FeaturedImage> {
  const existing = await getFeaturedImages();
  const maxOrder = existing.length > 0 ? Math.max(...existing.map((img) => img.order)) : -1;

  const newImage: FeaturedImage = {
    id: `featured-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    image_url: imageUrl,
    thumbnail_url: thumbnailUrl,
    title,
    caption,
    order: maxOrder + 1,
    created_at: new Date().toISOString(),
  };

  existing.push(newImage);
  await saveFeaturedImages(existing);
  return newImage;
}

/**
 * Remove a featured image by ID
 */
export async function removeFeaturedImage(id: string): Promise<boolean> {
  const existing = await getFeaturedImages();
  const filtered = existing.filter((img) => img.id !== id);

  if (filtered.length === existing.length) {
    return false; // Image not found
  }

  await saveFeaturedImages(filtered);
  return true;
}

/**
 * Update featured image order
 */
export async function updateFeaturedImageOrder(
  updates: { id: string; order: number }[]
): Promise<void> {
  const existing = await getFeaturedImages();
  const orderMap = new Map(updates.map((u) => [u.id, u.order]));

  const updated = existing.map((img) => {
    if (orderMap.has(img.id)) {
      return { ...img, order: orderMap.get(img.id)! };
    }
    return img;
  });

  await saveFeaturedImages(updated);
}

