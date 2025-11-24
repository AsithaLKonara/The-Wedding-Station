import { readJsonFile, writeJsonFile } from "./base";
import type { SectionVisibility } from "@/types";

const SECTIONS_FILE = "sections.json";

const DEFAULT_VISIBILITY: SectionVisibility = {
  hero: true,
  featured: true,
  gallery: true,
  videos: true,
  about: true,
  contact: true,
  footer: true,
};

export async function getSectionVisibility(): Promise<SectionVisibility> {
  const visibility = await readJsonFile<SectionVisibility>(SECTIONS_FILE);
  return visibility || DEFAULT_VISIBILITY;
}

export async function saveSectionVisibility(visibility: SectionVisibility): Promise<void> {
  await writeJsonFile(SECTIONS_FILE, visibility);
}

