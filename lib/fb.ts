/**
 * Facebook Graph API integration
 * Handles fetching posts, attachments, and normalizing data
 */

import type {
  FacebookPost,
  FacebookApiResponse,
  FacebookAttachment,
  SanitizedPost,
} from "@/types";

const GRAPH_API_BASE = "https://graph.facebook.com/v18.0";

/**
 * Fetch posts from Facebook Graph API
 */
export async function fetchPosts(
  pageId: string,
  accessToken: string
): Promise<FacebookPost[]> {
  const url = `${GRAPH_API_BASE}/${pageId}/posts?fields=id,message,created_time,permalink_url,attachments{media,type,target}&access_token=${accessToken}&limit=50`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 0 }, // Always fetch fresh data
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Facebook API error: ${response.status} - ${error.error?.message || response.statusText}`
      );
    }

    const data: FacebookApiResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching Facebook posts:", error);
    throw error;
  }
}

/**
 * Fetch attachments for a post
 */
export async function fetchAttachments(
  postId: string,
  accessToken: string
): Promise<FacebookAttachment[]> {
  const url = `${GRAPH_API_BASE}/${postId}/attachments?fields=media,type,target&access_token=${accessToken}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching attachments for post ${postId}:`, error);
    return [];
  }
}

/**
 * Normalize Facebook post to sanitized schema
 */
export async function normalizePost(
  post: FacebookPost,
  accessToken: string
): Promise<SanitizedPost | null> {
  // Skip status posts without media
  if (post.type === "status" && !post.media_url) {
    return null;
  }

  let mediaUrl = post.media_url;
  let thumbnailUrl = post.thumbnail_url;
  let postType: "photo" | "video" = post.type === "video" ? "video" : "photo";

  // If no direct media_url, try to get from attachments
  if (!mediaUrl && post.id) {
    try {
      const attachments = await fetchAttachments(post.id, accessToken);
      
      if (attachments.length > 0) {
        const attachment = attachments[0];
        
        if (attachment.media?.image) {
          mediaUrl = attachment.media.image.src;
          postType = "photo";
        } else if (attachment.media?.video) {
          mediaUrl = attachment.media.video.src;
          thumbnailUrl = attachment.media.image?.src;
          postType = "video";
        }
      }
    } catch (error) {
      console.error(`Error processing attachments for post ${post.id}:`, error);
    }
  }

  // Skip if still no media URL
  if (!mediaUrl) {
    return null;
  }

  return {
    id: post.id,
    type: postType,
    media_url: mediaUrl,
    thumbnail_url: thumbnailUrl,
    caption: post.caption || post.message || undefined,
    created_time: post.created_time,
    source_link: post.permalink_url || post.source_link || `https://facebook.com/${post.id}`,
  };
}

/**
 * Fetch and normalize all posts
 */
export async function fetchAndNormalizePosts(
  pageId: string,
  accessToken: string
): Promise<SanitizedPost[]> {
  try {
    const posts = await fetchPosts(pageId, accessToken);
    const normalizedPosts: SanitizedPost[] = [];

    // Process posts in parallel (with limit to avoid rate limits)
    const batchSize = 5;
    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize);
      const normalized = await Promise.all(
        batch.map((post) => normalizePost(post, accessToken))
      );
      
      normalizedPosts.push(
        ...normalized.filter((post): post is SanitizedPost => post !== null)
      );
    }

    return normalizedPosts;
  } catch (error) {
    console.error("Error fetching and normalizing posts:", error);
    throw error;
  }
}

/**
 * Exchange short-lived token for long-lived token
 * Note: This requires app secret and should be done server-side only
 */
export async function exchangeToken(
  shortLivedToken: string,
  appId: string,
  appSecret: string
): Promise<string> {
  const url = `${GRAPH_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.access_token;
  } catch (error) {
    console.error("Error exchanging token:", error);
    throw error;
  }
}

