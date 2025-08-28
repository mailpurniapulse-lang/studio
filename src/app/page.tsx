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
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
        <Image
          src="/img/Panchmukhi_Mandir_Purnea.jpg"
          alt="Panchmukhi Mandir, Purnea"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          /* NOTE: For best LCP, compress this image to ~60% quality using jpegoptim or Squoosh */
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
               Our Purnea
            </h1>
            <p className="text-lg md:text-xl font-medium drop-shadow-md">
              A sacred landmark of devotion and heritage in Purnea, Panchmukhi Mandir
            </p>
          </div>
        </div>
      </section>
      {/* About Section */}
<section className="w-full py-16 bg-background">
  <div className="container px-4 md:px-6 text-center">
    <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
    <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
      About Purnia Pulse
    </h2>
    <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
      <strong>Purnia Pulse</strong> is your digital gateway to the vibrant culture, businesses, and creative minds of Purnea, Bihar. Whether you're a local resident, a curious traveler, or a tech enthusiast, our platform brings together insightful blogs, curated listings, and powerful creator tools—all designed to celebrate and empower the community.
    </p>
    <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed mt-4">
      We believe in storytelling, discovery, and innovation. From sacred landmarks like Panchmukhi Mandir to emerging startups and creators, Purnia Pulse is here to amplify voices and connect people through meaningful content and resources.
    </p>
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
    </>
  );
}
