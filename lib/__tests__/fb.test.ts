import { fetchPosts, normalizePost } from "../fb";

// Mock fetch globally
global.fetch = jest.fn();

describe("Facebook API functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchPosts", () => {
    it("fetches posts successfully", async () => {
      const mockResponse = {
        data: [
          {
            id: "123",
            message: "Test post",
            created_time: "2024-01-01T00:00:00Z",
            permalink_url: "https://facebook.com/post/123",
          },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchPosts("page123", "token123");
      
      expect(result).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page123"),
        expect.any(Object)
      );
    });

    it("handles API errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({
          error: { message: "Invalid token" },
        }),
      });

      await expect(fetchPosts("page123", "token123")).rejects.toThrow();
    });
  });

  describe("normalizePost", () => {
    it("normalizes a photo post", async () => {
      const mockPost = {
        id: "123",
        type: "photo",
        media_url: "https://example.com/image.jpg",
        caption: "Test caption",
        created_time: "2024-01-01T00:00:00Z",
        permalink_url: "https://facebook.com/post/123",
      };

      // Mock fetchAttachments to return empty (not needed for photo with media_url)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      const result = await normalizePost(mockPost as any, "token123");
      
      expect(result).toEqual({
        id: "123",
        type: "photo",
        media_url: "https://example.com/image.jpg",
        caption: "Test caption",
        created_time: "2024-01-01T00:00:00Z",
        source_link: "https://facebook.com/post/123",
      });
    });

    it("filters out status posts without media", async () => {
      const mockPost = {
        id: "123",
        type: "status",
        created_time: "2024-01-01T00:00:00Z",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      const result = await normalizePost(mockPost as any, "token123");
      
      expect(result).toBeNull();
    });
  });
});

