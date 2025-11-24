import { readJsonFile, writeJsonFile } from "./base";
import type { ActivityLog } from "@/types";

const ACTIVITY_FILE = "activity.json";

export async function getActivityLogs(limit?: number): Promise<ActivityLog[]> {
  const logs = await readJsonFile<ActivityLog[]>(ACTIVITY_FILE);
  const sorted = (logs || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function addActivityLog(
  log: Omit<ActivityLog, "id" | "timestamp">
): Promise<ActivityLog> {
  const existing = await getActivityLogs();
  
  const newLog: ActivityLog = {
    ...log,
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  existing.unshift(newLog);
  
  // Keep only last 500 entries
  const trimmed = existing.slice(0, 500);
  await writeJsonFile(ACTIVITY_FILE, trimmed);
  return newLog;
}

