import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container max-w-3xl mx-auto py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">About PurniaPulse</h1>
      <p className="text-lg mb-4">PurniaPulse is your all-in-one platform for creative tools, insightful tech blogs, and community-driven business listings. Our mission is to empower users with easy-to-use digital tools and valuable content, all in one place.</p>
      <h2 className="text-2xl font-bold mt-8 mb-2">Our Tools</h2>
      <ul className="list-disc ml-6 text-lg">
        <li>Image Resizer</li>
        <li>File Converter</li>
        <li>Timetable Creator</li>
        <li>Weekly Timetable (Paid)</li>
      </ul>
      <h2 className="text-2xl font-bold mt-8 mb-2">Our Vision</h2>
      <p className="text-lg">We believe in making technology accessible and useful for everyone. Whether you're a student, professional, or business owner, PurniaPulse is here to help you achieve more.</p>
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Author</h3>
        <Image
          className="img-fluid rounded-circle mb-4 px-4"
          src={require("@/public/img/kranti-om-shankar.jpg").default || "/img/kranti-om-shankar.jpg"}
          alt="Profile Image"
          width={160}
          height={160}
          priority
        />
        <p className="text-md">KRANTI OM SHANKAR</p>

        <p className="text-md">Lead Blogger & Content Strategist</p>
        <blockquote className="border-l-4 border-muted pl-4 italic">
          "Sharing insights and stories to help you grow your business online!"
        </blockquote>
      </div>
    </div>
  );
}
