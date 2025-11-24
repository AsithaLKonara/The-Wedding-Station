import { readJsonFile, writeJsonFile } from "./base";
import type { GalleryImage } from "@/types";

const GALLERY_FILE = "gallery.json";

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const images = await readJsonFile<GalleryImage[]>(GALLERY_FILE);
  return images || [];
}

export async function saveGalleryImages(images: GalleryImage[]): Promise<void> {
  const sorted = images.sort((a, b) => a.order - b.order);
  await writeJsonFile(GALLERY_FILE, sorted);
}

export async function addGalleryImage(image: Omit<GalleryImage, "id" | "created_at" | "order">): Promise<GalleryImage> {
  const existing = await getGalleryImages();
  const maxOrder = existing.length > 0 ? Math.max(...existing.map((img) => img.order)) : -1;
  
  const newImage: GalleryImage = {
    ...image,
    id: `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    order: maxOrder + 1,
    created_at: new Date().toISOString(),
  };
  
  existing.push(newImage);
  await saveGalleryImages(existing);
  return newImage;
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<boolean> {
  const existing = await getGalleryImages();
  const index = existing.findIndex((img) => img.id === id);
  
  if (index === -1) return false;
  
  existing[index] = { ...existing[index], ...updates };
  await saveGalleryImages(existing);
  return true;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const existing = await getGalleryImages();
  const filtered = existing.filter((img) => img.id !== id);
  
  if (filtered.length === existing.length) return false;
  
  await saveGalleryImages(filtered);
  return true;
}

export async function reorderGalleryImages(updates: { id: string; order: number }[]): Promise<void> {
  const existing = await getGalleryImages();
  const orderMap = new Map(updates.map((u) => [u.id, u.order]));
  
  const updated = existing.map((img) => {
    if (orderMap.has(img.id)) {
      return { ...img, order: orderMap.get(img.id)! };
    }
    return img;
  });
  
  await saveGalleryImages(updated);
}

