"use client";

import { useState, useEffect } from "react";
import type { Backup } from "@/types";

interface BackupManagerProps {
  onRefresh?: () => void;
}

export default function BackupManager({ onRefresh }: BackupManagerProps) {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedIncludes, setSelectedIncludes] = useState<string[]>([
    "hero", "about", "settings", "gallery", "videos", "featured", "contacts", "seo", "theme", "sections",
  ]);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const response = await fetch("/api/backup");
      const data = await response.json();
      if (data.backups) {
        setBackups(data.backups);
      }
    } catch (error) {
      console.error("Error loading backups:", error);
    }
  };

  const handleCreateBackup = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          includes: selectedIncludes.map((item) => `${item}.json`),
        }),
      });

      const data = await response.json();
      if (data.success) {
        loadBackups();
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error creating backup:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestore = async (filename: string) => {
    if (!confirm("Restore this backup? This will overwrite current data.")) return;

    try {
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "restore",
          filename,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Backup restored successfully!");
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error restoring backup:", error);
      alert("Error restoring backup");
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm("Delete this backup?")) return;

    try {
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          filename,
        }),
      });

      const data = await response.json();
      if (data.success) {
        loadBackups();
      }
    } catch (error) {
      console.error("Error deleting backup:", error);
    }
  };

  const dataFiles = [
    { id: "hero", label: "Hero Content" },
    { id: "about", label: "About Content" },
    { id: "settings", label: "Site Settings" },
    { id: "gallery", label: "Gallery Images" },
    { id: "videos", label: "Videos" },
    { id: "featured", label: "Featured Images" },
    { id: "contacts", label: "Contacts" },
    { id: "seo", label: "SEO Settings" },
    { id: "theme", label: "Theme Settings" },
    { id: "sections", label: "Section Visibility" },
  ];

  return (
    <div className="space-y-6">
      {/* Create Backup */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Create Backup</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Data to Backup
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dataFiles.map((file) => (
                <label key={file.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedIncludes.includes(file.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIncludes([...selectedIncludes, file.id]);
                      } else {
                        setSelectedIncludes(selectedIncludes.filter((id) => id !== file.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{file.label}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={isCreating || selectedIncludes.length === 0}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isCreating ? "Creating Backup..." : "Create Backup"}
          </button>
        </div>
      </div>

      {/* Export */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Export Data</h3>
        <div className="space-y-2">
          <button
            onClick={() => window.open("/api/export", "_blank")}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Export All Data (JSON)
          </button>
          <button
            onClick={() => window.open("/api/export?format=csv", "_blank")}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Export Contacts (CSV)
          </button>
        </div>
      </div>

      {/* Backups List */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Backups ({backups.length})</h3>
        <div className="space-y-2">
          {backups.length === 0 ? (
            <p className="text-sm text-gray-500">No backups yet</p>
          ) : (
            backups.map((backup) => (
              <div key={backup.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{backup.filename}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(backup.created_at).toLocaleString()} • {(backup.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-xs text-gray-500">
                    Includes: {backup.includes.length} file(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(backup.filename)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDelete(backup.filename)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

