"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import ImageUploader from "./ImageUploader";
import SearchFilter from "./SearchFilter";
import DragDropGrid from "./DragDropGrid";
import LoadingSkeleton from "./LoadingSkeleton";
import type { GalleryImage } from "@/types";

interface GalleryManagerProps {
  images: GalleryImage[];
  onRefresh: () => void;
  onActivity?: (action: string, resourceType: string, resourceId?: string, details?: Record<string, unknown>) => void;
}

export default function GalleryManager({ images, onRefresh, onActivity }: GalleryManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [album, setAlbum] = useState("");
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      if (album) formData.append("album", album);

      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        onActivity?.("create", "gallery", data.image?.id);
        setSelectedFile(null);
        setPreviewUrl(null);
        setImageUrl("");
        setTitle("");
        setCaption("");
        setAlbum("");
        onRefresh();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      onActivity?.("delete", "gallery", id);
      onRefresh();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleEdit = async (image: GalleryImage) => {
    try {
      await fetch(`/api/gallery/${image.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: image.title,
          caption: image.caption,
          album: image.album,
        }),
      });
      onActivity?.("update", "gallery", image.id);
      setEditingImage(null);
      onRefresh();
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  // Filter and search images
  const filteredImages = useMemo(() => {
    let filtered = images;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (img) =>
          img.title?.toLowerCase().includes(query) ||
          img.caption?.toLowerCase().includes(query) ||
          img.album?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.album) {
      filtered = filtered.filter((img) => img.album === filters.album);
    }
    if (filters.category) {
      filtered = filtered.filter((img) => img.category === filters.category);
    }

    return filtered;
  }, [images, searchQuery, filters]);

  // Get unique albums and categories for filter options
  const albums = useMemo(() => {
    const unique = Array.from(new Set(images.map((img) => img.album).filter(Boolean) as string[]));
    return unique.map((album) => ({ value: album, label: album }));
  }, [images]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(images.map((img) => img.category).filter(Boolean) as string[]));
    return unique.map((category) => ({ value: category, label: category }));
  }, [images]);

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    if (!confirm(`Delete ${selectedImages.length} selected images?`)) return;

    setIsLoading(true);
    try {
      for (const id of selectedImages) {
        await fetch(`/api/gallery/${id}`, { method: "DELETE" });
        onActivity?.("delete", "gallery", id);
      }
      setSelectedImages([]);
      onRefresh();
    } catch (error) {
      console.error("Error bulk deleting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (reordered: GalleryImage[]) => {
    setIsLoading(true);
    try {
      const updates = reordered.map((img, index) => ({
        id: img.id,
        order: index,
      }));
      await fetch("/api/gallery/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      onActivity?.("reorder", "gallery", undefined, { count: updates.length });
      onRefresh();
    } catch (error) {
      console.error("Error reordering:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <SearchFilter
          onSearch={setSearchQuery}
          onFilter={setFilters}
          placeholder="Search images by title, caption, or album..."
          filterOptions={[
            {
              label: "Album",
              key: "album",
              type: "select",
              options: albums,
            },
            {
              label: "Category",
              key: "category",
              type: "select",
              options: categories,
            },
          ]}
        />
      </div>

      {/* Bulk Actions */}
      {selectedImages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">
            {selectedImages.length} image(s) selected
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
          >
            {isLoading ? "Deleting..." : "Delete Selected"}
          </button>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Upload New Image</h3>
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

          <div className="grid grid-cols-2 gap-4">
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
                Album/Category
              </label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
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
            {isUploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">
          Gallery Images ({filteredImages.length} of {images.length})
        </h3>
        {isLoading ? (
          <LoadingSkeleton variant="image" count={8} className="grid grid-cols-2 md:grid-cols-4 gap-4" />
        ) : filteredImages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No images found</p>
        ) : (
          <DragDropGrid
            items={filteredImages}
            onReorder={handleReorder}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            renderItem={(img) => (
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
                    alt={img.title || "Gallery image"}
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
                {img.title && (
                  <p className="mt-2 text-sm font-medium truncate">{img.title}</p>
                )}
              </div>
            )}
          />
        )}
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Image</h3>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Album
                </label>
                <input
                  type="text"
                  value={editingImage.album || ""}
                  onChange={(e) => setEditingImage({ ...editingImage, album: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(editingImage)}
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

