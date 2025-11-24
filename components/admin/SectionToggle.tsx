"use client";

import type { SectionVisibility } from "@/types";

interface SectionToggleProps {
  visibility: SectionVisibility;
  onChange: (visibility: SectionVisibility) => void;
}

export default function SectionToggle({ visibility, onChange }: SectionToggleProps) {
  const toggleSection = (section: keyof SectionVisibility) => {
    onChange({
      ...visibility,
      [section]: !visibility[section],
    });
  };

  const sections: Array<{ key: keyof SectionVisibility; label: string }> = [
    { key: "hero", label: "Hero Section" },
    { key: "featured", label: "Featured Section" },
    { key: "gallery", label: "Gallery Section" },
    { key: "videos", label: "Video Reel Section" },
    { key: "about", label: "About Section" },
    { key: "contact", label: "Contact Section" },
    { key: "footer", label: "Footer" },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div
          key={section.key}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
        >
          <span className="font-medium text-gray-900">{section.label}</span>
          <button
            onClick={() => toggleSection(section.key)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${visibility[section.key] ? "bg-purple-600" : "bg-gray-300"}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${visibility[section.key] ? "translate-x-6" : "translate-x-1"}
              `}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

