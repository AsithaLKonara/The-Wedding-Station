"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            About The Wedding Station
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Welcome to The Wedding Station, where we transform your most precious moments
            into timeless memories. With a passion for storytelling and an eye for detail, we
            specialize in capturing the essence of your special day through stunning photography
            and cinematic videography.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Our team combines artistic vision with technical expertise to deliver images and
            videos that you'll treasure for a lifetime. From intimate ceremonies to grand
            celebrations, we approach each event with dedication, creativity, and a commitment
            to excellence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center p-6 rounded-2xl bg-gray-50"
            >
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Photography
              </h3>
              <p className="text-gray-600">
                Capturing every emotion, every detail, every moment that matters
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6 rounded-2xl bg-gray-50"
            >
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Videography
              </h3>
              <p className="text-gray-600">
                Creating cinematic stories that bring your memories to life
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 rounded-2xl bg-gray-50"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Excellence
              </h3>
              <p className="text-gray-600">
                Dedicated to delivering exceptional quality and service
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

