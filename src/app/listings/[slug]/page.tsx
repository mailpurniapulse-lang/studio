// @ts-nocheck
import Head from 'next/head';
import Image from "next/image";
import { notFound } from 'next/navigation';
import { ReviewSection } from "@/components/review-section";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Phone, Globe, MessageSquare } from "lucide-react";
import { getContent } from '@/lib/markdown-utils';
import { getListings } from '@/lib/listings';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
// Static generation for all listings
export async function generateStaticParams() {
  const listings = await getListings();
  return listings.map(listing => ({ slug: listing.slug }));
}

async function getCommentCount(slug: string): Promise<number> {
  try {
    const commentsRef = collection(db, `content/${slug}/comments`);
    const commentsSnapshot = await getDocs(commentsRef);
    return commentsSnapshot.size;
  } catch (error) {
    console.error(`Failed to get comment count for ${slug}:`, error);
    return 0;
  }
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  const slug = params?.slug;

  if (!slug || typeof slug !== 'string') {
    return notFound();
  }

  try {
    const [listing, commentCount] = await Promise.all([
      getContent('listings', slug),
      getCommentCount(slug)
    ]);

    if (!listing) {
      return notFound();
    }

    const { content, frontmatter } = listing;
    const listingData = frontmatter as {
      name: string;
      category: string;
      image: string;
      imageHint: string;
      rating: number;
      reviewCount: number;
      address: string;
      hours: string;
      phone: string;
      website: string;
    };

    return (
      <>
        <Head>
          <link rel="canonical" href={`https://purniapulse.in/listings/${slug}`} />
        </Head>
  <div className="bg-secondary/30">
  <div className="container max-w-4xl mx-auto py-8 px-4 md:px-8 md:py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="mb-8">
                <Image 
                  src={listingData.image}
                  alt={listingData.name || "Listing image"}
                  width={1200}
                  height={600}
                  className="rounded-lg mb-4 w-full h-auto max-h-[450px] object-cover shadow-lg"
                  data-ai-hint={listingData.imageHint}
                  priority
                />
                <header>
                  <Badge variant="default" className="bg-accent text-accent-foreground mb-2">
                    {listingData.category}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold font-headline mb-2">
                    {listingData.name}
                  </h1>
                  <div className="flex items-center gap-2 text-lg">
                    <StarRating contentId={`rating_${slug}`} readonly />
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MessageSquare className="w-5 h-5" />
                      <span>{commentCount} {commentCount === 1 ? 'review' : 'reviews'}</span>
                    </div>
                  </div>
                </header>
              </div>

              <div className="prose dark:prose-invert max-w-none font-body text-lg leading-relaxed mb-12">
                <h2 className="font-headline">About {listingData.name}</h2>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>

              <Separator className="my-8" />
              <ReviewSection contentId={slug} />
            </div>

            <div className="md:col-span-1">
              <div className="sticky top-24 bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-headline mb-4">Business Info</h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>{listingData.address}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>{listingData.hours}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>{listingData.phone}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <a href={`https://${listingData.website}`} className="text-primary hover:underline">
                      {listingData.website}
                    </a>
                  </li>
                </ul>
                <div className="mt-6">
                  <h4 className="font-headline mb-2">Rate this Business</h4>
                  <StarRating contentId={`rating_${slug}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  } catch (error) {
    console.error('Error loading listing:', error);
    return notFound();
  }
}
