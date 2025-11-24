"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import Gallery from "@/components/Gallery";
import VideoReel from "@/components/VideoReel";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import { motion } from "framer-motion";
import type { SanitizedPost, PostsApiResponse, FeaturedImage } from "@/types";

export default function Home() {
  const [allPosts, setAllPosts] = useState<SanitizedPost[]>([]);
  const [featuredImages, setFeaturedImages] = useState<FeaturedImage[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SanitizedPost | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);

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

    const fetchFeatured = async () => {
      try {
        const response = await fetch("/api/featured");
        const data = await response.json();
        
        if (data.images) {
          setFeaturedImages(data.images);
        }
      } catch (error) {
        console.error("Error fetching featured images:", error);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchPosts();
    fetchFeatured();
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
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <Hero />
      
      {/* Featured Section */}
      {!featuredLoading && featuredImages.length > 0 && (
        <Featured
          images={featuredImages}
          onImageClick={(image) => {
            // Convert featured image to post-like object for lightbox
            const featuredPost: SanitizedPost = {
              id: image.id,
              type: "photo",
              media_url: image.image_url,
              thumbnail_url: image.thumbnail_url,
              caption: image.caption || image.title,
              created_time: image.created_at,
              source_link: image.image_url,
            };
            setSelectedPost(featuredPost);
            setCurrentIndex(0);
            setLightboxOpen(true);
          }}
        />
      )}
      
      {/* Gallery Section */}
      <section id="gallery" className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-light mb-4 block">
              Portfolio
            </span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif font-light text-gray-900 mb-6 tracking-tight">
              Our Gallery
            </h2>
            <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto mb-8">
              A collection of our finest moments
            </p>
            <div className="w-24 h-px bg-gray-300 mx-auto" />
          </motion.div>
          
          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
              <p className="mt-6 text-gray-400 text-sm uppercase tracking-widest font-light">
                Loading gallery...
              </p>
            </div>
          ) : (
            <Gallery posts={photos} onMediaClick={handleMediaClick} columns={3} />
          )}
        </div>
      </section>

      {/* Video Reel Section */}
      <section id="videos" className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-light mb-4 block">
              Cinematic
            </span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif font-light text-gray-900 mb-6 tracking-tight">
              Video Reel
            </h2>
            <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto mb-8">
              Cinematic stories from our recent work
            </p>
            <div className="w-24 h-px bg-gray-300 mx-auto" />
          </motion.div>
          
          {loading ? (
            <div className="text-center py-32">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
              <p className="mt-6 text-gray-400 text-sm uppercase tracking-widest font-light">
                Loading videos...
              </p>
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
