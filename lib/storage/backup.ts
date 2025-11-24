import { readJsonFile, writeJsonFile, DATA_DIR } from "./base";
import { promises as fs } from "fs";
import path from "path";
import type { Backup } from "@/types";

const BACKUPS_DIR = path.join(DATA_DIR, "backups");

export async function ensureBackupsDir(): Promise<void> {
  try {
    await fs.access(BACKUPS_DIR);
  } catch {
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
  }
}

export async function createBackup(includes: string[]): Promise<Backup> {
  await ensureBackupsDir();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `backup-${timestamp}.json`;
  const filepath = path.join(BACKUPS_DIR, filename);
  
  // Collect all data
  const data: Record<string, unknown> = {};
  
  for (const file of includes) {
    try {
      const content = await readJsonFile(file);
      if (content) {
        data[file.replace(".json", "")] = content;
      }
    } catch (error) {
      console.error(`Error backing up ${file}:`, error);
    }
  }
  
  // Write backup file directly
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
  
  const stats = await fs.stat(filepath);
  
  return {
    id: `backup-${Date.now()}`,
    filename,
    created_at: new Date().toISOString(),
    size: stats.size,
    includes,
  };
}

export async function getBackups(): Promise<Backup[]> {
  await ensureBackupsDir();
  
  try {
    const files = await fs.readdir(BACKUPS_DIR);
    const backups: Backup[] = [];
    
    for (const file of files) {
      if (file.endsWith(".json")) {
        const filepath = path.join(BACKUPS_DIR, file);
        const stats = await fs.stat(filepath);
        const backupFileRelative = path.relative(DATA_DIR, filepath);
        const data = await readJsonFile<Record<string, unknown>>(backupFileRelative);
        
        backups.push({
          id: `backup-${stats.mtime.getTime()}`,
          filename: file,
          created_at: stats.birthtime.toISOString(),
          size: stats.size,
          includes: data ? Object.keys(data) : [],
        });
      }
    }
    
    return backups.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch {
    return [];
  }
}

export async function restoreBackup(filename: string): Promise<void> {
  const filepath = path.join(BACKUPS_DIR, filename);
  const backupFileRelative = path.relative(DATA_DIR, filepath);
  const data = await readJsonFile<Record<string, unknown>>(backupFileRelative);
  if (!data) throw new Error("Backup file not found");
  
  // Restore each file
  for (const [key, value] of Object.entries(data)) {
    const targetFile = `${key}.json`;
    await writeJsonFile(targetFile, value);
  }
}

export async function deleteBackup(filename: string): Promise<void> {
  const filepath = path.join(BACKUPS_DIR, filename);
  await fs.unlink(filepath);
}

