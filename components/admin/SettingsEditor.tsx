"use client";

import { useState } from "react";
import type { SiteSettings } from "@/types";

interface SettingsEditorProps {
  settings: SiteSettings | null;
  onSave: (settings: SiteSettings) => Promise<void>;
}

export default function SettingsEditor({ settings, onSave }: SettingsEditorProps) {
  const [formData, setFormData] = useState<SiteSettings>(settings || {
    site_title: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Title
        </label>
        <input
          type="text"
          value={formData.site_title}
          onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Logo URL
        </label>
        <input
          type="url"
          value={formData.site_logo || ""}
          onChange={(e) => setFormData({ ...formData, site_logo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
        </label>
        <textarea
          value={formData.meta_description || ""}
          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
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
          value={formData.meta_keywords || ""}
          onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="keyword1, keyword2, keyword3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Open Graph Image URL
        </label>
        <input
          type="url"
          value={formData.og_image || ""}
          onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={formData.social_links?.facebook || ""}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, facebook: e.target.value },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={formData.social_links?.instagram || ""}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, instagram: e.target.value },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              value={formData.social_links?.twitter || ""}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, twitter: e.target.value },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube
            </label>
            <input
              type="url"
              value={formData.social_links?.youtube || ""}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, youtube: e.target.value },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Footer Text
        </label>
        <textarea
          value={formData.footer_text || ""}
          onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            value={formData.contact_email || ""}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            value={formData.contact_phone || ""}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}

