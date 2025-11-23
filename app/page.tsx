"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import VideoReel from "@/components/VideoReel";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import type { SanitizedPost, PostsApiResponse } from "@/types";

export default function Home() {
  const [allPosts, setAllPosts] = useState<SanitizedPost[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SanitizedPost | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/fb/fetch");
        const data: PostsApiResponse = await response.json();
        
        if (data.posts) {
          setAllPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const photos = allPosts.filter((post) => post.type === "photo");
  const videos = allPosts.filter((post) => post.type === "video");

  const handleMediaClick = (post: SanitizedPost) => {
    const posts = post.type === "photo" ? photos : videos;
    const index = posts.findIndex((p) => p.id === post.id);
    setCurrentIndex(index >= 0 ? index : 0);
    setSelectedPost(post);
    setLightboxOpen(true);
  };

  const handleClose = () => {
    setLightboxOpen(false);
    setSelectedPost(null);
  };

  const handleNext = () => {
    const posts = selectedPost?.type === "photo" ? photos : videos;
    const nextIndex = (currentIndex + 1) % posts.length;
    setCurrentIndex(nextIndex);
    setSelectedPost(posts[nextIndex]);
  };

  const handlePrevious = () => {
    const posts = selectedPost?.type === "photo" ? photos : videos;
    const prevIndex = (currentIndex - 1 + posts.length) % posts.length;
    setCurrentIndex(prevIndex);
    setSelectedPost(posts[prevIndex]);
  };

  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our Gallery
            </h2>
            <p className="text-gray-600 text-lg">
              A collection of our finest moments
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4"></div>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-500">Loading gallery...</p>
            </div>
          ) : (
            <Gallery posts={photos} onMediaClick={handleMediaClick} columns={3} />
          )}
        </div>
      </section>

      {/* Video Reel Section */}
      <section id="videos" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Video Reel
            </h2>
            <p className="text-gray-600 text-lg">
              Cinematic stories from our recent work
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4"></div>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-500">Loading videos...</p>
            </div>
          ) : (
            <VideoReel videos={videos} />
          )}
        </div>
      </section>

      <About />
      <ContactForm />
      <Footer />

      {/* Lightbox */}
      {selectedPost && (
        <Lightbox
          isOpen={lightboxOpen}
          post={selectedPost}
          posts={selectedPost.type === "photo" ? photos : videos}
          currentIndex={currentIndex}
          onClose={handleClose}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </main>
  );
}

