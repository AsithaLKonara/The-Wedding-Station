"use client";

import { useState, useEffect } from "react";
import TabNavigation from "@/components/admin/TabNavigation";
import StatsCard from "@/components/admin/StatsCard";
import ContactList from "@/components/admin/ContactList";
import ActivityLog from "@/components/admin/ActivityLog";
import ThemePicker from "@/components/admin/ThemePicker";
import SectionToggle from "@/components/admin/SectionToggle";
import ImageUploader from "@/components/admin/ImageUploader";
import Image from "next/image";
import type {
  FeaturedImage,
  AnalyticsStats,
  ContactSubmission,
  ActivityLog as ActivityLogType,
  HeroContent,
  AboutContent,
  SiteSettings,
  ThemeSettings,
  SectionVisibility,
  GalleryImage,
  Video,
  FacebookStatus,
  SyncHistory,
  SEOSettings,
  AdminUser,
} from "@/types";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Stats
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  
  // Featured Images
  const [featuredImages, setFeaturedImages] = useState<FeaturedImage[]>([]);
  const [selectedFeatured, setSelectedFeatured] = useState<string[]>([]);
  
  // Contacts
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  
  // Activity
  const [activityLogs, setActivityLogs] = useState<ActivityLogType[]>([]);
  
  // Content
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  
  // Theme & Sections
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [sections, setSections] = useState<SectionVisibility | null>(null);
  
  // Gallery
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  
  // Facebook
  const [fbStatus, setFbStatus] = useState<FacebookStatus | null>(null);
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([]);
  
  // SEO
  const [seoSettings, setSeoSettings] = useState<SEOSettings | null>(null);
  
  // Users
  const [users, setUsers] = useState<AdminUser[]>([]);
  
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "content", label: "Content", icon: "📝" },
    { id: "gallery", label: "Gallery", icon: "🖼️" },
    { id: "featured", label: "Featured", icon: "⭐" },
    { id: "contacts", label: "Contacts", icon: "📧" },
    { id: "facebook", label: "Facebook", icon: "📘" },
    { id: "seo", label: "SEO", icon: "🔍" },
    { id: "theme", label: "Theme", icon: "🎨" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "backup", label: "Backup", icon: "💾" },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const statsRes = await fetch("/api/analytics/stats");
      const statsData = await statsRes.json();
      if (statsData.stats) setStats(statsData.stats);

      // Load featured images
      const featuredRes = await fetch("/api/featured");
      const featuredData = await featuredRes.json();
      if (featuredData.images) setFeaturedImages(featuredData.images);

      // Load contacts
      const contactsRes = await fetch("/api/contacts");
      const contactsData = await contactsRes.json();
      if (contactsData.contacts) setContacts(contactsData.contacts);

      // Load activity
      const activityRes = await fetch("/api/activity?limit=20");
      const activityData = await activityRes.json();
      if (activityData.logs) setActivityLogs(activityData.logs);

      // Load content
      const heroRes = await fetch("/api/content/hero");
      const heroData = await heroRes.json();
      if (heroData.content) setHeroContent(heroData.content);

      const aboutRes = await fetch("/api/content/about");
      const aboutData = await aboutRes.json();
      if (aboutData.content) setAboutContent(aboutData.content);

      const settingsRes = await fetch("/api/content/settings");
      const settingsData = await settingsRes.json();
      if (settingsData.settings) setSiteSettings(settingsData.settings);

      // Load theme & sections
      const themeRes = await fetch("/api/theme");
      const themeData = await themeRes.json();
      if (themeData.settings) setTheme(themeData.settings);

      const sectionsRes = await fetch("/api/sections");
      const sectionsData = await sectionsRes.json();
      if (sectionsData.visibility) setSections(sectionsData.visibility);

      // Load gallery
      const galleryRes = await fetch("/api/gallery");
      const galleryData = await galleryRes.json();
      if (galleryData.images) setGalleryImages(galleryData.images);

      const videosRes = await fetch("/api/videos");
      const videosData = await videosRes.json();
      if (videosData.videos) setVideos(videosData.videos);

      // Load Facebook
      const fbRes = await fetch("/api/fb/status");
      const fbData = await fbRes.json();
      if (fbData.status) setFbStatus(fbData.status);

      const syncRes = await fetch("/api/fb/sync/history");
      const syncData = await syncRes.json();
      if (syncData.history) setSyncHistory(syncData.history);

      // Load SEO
      const seoRes = await fetch("/api/seo");
      const seoData = await seoRes.json();
      if (seoData.settings) setSeoSettings(seoData.settings);

      // Load users
      const usersRes = await fetch("/api/users");
      const usersData = await usersRes.json();
      if (usersData.users) setUsers(usersData.users);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleContactStatusChange = async (id: string, status: ContactSubmission["status"]) => {
    try {
      await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setContacts(contacts.map((c) => (c.id === id ? { ...c, status } : c)));
      setMessage({ type: "success", text: "Contact status updated" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update contact" });
    }
  };

  const handleContactDelete = async (id: string) => {
    try {
      await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      setContacts(contacts.filter((c) => c.id !== id));
      setMessage({ type: "success", text: "Contact deleted" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete contact" });
    }
  };

  const handleExportContacts = () => {
    window.open("/api/export?format=csv", "_blank");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Images"
                value={stats?.total_images || 0}
                icon="🖼️"
              />
              <StatsCard
                title="Videos"
                value={stats?.total_videos || 0}
                icon="🎬"
              />
              <StatsCard
                title="Featured"
                value={stats?.featured_count || 0}
                icon="⭐"
              />
              <StatsCard
                title="Contacts"
                value={stats?.total_contacts || 0}
                subtitle={`${stats?.unread_contacts || 0} unread`}
                icon="📧"
              />
            </div>
            <ActivityLog logs={activityLogs} />
          </div>
        );

      case "content":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
              <p className="text-sm text-gray-600 mb-4">Edit hero section content</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Edit Hero
              </button>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">About Section</h3>
              <p className="text-sm text-gray-600 mb-4">Edit about section content</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Edit About
              </button>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Site Settings</h3>
              <p className="text-sm text-gray-600 mb-4">Manage site-wide settings</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Edit Settings
              </button>
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Gallery Images ({galleryImages.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.slice(0, 8).map((img) => (
                  <div key={img.id} className="relative aspect-square">
                    <Image
                      src={img.thumbnail_url || img.image_url}
                      alt={img.title || "Gallery image"}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Videos ({videos.length})</h3>
              <p className="text-sm text-gray-600">Video management coming soon</p>
            </div>
          </div>
        );

      case "featured":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Featured Images ({featuredImages.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredImages.map((img) => (
                  <div key={img.id} className="relative aspect-square">
                    <Image
                      src={img.thumbnail_url || img.image_url}
                      alt={img.title || "Featured"}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "contacts":
        return (
          <ContactList
            contacts={contacts}
            onStatusChange={handleContactStatusChange}
            onDelete={handleContactDelete}
            onExport={handleExportContacts}
          />
        );

      case "facebook":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Connection Status</h3>
              <div className={`p-4 rounded-lg ${fbStatus?.connected ? "bg-green-50" : "bg-red-50"}`}>
                <p className={fbStatus?.connected ? "text-green-800" : "text-red-800"}>
                  {fbStatus?.connected ? "Connected" : "Not Connected"}
                </p>
                {fbStatus?.error && <p className="text-sm mt-2">{fbStatus.error}</p>}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Sync History</h3>
              <div className="space-y-2">
                {syncHistory.slice(0, 10).map((sync) => (
                  <div key={sync.id} className="p-3 bg-gray-50 rounded">
                    <p className="text-sm">{new Date(sync.timestamp).toLocaleString()}</p>
                    <p className="text-xs text-gray-600">{sync.posts_found} posts found</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "seo":
        return (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
            <p className="text-sm text-gray-600">SEO management coming soon</p>
          </div>
        );

      case "theme":
        return (
          <div className="space-y-6">
            {theme && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
                <ThemePicker theme={theme} onChange={setTheme} />
                <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Save Theme
                </button>
              </div>
            )}
            {sections && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Section Visibility</h3>
                <SectionToggle visibility={sections} onChange={setSections} />
                <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Save Visibility
                </button>
              </div>
            )}
          </div>
        );

      case "users":
        return (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Users ({users.length})</h3>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="p-3 bg-gray-50 rounded flex justify-between">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-600">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "backup":
        return (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Backup & Export</h3>
            <div className="space-y-4">
              <button
                onClick={() => window.open("/api/export", "_blank")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Export All Data
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Create Backup
              </button>
            </div>
          </div>
        );

      default:
        return <div>Tab content not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

