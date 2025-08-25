import Head from 'next/head';
import React from "react";

export default function DisclaimerPage() {
  return (
    <>
      <Head>
        <title>Disclaimer | PurniaPulse</title>
        <meta name="description" content="Disclaimer for PurniaPulse. All information is provided in good faith, but we make no warranty regarding accuracy or completeness." />
        <meta property="og:title" content="Disclaimer | PurniaPulse" />
        <meta property="og:description" content="Disclaimer for PurniaPulse. All information is provided in good faith, but we make no warranty regarding accuracy or completeness." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="PurniaPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Disclaimer | PurniaPulse" />
        <meta name="twitter:description" content="Disclaimer for PurniaPulse. All information is provided in good faith, but we make no warranty regarding accuracy or completeness." />
  <link rel="canonical" href="https://purniapulse.in/disclaimer" />
      </Head>
  <div className="w-full flex justify-center px-2 sm:px-4 md:px-6 lg:px-0">
      <div className="w-full max-w-3xl py-8 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-6">Disclaimer</h1>
        <p className="text-lg mb-4">The information provided by PurniaPulse is for general informational purposes only. All information is provided in good faith; however, we make no representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability, or completeness of any information on the site.</p>
        <p className="text-lg mt-8">For questions, please contact us at <a href="mailto:mail.purniapulse@gmail.com" className="text-primary underline">mail.purniapulse@gmail.com</a>.</p>
      </div>
    </div>
    </>
  );
}
