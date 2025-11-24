import { readJsonFile, writeJsonFile } from "./base";
import type { AdminUser } from "@/types";
import crypto from "crypto";

const USERS_FILE = "users.json";

interface UserWithPassword extends AdminUser {
  password_hash: string;
}

export async function getUsers(): Promise<UserWithPassword[]> {
  const users = await readJsonFile<UserWithPassword[]>(USERS_FILE);
  return users || [];
}

export async function saveUsers(users: UserWithPassword[]): Promise<void> {
  await writeJsonFile(USERS_FILE, users);
}

export async function getUserByUsername(username: string): Promise<UserWithPassword | null> {
  const users = await getUsers();
  return users.find((u) => u.username === username) || null;
}

export async function createUser(
  username: string,
  password: string,
  role: "admin" | "editor" = "editor",
  email?: string
): Promise<AdminUser> {
  const users = await getUsers();
  
  if (users.some((u) => u.username === username)) {
    throw new Error("Username already exists");
  }
  
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  
  const newUser: UserWithPassword = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    username,
    email,
    role,
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
  };
  
  users.push(newUser);
  await saveUsers(users);
  
  const { password_hash, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function updateUser(id: string, updates: Partial<AdminUser>): Promise<boolean> {
  const users = await getUsers();
  const index = users.findIndex((u) => u.id === id);
  
  if (index === -1) return false;
  
  users[index] = { ...users[index], ...updates };
  await saveUsers(users);
  return true;
}

export async function updateUserPassword(id: string, newPassword: string): Promise<boolean> {
  const users = await getUsers();
  const index = users.findIndex((u) => u.id === id);
  
  if (index === -1) return false;
  
  const passwordHash = crypto.createHash("sha256").update(newPassword).digest("hex");
  users[index].password_hash = passwordHash;
  await saveUsers(users);
  return true;
}

export async function verifyPassword(username: string, password: string): Promise<AdminUser | null> {
  const user = await getUserByUsername(username);
  if (!user) return null;
  
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  if (user.password_hash !== passwordHash) return null;
  
  // Update last login
  await updateUser(user.id, { last_login: new Date().toISOString() });
  
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function deleteUser(id: string): Promise<boolean> {
  const users = await getUsers();
  const filtered = users.filter((u) => u.id !== id);
  
  if (filtered.length === users.length) return false;
  
  await saveUsers(filtered);
  return true;
}

