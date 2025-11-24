"use client";

import { useState } from "react";
import type { AdminUser } from "@/types";

interface UserManagerProps {
  users: AdminUser[];
  onRefresh: () => void;
  onActivity?: (action: string, resourceType: string, resourceId?: string) => void;
}

export default function UserManager({ users, onRefresh, onActivity }: UserManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "editor" as "admin" | "editor",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        onActivity?.("create", "user", data.user?.id);
        setFormData({ username: "", password: "", email: "", role: "editor" });
        onRefresh();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (user: AdminUser) => {
    try {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        }),
      });
      onActivity?.("update", "user", user.id);
      setEditingUser(null);
      onRefresh();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;

    try {
      await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      onActivity?.("delete", "user", id);
      onRefresh();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handlePasswordChange = async (userId: string) => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await fetch("/api/users/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          newPassword: passwordData.newPassword,
        }),
      });
      onActivity?.("change_password", "user", userId);
      setShowPasswordForm(null);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      onRefresh();
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create User Form */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Create New User</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "editor" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Users ({users.length})</h3>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email || "No email"}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingUser(user)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowPasswordForm(user.id)}
                  className="px-3 py-1 bg-yellow-600 text-white rounded text-sm"
                >
                  Change Password
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as "admin" | "editor" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(editingUser)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePasswordChange(showPasswordForm)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Change Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(null);
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

