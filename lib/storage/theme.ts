import { readJsonFile, writeJsonFile } from "./base";
import type { ThemeSettings } from "@/types";

const THEME_FILE = "theme.json";

export async function getThemeSettings(): Promise<ThemeSettings | null> {
  return await readJsonFile<ThemeSettings>(THEME_FILE);
}

export async function saveThemeSettings(settings: ThemeSettings): Promise<void> {
  await writeJsonFile(THEME_FILE, settings);
}

