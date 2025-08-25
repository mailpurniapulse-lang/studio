import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, BookOpen, Store, Wrench, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { ClientOnly } from '@/components/client-only';

const features = [
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'Insightful Blogs',
    description: 'Explore a wide range of articles and tutorials on the latest in web development and tech.',
    link: '/blog',
    linkText: 'Read Blog',
  },
  {
    icon: <Store className="h-8 w-8 text-primary" />,
    title: 'Business Listings',
    description: 'Discover and review local businesses, from cozy cafes to top-tier tech services.',
    link: '/listings',
    linkText: 'Browse Listings',
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: 'Creator Tools',
    description: 'Access a suite of free tools to streamline your workflow. Login required.',
    link: '/tools/image-resizer',
    linkText: 'Explore Tools',
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://purniapulse.in/" />
      </Head>
      <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6 text-center">
          <div className="mb-4">
             <Sparkles className="h-16 w-16 text-accent mx-auto animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary-foreground">
            Welcome to <span className="text-primary">PurniaPulse</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Your friendly corner of the internet for creative tools, insightful content, and community reviews. Let's build something amazing together!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="#features">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/blog">
                Read Our Blog
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ad Placeholder */}
      <ClientOnly>
        <div className="container my-8 text-center">
          {/* In-feed ad */}
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-1461507496735569"
               data-ad-slot="1461507496735569"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (adsbygoogle = window.adsbygoogle || []).push({});
              `,
            }}
          />
          <p className="text-xs text-muted-foreground mt-1">Advertisement</p>
        </div>
      </ClientOnly>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border-border/80">
                <CardHeader className="flex-row items-center gap-4">
                  {feature.icon}
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild variant="link" className="p-0 h-auto text-primary font-semibold">
                    <Link href={feature.link}>
                      {feature.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* "Made with Love" Section */}
      <section className="w-full py-20 bg-secondary/30">
        <div className="container text-center">
            <Heart className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-2xl font-headline font-bold">Made with Passion</h3>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">This project is built with modern technologies to provide a fast, reliable, and enjoyable experience for everyone.</p>
        </div>
      </section>
    </div>
    </>
  );
}
