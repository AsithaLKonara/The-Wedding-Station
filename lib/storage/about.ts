import { readJsonFile, writeJsonFile } from "./base";
import type { AboutContent } from "@/types";

const ABOUT_FILE = "about.json";

export async function getAboutContent(): Promise<AboutContent | null> {
  return await readJsonFile<AboutContent>(ABOUT_FILE);
}

export async function saveAboutContent(content: AboutContent): Promise<void> {
  await writeJsonFile(ABOUT_FILE, content);
}

