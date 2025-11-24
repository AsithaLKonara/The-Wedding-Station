"use client";

import { useState } from "react";
import type { Video } from "@/types";

interface VideoManagerProps {
  videos: Video[];
  onRefresh: () => void;
  onActivity?: (action: string, resourceType: string, resourceId?: string) => void;
}

export default function VideoManager({ videos, onRefresh, onActivity }: VideoManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          title,
          description,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onActivity?.("create", "video", data.video?.id);
        setVideoUrl("");
        setThumbnailUrl("");
        setTitle("");
        setDescription("");
        onRefresh();
      }
    } catch (error) {
      console.error("Error adding video:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;

    try {
      await fetch(`/api/videos/${id}`, { method: "DELETE" });
      onActivity?.("delete", "video", id);
      onRefresh();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleEdit = async (video: Video) => {
    try {
      await fetch(`/api/videos/${video.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: video.title,
          description: video.description,
          thumbnail_url: video.thumbnail_url,
        }),
      });
      onActivity?.("update", "video", video.id);
      setEditingVideo(null);
      onRefresh();
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Video Form */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Add New Video</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://youtube.com/... or direct video URL"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL (optional)
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://..."
            />
          </div>

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
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isUploading ? "Adding..." : "Add Video"}
          </button>
        </form>
      </div>

      {/* Videos List */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Videos ({videos.length})</h3>
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="p-4 border border-gray-200 rounded-lg flex items-start gap-4">
              {video.thumbnail_url && (
                <div className="relative w-32 h-20 flex-shrink-0">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title || "Video thumbnail"}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold">{video.title || "Untitled Video"}</h4>
                {video.description && (
                  <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">{video.video_url}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingVideo(video)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
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
      {editingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Video</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingVideo.title || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingVideo.description || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={editingVideo.thumbnail_url || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(editingVideo)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingVideo(null)}
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

