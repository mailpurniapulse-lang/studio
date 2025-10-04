import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Discover PurniaPulse — your hub for digital tools, tech insights, and local business empowerment. Learn about our mission, services, and how we help users thrive online."
        />
      </head>

      <div className="container max-w-3xl mx-auto py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">
          About PurniaPulse
        </h1>

        <p className="text-lg mb-4">
          <strong>Purnia Pulse</strong> is a dynamic platform designed to empower individuals, students, and small businesses through accessible digital tools, insightful content, and community-driven resources. Whether you're resizing an image, converting files, or exploring tech trends, we aim to simplify your digital journey.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-2">🌟 Our Mission</h2>
        <p className="text-lg mb-4">
          Our mission is to democratize technology by offering free and premium tools that solve everyday problems. We believe in building a digital ecosystem where creativity, productivity, and community thrive together.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-2">🛠️ What We Offer</h2>
        <ul className="list-disc ml-6 text-lg mb-4">
          <li>🔧 <strong>Image Resizer</strong> – Optimize visuals for web and social media</li>
          <li>📁 <strong>File Converter</strong> – Convert documents, images, and more</li>
          <li>📅 <strong>Timetable Creator</strong> – Plan your week with ease</li>
          <li>💼 <strong>Weekly Timetable (Premium)</strong> – Advanced scheduling for professionals</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-2">🚀 Our Vision</h2>
        <p className="text-lg mb-4">
          We envision a future where digital tools are intuitive, inclusive, and impactful. PurniaPulse is committed to continuous innovation, ensuring our users stay ahead in a fast-changing tech landscape.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-2">🔗 Explore More</h2>
        <p className="text-lg mb-4">
          Dive deeper into our platform:
        </p>
        <ul className="list-disc ml-6 text-lg mb-4">
          <li><Link href="/blog" className="text-blue-600 hover:underline">Tech Blog</Link> – Read insights, tutorials, and trends</li>
          <li><Link href="/tools" className="text-blue-600 hover:underline">Tools Page</Link> – Access all our utilities in one place</li>
          <li><Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link> – Reach out for support or feedback</li>
          <li><Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> – Learn how we protect your data</li>
          <li><Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> – Understand our platform rules</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-2">👤 Meet the Author</h2>
        <div className="flex flex-col items-center text-center mb-8">
          <Image
            className="rounded-full mb-4"
            src={require("@/public/img/kranti-om-shankar.jpg").default || "/img/kranti-om-shankar.jpg"}
            alt="Kranti Om Shankar"
            width={160}
            height={160}
            priority
          />
          <p className="text-md font-semibold">KRANTI OM SHANKAR</p>
          <p className="text-md mb-2">Lead Blogger & Content Strategist</p>
          <blockquote className="border-l-4 border-muted pl-4 italic">
            "Sharing insights and stories to help you grow your business online!"
          </blockquote>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-2">🔐 Trust & Security</h2>
        <p className="text-lg mb-4">
          We take your privacy and security seriously. Our site is protected by SSL encryption to ensure safe browsing and data protection. If you notice any issues, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
        </p>
      </div>
    </>
  );
}
