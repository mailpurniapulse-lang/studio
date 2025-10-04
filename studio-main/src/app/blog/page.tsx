import { redirect } from 'next/navigation';
import Head from 'next/head';

export default function BlogPage() {
  redirect('/blog/english');
  return (
    <>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Explore insightful blogs and articles on PurniaPulse covering tech, business, and community topics." />
        <link rel="canonical" href="https://purniapulse.in/blog" />
      </head>
    </>
  );
}
// ...removed leftover JSX...

