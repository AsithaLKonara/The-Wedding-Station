"use client";

import { useState } from "react";
import type { AboutContent } from "@/types";

interface AboutEditorProps {
  content: AboutContent | null;
  onSave: (content: AboutContent) => Promise<void>;
}

export default function AboutEditor({ content, onSave }: AboutEditorProps) {
  const [formData, setFormData] = useState<AboutContent>(content || {
    title: "",
    paragraphs: [""],
    features: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving about content:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addParagraph = () => {
    setFormData({
      ...formData,
      paragraphs: [...formData.paragraphs, ""],
    });
  };

  const removeParagraph = (index: number) => {
    setFormData({
      ...formData,
      paragraphs: formData.paragraphs.filter((_, i) => i !== index),
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: "", description: "", icon: "📸" }],
    });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
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
          Paragraphs
        </label>
        {formData.paragraphs.map((para, index) => (
          <div key={index} className="mb-4 flex gap-2">
            <textarea
              value={para}
              onChange={(e) => {
                const newParagraphs = [...formData.paragraphs];
                newParagraphs[index] = e.target.value;
                setFormData({ ...formData, paragraphs: newParagraphs });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
            <button
              type="button"
              onClick={() => removeParagraph(index)}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addParagraph}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          + Add Paragraph
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Philosophy Title
          </label>
          <input
            type="text"
            value={formData.philosophy?.title || ""}
            onChange={(e) => setFormData({
              ...formData,
              philosophy: { ...formData.philosophy, title: e.target.value, description: formData.philosophy?.description || "" },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Philosophy Description
          </label>
          <textarea
            value={formData.philosophy?.description || ""}
            onChange={(e) => setFormData({
              ...formData,
              philosophy: { ...formData.philosophy, title: formData.philosophy?.title || "", description: e.target.value },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approach Title
          </label>
          <input
            type="text"
            value={formData.approach?.title || ""}
            onChange={(e) => setFormData({
              ...formData,
              approach: { ...formData.approach, title: e.target.value, description: formData.approach?.description || "" },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approach Description
          </label>
          <textarea
            value={formData.approach?.description || ""}
            onChange={(e) => setFormData({
              ...formData,
              approach: { ...formData.approach, title: formData.approach?.title || "", description: e.target.value },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feature Cards
        </label>
        {formData.features.map((feature, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-3 gap-4 mb-2">
              <input
                type="text"
                placeholder="Icon (emoji)"
                value={feature.icon}
                onChange={(e) => {
                  const newFeatures = [...formData.features];
                  newFeatures[index].icon = e.target.value;
                  setFormData({ ...formData, features: newFeatures });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Title"
                value={feature.title}
                onChange={(e) => {
                  const newFeatures = [...formData.features];
                  newFeatures[index].title = e.target.value;
                  setFormData({ ...formData, features: newFeatures });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                Remove
              </button>
            </div>
            <textarea
              placeholder="Description"
              value={feature.description}
              onChange={(e) => {
                const newFeatures = [...formData.features];
                newFeatures[index].description = e.target.value;
                setFormData({ ...formData, features: newFeatures });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          + Add Feature
        </button>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save About Content"}
      </button>
    </form>
  );
}

