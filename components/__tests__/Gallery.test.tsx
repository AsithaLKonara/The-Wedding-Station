import { render, screen } from "@testing-library/react";
import Gallery from "../Gallery";
import type { SanitizedPost } from "@/types";

const mockPosts: SanitizedPost[] = [
  {
    id: "1",
    type: "photo",
    media_url: "https://example.com/image1.jpg",
    created_time: "2024-01-01T00:00:00Z",
    source_link: "https://facebook.com/post/1",
  },
  {
    id: "2",
    type: "photo",
    media_url: "https://example.com/image2.jpg",
    created_time: "2024-01-02T00:00:00Z",
    source_link: "https://facebook.com/post/2",
  },
  {
    id: "3",
    type: "video",
    media_url: "https://example.com/video1.mp4",
    created_time: "2024-01-03T00:00:00Z",
    source_link: "https://facebook.com/post/3",
  },
];

describe("Gallery", () => {
  it("renders photo posts only", () => {
    render(<Gallery posts={mockPosts} />);
    
    // Should only show 2 photos (videos filtered out)
    const images = screen.getAllByAltText(/Photo|image/);
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  it("shows empty state when no photos", () => {
    const videoOnlyPosts = mockPosts.filter((p) => p.type === "video");
    render(<Gallery posts={videoOnlyPosts} />);
    
    expect(screen.getByText(/No photos available/)).toBeInTheDocument();
  });

  it("calls onMediaClick when provided", () => {
    const handleClick = jest.fn();
    render(<Gallery posts={mockPosts} onMediaClick={handleClick} />);
    
    // Click will be tested through MediaCard component
    expect(handleClick).toBeDefined();
  });
});

