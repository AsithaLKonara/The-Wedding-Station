/**
 * Base Storage Utility
 * Provides common functionality for all storage utilities
 */

import { promises as fs } from "fs";
import path from "path";

export const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Ensure data directory exists
 */
export async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Read JSON file from data directory
 */
export async function readJsonFile<T>(filename: string): Promise<T | null> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

/**
 * Write JSON file to data directory
 */
export async function writeJsonFile<T>(
  filename: string,
  data: T
): Promise<void> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

/**
 * Delete file from data directory
 */
export async function deleteFile(filename: string): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Error deleting ${filename}:`, error);
      throw error;
    }
  }
}

