"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import type { ContactFormData, ContactApiResponse } from "@/types";

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: ContactApiResponse = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Thank you! Your message has been sent.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          subject: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-light mb-4 block">
            Contact
          </span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif font-light text-gray-900 mb-6 tracking-tight">
            Get In Touch
          </h2>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto mb-8">
            Let's discuss how we can make your special day unforgettable
          </p>
          <div className="w-24 h-px bg-gray-300 mx-auto" />
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="name"
                className="block text-xs uppercase tracking-widest text-gray-600 mb-3 font-light"
              >
                Name <span className="text-gray-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none transition-colors text-gray-900 font-light"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-widest text-gray-600 mb-3 font-light"
              >
                Email <span className="text-gray-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none transition-colors text-gray-900 font-light"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="phone"
                className="block text-xs uppercase tracking-widest text-gray-600 mb-3 font-light"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none transition-colors text-gray-900 font-light"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-xs uppercase tracking-widest text-gray-600 mb-3 font-light"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none transition-colors text-gray-900 font-light"
                placeholder="Wedding inquiry"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs uppercase tracking-widest text-gray-600 mb-3 font-light"
            >
              Message <span className="text-gray-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none transition-colors resize-none text-gray-900 font-light"
              placeholder="Tell us about your special day..."
            />
          </div>

          {submitStatus.type && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 border ${
                submitStatus.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {submitStatus.message}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto px-12 py-4 bg-black text-white text-sm uppercase tracking-widest font-light hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
