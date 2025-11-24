import { readJsonFile, writeJsonFile } from "./base";
import type { SiteSettings } from "@/types";

const SETTINGS_FILE = "settings.json";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return await readJsonFile<SiteSettings>(SETTINGS_FILE);
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await writeJsonFile(SETTINGS_FILE, settings);
}

