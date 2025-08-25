'use client';
import Head from 'next/head';
import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | PurniaPulse</title>
        <meta name="description" content="Read the privacy policy for PurniaPulse. Learn how we protect your data and respect your privacy." />
        <meta property="og:title" content="Privacy Policy | PurniaPulse" />
        <meta property="og:description" content="Read the privacy policy for PurniaPulse. Learn how we protect your data and respect your privacy." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="PurniaPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | PurniaPulse" />
        <meta name="twitter:description" content="Read the privacy policy for PurniaPulse. Learn how we protect your data and respect your privacy." />
      </Head>

      <div className="w-full flex justify-center px-2 sm:px-4 md:px-6 lg:px-0">
        <motion.div
          className="w-full max-w-3xl py-8 md:py-16"
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
              <li>Email address (for login, access control, and communication)</li>
              <li>Usage data (pages visited, time spent, interactions)</li>
              <li>Device and browser information (for performance optimization)</li>
              <li>Optional profile details (if provided by the user)</li>
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
              <li>To provide and maintain our services and features</li>
              <li>To personalize your experience and content recommendations</li>
              <li>To send updates, newsletters, or service-related messages</li>
              <li>To analyze usage trends and improve platform performance</li>
              <li>To ensure security and prevent unauthorized access</li>
            </ul>
          </motion.div>

          {/* Section: Data Sharing & Disclosure */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-primary mt-8 mb-2">🔐 Data Sharing & Disclosure</h2>
            <p className="text-lg text-gray-700 mb-4">
              We do not sell your personal data. We may share limited information with trusted third-party services that help us operate the platform—such as analytics providers, email services, or cloud infrastructure—under strict confidentiality agreements.
            </p>
            <p className="text-lg text-gray-700">
              We may also disclose information if required by law or to protect the rights and safety of our users and platform.
            </p>
          </motion.div>

          {/* Section: Your Rights & Choices */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-primary mt-8 mb-2">🧭 Your Rights & Choices</h2>
            <ul className="list-disc ml-6 text-lg text-gray-700 space-y-2">
              <li>You can request access to or deletion of your personal data</li>
              <li>You can opt out of non-essential communications</li>
              <li>You can update your account information at any time</li>
              <li>You can disable cookies through your browser settings</li>
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
      </div>
    </>
  );
}
