import { readJsonFile, writeJsonFile } from "./base";
import type { HeroContent } from "@/types";

const HERO_FILE = "hero.json";

export async function getHeroContent(): Promise<HeroContent | null> {
  return await readJsonFile<HeroContent>(HERO_FILE);
}

export async function saveHeroContent(content: HeroContent): Promise<void> {
  await writeJsonFile(HERO_FILE, content);
}

