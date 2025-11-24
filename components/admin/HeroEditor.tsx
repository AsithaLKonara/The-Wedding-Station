"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import type { HeroContent } from "@/types";

interface HeroEditorProps {
  content: HeroContent | null;
  onSave: (content: HeroContent) => Promise<void>;
}

export default function HeroEditor({ content, onSave }: HeroEditorProps) {
  const [formData, setFormData] = useState<HeroContent>(content || {
    title: "",
    subtitle: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(content?.background_image || null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let backgroundImage = formData.background_image;

      // Upload image if file selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);

        const uploadRes = await fetch("/api/featured", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.image) {
          backgroundImage = uploadData.image.image_url;
        }
      }

      const contentToSave: HeroContent = {
        ...formData,
        background_image: backgroundImage,
      };

      await onSave(contentToSave);
    } catch (error) {
      console.error("Error saving hero content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle
        </label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Image
        </label>
        <ImageUploader
          onFileSelect={handleFileSelect}
          previewUrl={previewUrl}
          onRemove={() => {
            setSelectedFile(null);
            setPreviewUrl(null);
            setFormData({ ...formData, background_image: undefined });
          }}
        />
        {!selectedFile && formData.background_image && (
          <input
            type="text"
            value={formData.background_image}
            onChange={(e) => setFormData({ ...formData, background_image: e.target.value })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Or enter image URL"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary CTA Text
          </label>
          <input
            type="text"
            value={formData.cta_primary?.text || ""}
            onChange={(e) => setFormData({
              ...formData,
              cta_primary: { ...formData.cta_primary, text: e.target.value, link: formData.cta_primary?.link || "#gallery" },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary CTA Link
          </label>
          <input
            type="text"
            value={formData.cta_primary?.link || ""}
            onChange={(e) => setFormData({
              ...formData,
              cta_primary: { ...formData.cta_primary, text: formData.cta_primary?.text || "View Portfolio", link: e.target.value },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary CTA Text
          </label>
          <input
            type="text"
            value={formData.cta_secondary?.text || ""}
            onChange={(e) => setFormData({
              ...formData,
              cta_secondary: { ...formData.cta_secondary, text: e.target.value, link: formData.cta_secondary?.link || "#contact" },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary CTA Link
          </label>
          <input
            type="text"
            value={formData.cta_secondary?.link || ""}
            onChange={(e) => setFormData({
              ...formData,
              cta_secondary: { ...formData.cta_secondary, text: formData.cta_secondary?.text || "Get In Touch", link: e.target.value },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Hero Content"}
      </button>
    </form>
  );
}

