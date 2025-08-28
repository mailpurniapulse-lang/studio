import React from "react";

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl mx-auto py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">Privacy Policy</h1>
      <p className="text-lg mb-4">Your privacy is important to us. PurniaPulse does not share your personal information with third parties except as necessary to provide our services or as required by law.</p>
      <h2 className="text-2xl font-bold mt-8 mb-2">Information We Collect</h2>
      <ul className="list-disc ml-6 text-lg">
        <li>Email address (for login and access control)</li>
        <li>Usage data (to improve our services)</li>
      </ul>
      <h2 className="text-2xl font-bold mt-8 mb-2">How We Use Your Information</h2>
      <ul className="list-disc ml-6 text-lg">
        <li>To provide and maintain our services</li>
        <li>To communicate with you</li>
        <li>To improve our platform</li>
      </ul>
      <p className="text-lg mt-8">For any privacy-related questions, please contact us at <a href="mailto:mail.purniapulse@gmail.com" className="text-primary underline">mail.purniapulse@gmail.com</a>.</p>
    </div>
  );
}
