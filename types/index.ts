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

