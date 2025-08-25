'use client';

import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'How do I contact support?',
    answer: 'You can reach us via the contact form on the /contact page.',
  },
  {
    question: 'Is PurniaPulse free to use?',
    answer: 'Most tools are free. The Weekly Timetable tool requires a paid account.',
  },
  {
    question: 'How do I add my business to listings?',
    answer: "Use the 'Add Listing' button on the listings page.",
  },
];

export default function FaqsPage() {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://purniapulse.in/faqs" />
      </Head>
      <motion.div
        className="container max-w-3xl mx-auto py-12 md:py-16 px-4"
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
          Frequently Asked Questions
        </motion.h1>

        <p className="text-center text-gray-600 mb-10">
          Got questions? We’ve got answers. Here are some of the most common things people ask us.
        </p>

        <ul className="space-y-8">
          {faqs.map((faq, idx) => (
            <motion.li
              key={idx}
              className="border-b pb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800 transition hover:text-blue-600">
                {faq.question}
              </h2>
              <p className="text-lg text-gray-700">{faq.answer}</p>
            </motion.li>
          ))}
        </ul>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-500 italic">
          Still curious? Reach out anytime — we’re here to help.
        </div>
      </motion.div>
    </>
  );
}