import { readJsonFile, writeJsonFile } from "./base";
import type { SEOSettings } from "@/types";

const SEO_FILE = "seo.json";

export async function getSEOSettings(): Promise<SEOSettings | null> {
  return await readJsonFile<SEOSettings>(SEO_FILE);
}

export async function saveSEOSettings(settings: SEOSettings): Promise<void> {
  await writeJsonFile(SEO_FILE, settings);
}

