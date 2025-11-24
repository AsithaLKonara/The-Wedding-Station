import { readJsonFile, writeJsonFile } from "./base";
import type { AnalyticsStats, PerformanceMetric } from "@/types";

const ANALYTICS_FILE = "analytics.json";
const PERFORMANCE_FILE = "performance.json";

export async function getAnalyticsStats(): Promise<AnalyticsStats | null> {
  return await readJsonFile<AnalyticsStats>(ANALYTICS_FILE);
}

export async function saveAnalyticsStats(stats: AnalyticsStats): Promise<void> {
  await writeJsonFile(ANALYTICS_FILE, stats);
}

export async function getPerformanceMetrics(): Promise<PerformanceMetric[]> {
  const metrics = await readJsonFile<PerformanceMetric[]>(PERFORMANCE_FILE);
  return metrics || [];
}

export async function addPerformanceMetric(metric: PerformanceMetric): Promise<void> {
  const existing = await getPerformanceMetrics();
  existing.push(metric);
  
  // Keep only last 100 metrics
  const trimmed = existing.slice(-100);
  await writeJsonFile(PERFORMANCE_FILE, trimmed);
}

