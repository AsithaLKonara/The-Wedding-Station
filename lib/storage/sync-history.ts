import { readJsonFile, writeJsonFile } from "./base";
import type { SyncHistory } from "@/types";

const SYNC_HISTORY_FILE = "sync-history.json";

export async function getSyncHistory(): Promise<SyncHistory[]> {
  const history = await readJsonFile<SyncHistory[]>(SYNC_HISTORY_FILE);
  return history || [];
}

export async function addSyncHistory(entry: Omit<SyncHistory, "id" | "timestamp">): Promise<SyncHistory> {
  const existing = await getSyncHistory();
  
  const newEntry: SyncHistory = {
    ...entry,
    id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  existing.unshift(newEntry);
  
  // Keep only last 50 entries
  const trimmed = existing.slice(0, 50);
  await writeJsonFile(SYNC_HISTORY_FILE, trimmed);
  return newEntry;
}

