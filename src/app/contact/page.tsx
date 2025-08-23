
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSent(true);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | PurniaPulse</title>
        <meta name="description" content="Contact the PurniaPulse team for questions, suggestions, or business listings. We’d love to hear from you!" />
        <meta property="og:title" content="Contact Us | PurniaPulse" />
        <meta property="og:description" content="Contact the PurniaPulse team for questions, suggestions, or business listings. We’d love to hear from you!" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="PurniaPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | PurniaPulse" />
        <meta name="twitter:description" content="Contact the PurniaPulse team for questions, suggestions, or business listings. We’d love to hear from you!" />
      </Head>
  <div className="w-full flex justify-center px-2 sm:px-4 md:px-6 lg:px-0">
      <motion.div
        className="w-full max-w-2xl py-8 md:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
      <motion.h1
        className="text-4xl md:text-5xl font-bold font-headline mb-6 text-center text-primary"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Contact Us
      </motion.h1>

      <p className="text-center text-gray-600 mb-8">
        Have a question, suggestion, or want to list your business? We’d love to hear from you.
      </p>

      {sent ? (
        <motion.div
          className="bg-green-100 text-green-800 p-4 rounded mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          🎉 Thank you for reaching out to PurniaPulse! We’ve received your message and will reply soon.
        </motion.div>
      ) : (
        <motion.form
          className="space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </motion.form>
      )}

      {/* Optional Quote */}
      <motion.div
        className="mt-12 bg-gray-50 p-6 rounded-lg shadow-md text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <p className="text-lg italic text-gray-800">
          “Every message we receive helps us build a better platform for our community.”
        </p>
        <p className="mt-2 text-gray-600 font-medium">— Team PurniaPulse</p>
      </motion.div>
  </motion.div>
  </div>
    </>
  );
}
