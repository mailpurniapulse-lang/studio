'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray text-white-800 py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Profile Image */}
        <motion.img
          src="/img/blog/kranti-om-shankar.jpg"
          alt="Profile Image"
          className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Title & Intro */}
        <motion.h1
          className="text-4xl font-bold text-primary mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to PurniaPulse
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your digital companion for creative tools, tech insights, and local business empowerment.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <a
            href="/tools"
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Explore Tools
          </a>
          <a
            href="/community"
            className="bg-gray-100 text-blue-600 px-6 py-2 rounded-full hover:bg-gray-200 transition"
          >
            Join the Community
          </a>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left mt-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-2">🚀 Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              We simplify digital life with intuitive tools and meaningful content. Whether you're resizing images,
              converting files, or planning your week—PurniaPulse is built to empower.
            </p>
          </motion.div>

          {/* Tools */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-primary mb-2">🛠️ Our Tools</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="transition hover:scale-[1.02]">• Image Resizer</li>
              <li className="transition hover:scale-[1.02]">• File Converter</li>
              <li className="transition hover:scale-[1.02]">• Timetable Creator</li>
              <li className="transition hover:scale-[1.02]">• Weekly Timetable <span className="text-red-500">(Premium)</span></li>
            </ul>
          </motion.div>

          {/* Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <h2 className="text-2xl font-semibold text-primary mb-2">📚 Tech Blogs</h2>
            <p className="text-gray-700 leading-relaxed">
              Dive into our blog for tech tutorials, productivity hacks, and digital trends. Whether you're a curious
              learner or a seasoned pro, there's something for you.
              <br />
              <a href="/blog" className="text-blue-600 underline hover:text-blue-800">Read our latest posts →</a>
            </p>
          </motion.div>

          {/* Business Listings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <h2 className="text-2xl font-semibold text-primary mb-2">🏪 Business Listings</h2>
            <p className="text-gray-700 leading-relaxed">
              Are you a local business owner in Purnia or nearby? Get listed on PurniaPulse and reach your community.
              <br />
              <span className="font-medium">To get listed:</span> Send us your business name, contact info, category, and a short description.
              <br />
              <a href="/contact" className="text-blue-600 underline hover:text-blue-800">Contact us to get started →</a>
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <h2 className="text-2xl font-semibold text-primary mb-2">🌍 Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              We believe technology should be accessible, empowering, and human-centered. From students organizing
              their week to local shops reaching new customers—PurniaPulse is built to serve and grow with you.
            </p>
          </motion.div>
        </div>

        {/* Testimonial / Quote */}
        <motion.div
          className="mt-16 bg-gray-50 p-6 rounded-lg shadow-md max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-xl italic text-gray-800">
            “PurniaPulse was born from a simple idea: to make digital tools and local connections more accessible to everyone.
            We’re not just building a platform—we’re building a movement.”
          </p>
          <p className="mt-4 text-right text-gray-600 font-medium">— Kranti Om Shankar, Founder</p>
        </motion.div>

        {/* Footer Note */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 italic">
            Built with ❤️ in Purnia. Join the pulse of progress.
          </p>
        </div>
      </div>
    </div>
  );
}
