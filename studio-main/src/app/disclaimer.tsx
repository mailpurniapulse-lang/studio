import React from "react";

export default function DisclaimerPage() {
  return (
    <div className="container max-w-3xl mx-auto py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">Disclaimer</h1>
      <p className="text-lg mb-4">PurniaPulse provides tools and content for informational and educational purposes only. While we strive for accuracy, we make no guarantees regarding the completeness or reliability of any information or tool provided on this site.</p>
      <p className="text-lg mb-4">Use of our tools and content is at your own risk. PurniaPulse is not liable for any damages or losses resulting from the use of our platform.</p>
      <p className="text-lg mt-8">For questions, please contact us at <a href="mailto:mail.purniapulse@gmail.com" className="text-primary underline">mail.purniapulse@gmail.com</a>.</p>
    </div>
  );
}
