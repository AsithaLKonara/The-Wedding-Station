"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-light mb-4 block">
            About Us
          </span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif font-light text-gray-900 mb-6 tracking-tight">
            The Wedding Station
          </h2>
          <div className="w-24 h-px bg-gray-300 mx-auto" />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              Welcome to The Wedding Station, where we transform your most precious moments
              into timeless memories. With a passion for storytelling and an eye for detail, we
              specialize in capturing the essence of your special day through stunning photography
              and cinematic videography.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed font-light">
              Our team combines artistic vision with technical expertise to deliver images and
              videos that you&apos;ll treasure for a lifetime. From intimate ceremonies to grand
              celebrations, we approach each event with dedication, creativity, and a commitment
              to excellence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-serif font-light text-gray-900 mb-3">
                Our Philosophy
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Every wedding is unique, and we believe in capturing the authentic emotions
                and genuine moments that make your day special. We blend artistic creativity
                with technical precision to create images and films that tell your story.
              </p>
            </div>
            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-serif font-light text-gray-900 mb-3">
                Our Approach
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                We work closely with each couple to understand their vision and style,
                ensuring that every detail is captured beautifully. Our unobtrusive approach
                allows you to enjoy your day while we document it.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-gray-200">
          {[
            {
              title: "Photography",
              description: "Capturing every emotion, every detail, every moment that matters",
              icon: "📸",
            },
            {
              title: "Videography",
              description: "Creating cinematic stories that bring your memories to life",
              icon: "🎬",
            },
            {
              title: "Excellence",
              description: "Dedicated to delivering exceptional quality and service",
              icon: "✨",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-serif font-light text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-light max-w-xs mx-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
