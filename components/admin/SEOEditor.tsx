"use client";

import { useState } from "react";
import type { SEOSettings } from "@/types";

interface SEOEditorProps {
  settings: SEOSettings | null;
  onSave: (settings: SEOSettings) => Promise<void>;
}

export default function SEOEditor({ settings, onSave }: SEOEditorProps) {
  const [formData, setFormData] = useState<SEOSettings>(settings || {
    sitemap_enabled: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving SEO settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Home Page SEO</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.home_meta_description || ""}
              onChange={(e) => setFormData({ ...formData, home_meta_description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              value={formData.home_meta_keywords || ""}
              onChange={(e) => setFormData({ ...formData, home_meta_keywords: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Title
            </label>
            <input
              type="text"
              value={formData.home_og_title || ""}
              onChange={(e) => setFormData({ ...formData, home_og_title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Description
            </label>
            <textarea
              value={formData.home_og_description || ""}
              onChange={(e) => setFormData({ ...formData, home_og_description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Image URL
            </label>
            <input
              type="url"
              value={formData.home_og_image || ""}
              onChange={(e) => setFormData({ ...formData, home_og_image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Other Pages</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Meta Description
            </label>
            <textarea
              value={formData.gallery_meta_description || ""}
              onChange={(e) => setFormData({ ...formData, gallery_meta_description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Meta Description
            </label>
            <textarea
              value={formData.about_meta_description || ""}
              onChange={(e) => setFormData({ ...formData, about_meta_description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Meta Description
            </label>
            <textarea
              value={formData.contact_meta_description || ""}
              onChange={(e) => setFormData({ ...formData, contact_meta_description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Robots.txt Content
        </label>
        <textarea
          value={formData.robots_txt || ""}
          onChange={(e) => setFormData({ ...formData, robots_txt: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
          rows={5}
          placeholder="User-agent: *&#10;Allow: /"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.sitemap_enabled}
            onChange={(e) => setFormData({ ...formData, sitemap_enabled: e.target.checked })}
            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm font-medium text-gray-700">Enable Sitemap Generation</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save SEO Settings"}
      </button>
    </form>
  );
}

