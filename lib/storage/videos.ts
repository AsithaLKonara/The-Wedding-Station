import { readJsonFile, writeJsonFile } from "./base";
import type { Video } from "@/types";

const VIDEOS_FILE = "videos.json";

export async function getVideos(): Promise<Video[]> {
  const videos = await readJsonFile<Video[]>(VIDEOS_FILE);
  return videos || [];
}

export async function saveVideos(videos: Video[]): Promise<void> {
  await writeJsonFile(VIDEOS_FILE, videos);
}

export async function addVideo(video: Omit<Video, "id" | "created_at">): Promise<Video> {
  const existing = await getVideos();
  
  const newVideo: Video = {
    ...video,
    id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
  };
  
  existing.push(newVideo);
  await saveVideos(existing);
  return newVideo;
}

export async function updateVideo(id: string, updates: Partial<Video>): Promise<boolean> {
  const existing = await getVideos();
  const index = existing.findIndex((v) => v.id === id);
  
  if (index === -1) return false;
  
  existing[index] = { ...existing[index], ...updates };
  await saveVideos(existing);
  return true;
}

export async function deleteVideo(id: string): Promise<boolean> {
  const existing = await getVideos();
  const filtered = existing.filter((v) => v.id !== id);
  
  if (filtered.length === existing.length) return false;
  
  await saveVideos(filtered);
  return true;
}

