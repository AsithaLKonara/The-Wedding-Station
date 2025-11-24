import { readJsonFile, writeJsonFile } from "./base";
import type { ContactSubmission } from "@/types";

const CONTACTS_FILE = "contacts.json";

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const contacts = await readJsonFile<ContactSubmission[]>(CONTACTS_FILE);
  return contacts || [];
}

export async function saveContactSubmissions(contacts: ContactSubmission[]): Promise<void> {
  await writeJsonFile(CONTACTS_FILE, contacts);
}

export async function addContactSubmission(
  submission: Omit<ContactSubmission, "id" | "status" | "created_at">
): Promise<ContactSubmission> {
  const existing = await getContactSubmissions();
  
  const newSubmission: ContactSubmission = {
    ...submission,
    id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: "new",
    created_at: new Date().toISOString(),
  };
  
  existing.unshift(newSubmission); // Add to beginning
  await saveContactSubmissions(existing);
  return newSubmission;
}

export async function updateContactSubmission(
  id: string,
  updates: Partial<ContactSubmission>
): Promise<boolean> {
  const existing = await getContactSubmissions();
  const index = existing.findIndex((c) => c.id === id);
  
  if (index === -1) return false;
  
  existing[index] = { ...existing[index], ...updates };
  await saveContactSubmissions(existing);
  return true;
}

export async function deleteContactSubmission(id: string): Promise<boolean> {
  const existing = await getContactSubmissions();
  const filtered = existing.filter((c) => c.id !== id);
  
  if (filtered.length === existing.length) return false;
  
  await saveContactSubmissions(filtered);
  return true;
}

