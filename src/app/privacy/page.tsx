'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <motion.div
      className="container max-w-3xl mx-auto py-12 md:py-16 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl md:text-5xl font-bold font-headline mb-6 text-primary text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Privacy Policy
      </motion.h1>

      <p className="text-lg text-gray-700 mb-6 text-center">
        Your privacy matters. At PurniaPulse, we’re committed to protecting your personal information and being transparent about how we use it.
      </p>

      {/* Section: Information We Collect */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold text-primary mt-8 mb-2">🔍 Information We Collect</h2>
        <ul className="list-disc ml-6 text-lg text-gray-700 space-y-2">
          <li>Email address (for login and access control)</li>
          <li>Usage data (to improve our services)</li>
        </ul>
      </motion.div>

      {/* Section: How We Use It */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold text-primary mt-8 mb-2">💡 How We Use Your Information</h2>
        <ul className="list-disc ml-6 text-lg text-gray-700 space-y-2">
          <li>To provide and maintain our services</li>
          <li>To communicate with you</li>
          <li>To improve our platform</li>
        </ul>
      </motion.div>

      {/* Contact Info */}
      <motion.p
        className="text-lg text-gray-700 mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        For any privacy-related questions, feel free to reach out at{' '}
        <a
          href="mailto:mail.purniapulse@gmail.com"
          className="text-blue-600 underline hover:text-blue-800 transition"
        >
          mail.purniapulse@gmail.com
        </a>.
      </motion.p>

      {/* Footer Note */}
      <div className="mt-12 text-center text-sm text-gray-500 italic">
        Your trust is our priority. Thank you for being part of the PurniaPulse community.
      </div>
    </motion.div>
  );
}
