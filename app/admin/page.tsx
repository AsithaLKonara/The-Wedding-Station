"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { FeaturedImage } from "@/types";

export default function AdminPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Featured images state
  const [featuredImages, setFeaturedImages] = useState<FeaturedImage[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageCaption, setImageCaption] = useState("");

  // Simple password protection (in production, use proper auth)
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  // Load featured images
  useEffect(() => {
    if (isAuthenticated) {
      loadFeaturedImages();
    }
  }, [isAuthenticated]);

  const loadFeaturedImages = async () => {
    setIsLoadingFeatured(true);
    try {
      const response = await fetch("/api/featured");
      const data = await response.json();
      if (data.images) {
        setFeaturedImages(data.images);
      }
    } catch (error) {
      console.error("Error loading featured images:", error);
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  const handleUploadFeatured = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();

      if (uploadMode === "file") {
        const fileInput = document.getElementById("image-file") as HTMLInputElement;
        if (!fileInput?.files?.[0]) {
          setMessage({ type: "error", text: "Please select an image file" });
          setIsUploading(false);
          return;
        }
        formData.append("file", fileInput.files[0]);
      } else {
        if (!imageUrl.trim()) {
          setMessage({ type: "error", text: "Please provide an image URL" });
          setIsUploading(false);
          return;
        }
        formData.append("image_url", imageUrl);
      }

      if (imageTitle) formData.append("title", imageTitle);
      if (imageCaption) formData.append("caption", imageCaption);

      const response = await fetch("/api/featured", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Featured image added successfully!",
        });
        // Reset form
        setImageUrl("");
        setImageTitle("");
        setImageCaption("");
        if (uploadMode === "file") {
          const fileInput = document.getElementById("image-file") as HTMLInputElement;
          if (fileInput) fileInput.value = "";
        }
        // Reload featured images
        await loadFeaturedImages();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to upload image",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFeatured = async (id: string) => {
    if (!confirm("Are you sure you want to remove this featured image?")) {
      return;
    }

    try {
      const response = await fetch("/api/featured", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Featured image removed successfully!",
        });
        await loadFeaturedImages();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to remove image",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setMessage(null);
    } else {
      setMessage({ type: "error", text: "Incorrect password" });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage(null);

    try {
      const response = await fetch("/api/fb/fetch", {
        method: "POST",
      });

      const data = await response.json();

      if (data.posts) {
        setMessage({
          type: "success",
          text: `Successfully refreshed! Found ${data.posts.length} posts.`,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to refresh posts",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Access
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>
            {message && (
              <div
                className={`p-3 rounded-lg ${
                  message.type === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-green-50 text-green-800"
                }`}
              >
                {message.text}
              </div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Facebook Posts Sync
              </h2>
              <p className="text-gray-600 mb-4">
                Manually refresh the Facebook posts cache. This will fetch the latest
                posts from Facebook and update the cache.
              </p>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefreshing ? "Refreshing..." : "Refresh Posts"}
              </button>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-green-50 text-green-800"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Featured Images Management */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Featured Images
              </h2>
              <p className="text-gray-600 mb-4">
                Add selected images to display in the Featured section (between Hero and Gallery).
                You can upload images directly or provide URLs from Google Drive or other sources.
              </p>

              {/* Upload Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="mb-4">
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
                      Upload File (Cloudinary)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="url"
                        checked={uploadMode === "url"}
                        onChange={(e) => setUploadMode(e.target.value as "file" | "url")}
                        className="mr-2"
                      />
                      Image URL (Google Drive, etc.)
                    </label>
                  </div>
                </div>

                <form onSubmit={handleUploadFeatured} className="space-y-4">
                  {uploadMode === "file" ? (
                    <div>
                      <label
                        htmlFor="image-file"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Image File
                      </label>
                      <input
                        type="file"
                        id="image-file"
                        accept="image/*"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="image-url"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Image URL
                      </label>
                      <input
                        type="url"
                        id="image-url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://drive.google.com/... or direct image URL"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Tip: For Google Drive, use the direct image link format
                      </p>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="image-title"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Title (optional)
                    </label>
                    <input
                      type="text"
                      id="image-title"
                      value={imageTitle}
                      onChange={(e) => setImageTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="image-caption"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Caption (optional)
                    </label>
                    <textarea
                      id="image-caption"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Uploading..." : "Add Featured Image"}
                  </button>
                </form>
              </div>

              {/* Existing Featured Images */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Featured Images ({featuredImages.length})
                </h3>
                {isLoadingFeatured ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-purple-600"></div>
                  </div>
                ) : featuredImages.length === 0 ? (
                  <p className="text-gray-500 text-sm">No featured images yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {featuredImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative group border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={image.thumbnail_url || image.image_url}
                            alt={image.title || "Featured image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-3 bg-white">
                          {image.title && (
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {image.title}
                            </p>
                          )}
                          <button
                            onClick={() => handleDeleteFeatured(image.id)}
                            className="mt-2 w-full px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword("");
                  setMessage(null);
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

