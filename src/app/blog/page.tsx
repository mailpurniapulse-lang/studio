import { redirect } from 'next/navigation';
import Head from 'next/head';

export default function BlogPage() {
  redirect('/blog/english');
  return (
    <Head>
      <link rel="canonical" href="https://purniapulse.in/blog" />
    </Head>
  );
}
// ...removed leftover JSX...

