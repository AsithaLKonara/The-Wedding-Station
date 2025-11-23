import { render, screen, fireEvent } from "@testing-library/react";
import MediaCard from "../MediaCard";
import type { SanitizedPost } from "@/types";

const mockPost: SanitizedPost = {
  id: "123",
  type: "photo",
  media_url: "https://example.com/image.jpg",
  caption: "Test caption",
  created_time: "2024-01-01T00:00:00Z",
  source_link: "https://facebook.com/post/123",
};

describe("MediaCard", () => {
  it("renders photo card correctly", () => {
    render(<MediaCard post={mockPost} />);
    
    expect(screen.getByAltText("Test caption")).toBeInTheDocument();
    expect(screen.getByText("photo")).toBeInTheDocument();
  });

  it("renders video card correctly", () => {
    const videoPost: SanitizedPost = {
      ...mockPost,
      type: "video",
      thumbnail_url: "https://example.com/thumb.jpg",
    };
    
    render(<MediaCard post={videoPost} />);
    
    expect(screen.getByAltText("Video thumbnail")).toBeInTheDocument();
    expect(screen.getByText("video")).toBeInTheDocument();
  });

  it("calls onOpen when clicked", () => {
    const handleOpen = jest.fn();
    render(<MediaCard post={mockPost} onOpen={handleOpen} />);
    
    const card = screen.getByRole("button");
    fireEvent.click(card);
    
    expect(handleOpen).toHaveBeenCalledWith(mockPost);
  });

  it("handles keyboard navigation", () => {
    const handleOpen = jest.fn();
    render(<MediaCard post={mockPost} onOpen={handleOpen} />);
    
    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });
    
    expect(handleOpen).toHaveBeenCalledWith(mockPost);
  });
});

