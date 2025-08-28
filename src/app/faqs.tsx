import Head from 'next/head';
import React from "react";

const faqs = [
  {
    question: "What is PurniaPulse?",
    answer: "PurniaPulse is a platform offering creative tools, tech blogs, and business listings for the community."
  },
  {
    question: "Which tools are available?",
    answer: "We offer an Image Resizer, File Converter, Timetable Creator, and a paid Weekly Timetable tool."
  },
  {
    question: "How do I access the Weekly Timetable tool?",
    answer: "The Weekly Timetable tool is a paid feature. Only users whose email is listed in our permission file can access it."
  },
  {
    question: "Is login required?",
    answer: "Login with Google is required to use most tools and features."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach us via the contact form on the /contact page."
  }
];

export default function FaqsPage() {
  return (
    <>
      <Head>
        <title>FAQs | PurniaPulse</title>
        <meta name="description" content="Frequently asked questions about PurniaPulse, our tools, and our platform." />
        <meta property="og:title" content="FAQs | PurniaPulse" />
        <meta property="og:description" content="Frequently asked questions about PurniaPulse, our tools, and our platform." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="PurniaPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQs | PurniaPulse" />
        <meta name="twitter:description" content="Frequently asked questions about PurniaPulse, our tools, and our platform." />
      </Head>
  <div className="w-full flex justify-center px-2 sm:px-4 md:px-6 lg:px-0">
      <div className="w-full max-w-3xl py-8 md:py-16">
  <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">FAQs</h1>
  <ul className="space-y-6">
        {faqs.map((faq, idx) => (
          <li key={idx}>
            <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
            <p className="text-lg text-muted-foreground">{faq.answer}</p>
          </li>
        ))}
      </ul>
      </div>
    </div>
    </>
  );
}
