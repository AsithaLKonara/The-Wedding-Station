"use client";

import type { ThemeSettings } from "@/types";

interface ThemePickerProps {
  theme: ThemeSettings;
  onChange: (theme: ThemeSettings) => void;
}

export default function ThemePicker({ theme, onChange }: ThemePickerProps) {
  const updateTheme = (updates: Partial<ThemeSettings>) => {
    onChange({ ...theme, ...updates });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <input
          type="color"
          value={theme.primary_color}
          onChange={(e) => updateTheme({ primary_color: e.target.value })}
          className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secondary Color
        </label>
        <input
          type="color"
          value={theme.secondary_color}
          onChange={(e) => updateTheme({ secondary_color: e.target.value })}
          className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accent Color
        </label>
        <input
          type="color"
          value={theme.accent_color}
          onChange={(e) => updateTheme({ accent_color: e.target.value })}
          className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <select
          value={theme.font_family}
          onChange={(e) => updateTheme({ font_family: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans Serif</option>
          <option value="monospace">Monospace</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Layout Style
        </label>
        <select
          value={theme.layout_style}
          onChange={(e) => updateTheme({ layout_style: e.target.value as ThemeSettings["layout_style"] })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="default">Default</option>
          <option value="minimal">Minimal</option>
          <option value="modern">Modern</option>
        </select>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Preview:</p>
        <div
          className="p-4 rounded-lg text-white"
          style={{ backgroundColor: theme.primary_color }}
        >
          <p style={{ fontFamily: theme.font_family }}>
            Sample text with your theme colors
          </p>
        </div>
      </div>
    </div>
  );
}

