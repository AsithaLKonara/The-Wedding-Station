"use client";

import { useState, useEffect } from "react";
import TabNavigation from "@/components/admin/TabNavigation";
import StatsCard from "@/components/admin/StatsCard";
import ContactList from "@/components/admin/ContactList";
import ContactListEnhanced from "@/components/admin/ContactListEnhanced";
import ActivityLog from "@/components/admin/ActivityLog";
import ThemePicker from "@/components/admin/ThemePicker";
import SectionToggle from "@/components/admin/SectionToggle";
import HeroEditor from "@/components/admin/HeroEditor";
import AboutEditor from "@/components/admin/AboutEditor";
import SettingsEditor from "@/components/admin/SettingsEditor";
import SEOEditor from "@/components/admin/SEOEditor";
import GalleryManager from "@/components/admin/GalleryManager";
import VideoManager from "@/components/admin/VideoManager";
import FeaturedManager from "@/components/admin/FeaturedManager";
import UserManager from "@/components/admin/UserManager";
import BackupManager from "@/components/admin/BackupManager";
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
      await logActivity("update", "contact", id, { status });
      setMessage({ type: "success", text: "Contact status updated" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update contact" });
    }
  };

  const handleContactDelete = async (id: string) => {
    try {
      await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      setContacts(contacts.filter((c) => c.id !== id));
      await logActivity("delete", "contact", id);
      setMessage({ type: "success", text: "Contact deleted" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete contact" });
    }
  };

  const handleExportContacts = () => {
    window.open("/api/export?format=csv", "_blank");
  };

  const logActivity = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, unknown>
  ) => {
    try {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {},
        }),
      });
      // Refresh activity logs
      const activityRes = await fetch("/api/activity?limit=20");
      const activityData = await activityRes.json();
      if (activityData.logs) setActivityLogs(activityData.logs);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const handleSaveHero = async (content: HeroContent) => {
    try {
      await fetch("/api/content/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      setHeroContent(content);
      await logActivity("update", "hero", undefined, { title: content.title });
      setMessage({ type: "success", text: "Hero content saved successfully" });
      await loadDashboardData();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save hero content" });
    }
  };

  const handleSaveAbout = async (content: AboutContent) => {
    try {
      await fetch("/api/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      setAboutContent(content);
      await logActivity("update", "about", undefined, { title: content.title });
      setMessage({ type: "success", text: "About content saved successfully" });
      await loadDashboardData();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save about content" });
    }
  };

  const handleSaveSettings = async (settings: SiteSettings) => {
    try {
      await fetch("/api/content/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSiteSettings(settings);
      await logActivity("update", "settings");
      setMessage({ type: "success", text: "Settings saved successfully" });
      await loadDashboardData();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save settings" });
    }
  };

  const handleSaveTheme = async (themeSettings: ThemeSettings) => {
    try {
      await fetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(themeSettings),
      });
      setTheme(themeSettings);
      await logActivity("update", "theme");
      setMessage({ type: "success", text: "Theme saved successfully" });
      await loadDashboardData();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save theme" });
    }
  };

  const handleSaveSections = async (visibility: SectionVisibility) => {
    try {
      await fetch("/api/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visibility),
      });
      setSections(visibility);
      await logActivity("update", "sections");
      setMessage({ type: "success", text: "Section visibility saved successfully" });
      await loadDashboardData();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save section visibility" });
    }
  };

  const handleSaveSEO = async (seoSettings: SEOSettings) => {
    try {
      await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoSettings),
      });
      setSeoSettings(seoSettings);
      await logActivity("update", "seo");
      setMessage({ type: "success", text: "SEO settings saved successfully" });
      await loadDashboardData();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save SEO settings" });
    }
  };

  const handleFacebookSync = async () => {
    try {
      const response = await fetch("/api/fb/sync", { method: "POST" });
      const data = await response.json();
      if (data.posts) {
        await logActivity("sync", "facebook", undefined, { posts_found: data.posts.length });
        setMessage({ type: "success", text: `Synced ${data.posts.length} posts from Facebook` });
        await loadDashboardData();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to sync" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to sync Facebook posts" });
    }
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
              <HeroEditor content={heroContent} onSave={handleSaveHero} />
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">About Section</h3>
              <AboutEditor content={aboutContent} onSave={handleSaveAbout} />
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Site Settings</h3>
              <SettingsEditor settings={siteSettings} onSave={handleSaveSettings} />
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="space-y-6">
            <GalleryManager
              images={galleryImages}
              onRefresh={loadDashboardData}
              onActivity={logActivity}
            />
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Videos</h3>
              <VideoManager
                videos={videos}
                onRefresh={loadDashboardData}
                onActivity={logActivity}
              />
            </div>
          </div>
        );

      case "featured":
        return (
          <FeaturedManager
            images={featuredImages}
            onRefresh={loadDashboardData}
            onActivity={logActivity}
          />
        );

      case "contacts":
        return (
          <ContactListEnhanced
            contacts={contacts}
            onStatusChange={handleContactStatusChange}
            onDelete={handleContactDelete}
            onExport={handleExportContacts}
            onBulkAction={async (action, ids) => {
              if (action === "delete") {
                for (const id of ids) {
                  await handleContactDelete(id);
                }
              }
            }}
          />
        );

      case "facebook":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Connection Status</h3>
              <div className={`p-4 rounded-lg mb-4 ${fbStatus?.connected ? "bg-green-50" : "bg-red-50"}`}>
                <p className={fbStatus?.connected ? "text-green-800" : "text-red-800"}>
                  {fbStatus?.connected ? "✅ Connected" : "❌ Not Connected"}
                </p>
                {fbStatus?.error && <p className="text-sm mt-2">{fbStatus.error}</p>}
                {fbStatus?.page_id && <p className="text-sm mt-2">Page ID: {fbStatus.page_id}</p>}
                {fbStatus?.last_sync && (
                  <p className="text-sm mt-2">Last Sync: {new Date(fbStatus.last_sync).toLocaleString()}</p>
                )}
              </div>
              <button
                onClick={handleFacebookSync}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Sync Now
              </button>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Sync History</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {syncHistory.length === 0 ? (
                  <p className="text-sm text-gray-500">No sync history yet</p>
                ) : (
                  syncHistory.map((sync) => (
                    <div
                      key={sync.id}
                      className={`p-3 rounded ${
                        sync.status === "success" ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(sync.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {sync.posts_found} posts found • {sync.posts_added} added
                          </p>
                          {sync.error && <p className="text-xs text-red-600 mt-1">{sync.error}</p>}
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            sync.status === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sync.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "seo":
        return (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
            <SEOEditor settings={seoSettings} onSave={handleSaveSEO} />
          </div>
        );

      case "theme":
        return (
          <div className="space-y-6">
            {theme && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
                <ThemePicker theme={theme} onChange={setTheme} />
                <button
                  onClick={() => handleSaveTheme(theme)}
                  className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Theme
                </button>
              </div>
            )}
            {sections && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Section Visibility</h3>
                <SectionToggle visibility={sections} onChange={setSections} />
                <button
                  onClick={() => handleSaveSections(sections)}
                  className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Visibility
                </button>
              </div>
            )}
          </div>
        );

      case "users":
        return (
          <UserManager
            users={users}
            onRefresh={loadDashboardData}
            onActivity={logActivity}
          />
        );

      case "backup":
        return (
          <BackupManager onRefresh={loadDashboardData} />
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

