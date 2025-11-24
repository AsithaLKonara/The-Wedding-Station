"use client";

import { useState } from "react";
import Image from "next/image";
import ImageUploader from "./ImageUploader";
import DragDropGrid from "./DragDropGrid";
import type { FeaturedImage } from "@/types";

interface FeaturedManagerProps {
  images: FeaturedImage[];
  onRefresh: () => void;
  onActivity?: (action: string, resourceType: string, resourceId?: string, details?: Record<string, unknown>) => void;
}

export default function FeaturedManager({ images, onRefresh, onActivity }: FeaturedManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [editingImage, setEditingImage] = useState<FeaturedImage | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData();
      if (uploadMode === "file" && selectedFile) {
        formData.append("file", selectedFile);
      } else if (uploadMode === "url" && imageUrl) {
        formData.append("image_url", imageUrl);
      } else {
        alert("Please select an image");
        setIsUploading(false);
        return;
      }

      if (title) formData.append("title", title);
      if (caption) formData.append("caption", caption);

      const response = await fetch("/api/featured", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        onActivity?.("create", "featured", data.image?.id);
        setSelectedFile(null);
        setPreviewUrl(null);
        setImageUrl("");
        setTitle("");
        setCaption("");
        onRefresh();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this featured image?")) return;

    try {
      await fetch("/api/featured", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      onActivity?.("delete", "featured", id);
      onRefresh();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    if (!confirm(`Delete ${selectedImages.length} selected images?`)) return;

    try {
      await fetch("/api/featured/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", ids: selectedImages }),
      });
      onActivity?.("bulk_delete", "featured", undefined, { count: selectedImages.length });
      setSelectedImages([]);
      onRefresh();
    } catch (error) {
      console.error("Error bulk deleting:", error);
    }
  };

  const handleReorder = async (updates: { id: string; order: number }[]) => {
    try {
      await fetch("/api/featured/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      onActivity?.("reorder", "featured", undefined, { count: updates.length });
      onRefresh();
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Add Featured Image</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Method
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={uploadMode === "file"}
                  onChange={(e) => setUploadMode(e.target.value as "file" | "url")}
                  className="mr-2"
                />
                Upload File
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="url"
                  checked={uploadMode === "url"}
                  onChange={(e) => setUploadMode(e.target.value as "file" | "url")}
                  className="mr-2"
                />
                Image URL
              </label>
            </div>
          </div>

          {uploadMode === "file" ? (
            <ImageUploader
              onFileSelect={handleFileSelect}
              previewUrl={previewUrl}
              onRemove={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
            />
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Add Featured Image"}
          </button>
        </form>
      </div>

      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">
            {selectedImages.length} image(s) selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Images Grid */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Featured Images ({images.length})</h3>
        <DragDropGrid
          items={images}
          onReorder={async (reordered) => {
            const updates = reordered.map((img, index) => ({
              id: img.id,
              order: index,
            }));
            await handleReorder(updates);
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          renderItem={(img, index) => (
            <div className="relative group">
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedImages.includes(img.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedImages([...selectedImages, img.id]);
                    } else {
                      setSelectedImages(selectedImages.filter((id) => id !== img.id));
                    }
                  }}
                  className="w-5 h-5"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="relative aspect-square">
                <Image
                  src={img.thumbnail_url || img.image_url}
                  alt={img.title || "Featured"}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingImage(img);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.id);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Order: {index + 1}
              </div>
            </div>
          )}
        />
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Featured Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingImage.title || ""}
                  onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={editingImage.caption || ""}
                  onChange={(e) => setEditingImage({ ...editingImage, caption: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await fetch("/api/featured/bulk", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        action: "update",
                        updates: [{ id: editingImage.id, updates: { title: editingImage.title, caption: editingImage.caption } }],
                      }),
                    });
                    onActivity?.("update", "featured", editingImage.id);
                    setEditingImage(null);
                    onRefresh();
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingImage(null)}
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

