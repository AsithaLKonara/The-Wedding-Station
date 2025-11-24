/**
 * Facebook API Types
 */
export interface FacebookPost {
  id: string;
  type?: "photo" | "video" | "status";
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  message?: string; // Facebook API returns 'message' field
  created_time: string;
  source_link?: string;
  permalink_url?: string;
  attachments?: {
    data?: FacebookAttachment[];
  };
}

export interface FacebookApiResponse {
  data: FacebookPost[];
  paging?: {
    next?: string;
    previous?: string;
  };
}

export interface FacebookAttachment {
  media: {
    image?: {
      src: string;
      width: number;
      height: number;
    };
    video?: {
      src: string;
    };
  };
  type: string;
  target?: {
    id: string;
    url: string;
  };
}

/**
 * Sanitized Post Schema (exposed to frontend)
 */
export interface SanitizedPost {
  id: string;
  type: "photo" | "video";
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  created_time: string;
  source_link: string;
}

export interface PostsApiResponse {
  posts: SanitizedPost[];
  cached: boolean;
  cache_age_seconds?: number;
  last_updated?: string;
  error?: string;
}

/**
 * Contact Form Types
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Component Props Types
 */
export interface MediaCardProps {
  post: SanitizedPost;
  onOpen?: (post: SanitizedPost) => void;
  index?: number;
}

export interface GalleryProps {
  posts: SanitizedPost[];
  onMediaClick?: (post: SanitizedPost) => void;
  columns?: number;
}

export interface LightboxProps {
  isOpen: boolean;
  post: SanitizedPost | null;
  posts: SanitizedPost[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface VideoReelProps {
  videos: SanitizedPost[];
}

export interface PostFeedProps {
  initialPosts?: SanitizedPost[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

/**
 * Featured Images Types
 */
export interface FeaturedImage {
  id: string;
  image_url: string;
  thumbnail_url?: string;
  title?: string;
  caption?: string;
  order: number;
  created_at: string;
}

export interface FeaturedImagesApiResponse {
  images: FeaturedImage[];
  success: boolean;
  error?: string;
}

/**
 * Hero Section Types
 */
export interface HeroContent {
  background_image?: string;
  title: string;
  subtitle: string;
  cta_primary?: {
    text: string;
    link: string;
  };
  cta_secondary?: {
    text: string;
    link: string;
  };
}

/**
 * About Section Types
 */
export interface AboutContent {
  title: string;
  paragraphs: string[];
  philosophy?: {
    title: string;
    description: string;
  };
  approach?: {
    title: string;
    description: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

/**
 * Site Settings Types
 */
export interface SiteSettings {
  site_title: string;
  site_logo?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  footer_text?: string;
  contact_email?: string;
  contact_phone?: string;
}

/**
 * Gallery Types
 */
export interface GalleryImage {
  id: string;
  image_url: string;
  thumbnail_url?: string;
  title?: string;
  caption?: string;
  album?: string;
  category?: string;
  order: number;
  created_at: string;
}

/**
 * Video Types
 */
export interface Video {
  id: string;
  video_url: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  duration?: number;
  created_at: string;
}

/**
 * Contact Submission Types
 */
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
  read_at?: string;
  replied_at?: string;
}

/**
 * Analytics Types
 */
export interface AnalyticsStats {
  total_images: number;
  total_videos: number;
  featured_count: number;
  facebook_posts: number;
  last_sync_time?: string;
  total_contacts: number;
  unread_contacts: number;
}

export interface PerformanceMetric {
  timestamp: string;
  page_load_time?: number;
  upload_success_rate?: number;
  api_response_time?: number;
}

/**
 * Facebook Sync Types
 */
export interface FacebookStatus {
  connected: boolean;
  page_id?: string;
  token_expires_at?: string;
  last_sync?: string;
  error?: string;
}

export interface SyncHistory {
  id: string;
  timestamp: string;
  status: "success" | "error";
  posts_found: number;
  posts_added: number;
  error?: string;
}

/**
 * SEO Types
 */
export interface SEOSettings {
  home_meta_description?: string;
  home_meta_keywords?: string;
  home_og_title?: string;
  home_og_description?: string;
  home_og_image?: string;
  gallery_meta_description?: string;
  about_meta_description?: string;
  contact_meta_description?: string;
  sitemap_enabled: boolean;
  robots_txt?: string;
}

/**
 * User Types
 */
export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  role: "admin" | "editor";
  created_at: string;
  last_login?: string;
}

/**
 * Activity Log Types
 */
export interface ActivityLog {
  id: string;
  user_id: string;
  username: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Theme Types
 */
export interface ThemeSettings {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  layout_style: "default" | "minimal" | "modern";
}

/**
 * Section Visibility Types
 */
export interface SectionVisibility {
  hero: boolean;
  featured: boolean;
  gallery: boolean;
  videos: boolean;
  about: boolean;
  contact: boolean;
  footer: boolean;
}

/**
 * Backup Types
 */
export interface Backup {
  id: string;
  filename: string;
  created_at: string;
  size: number;
  includes: string[];
}

