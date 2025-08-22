
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, MapPin, MessageSquare, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Listing, Category } from '@/lib/listings';
import { getListings } from '@/lib/listings';
import { ClientOnly } from "@/components/client-only";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";


function getCategoryColor(category: string): string {
    const colorMap: { [key: string]: string } = {
        'Bookstore': 'from-blue-500 to-blue-700',
        'Coffee Shop': 'from-amber-600 to-amber-800',
        'Co-working Space': 'from-purple-500 to-purple-700',
        'Hardware Store': 'from-gray-600 to-gray-800',
        'Restaurant': 'from-red-500 to-red-700',
        'Wellness': 'from-green-500 to-green-700',
        'Hospital': 'from-cyan-500 to-cyan-700',
        'Police Station': 'from-blue-800 to-blue-950',
        'Essential Service': 'from-teal-500 to-teal-700'
    };
    return colorMap[category] || 'from-gray-500 to-gray-700';
}

const categories: Category[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'Bookstore', label: 'Bookstore' },
    { value: 'Coffee Shop', label: 'Coffee Shop' },
    { value: 'Co-working Space', label: 'Co-working Space' },
    { value: 'Hardware Store', label: 'Hardware Store' },
    { value: 'Restaurant', label: 'Restaurant' },
    { value: 'Wellness', label: 'Wellness' },
    { value: 'Hospital', label: 'Hospital', subCategories: [
        { value: 'all', label: 'All Specialties' },
        { value: 'Dentist', label: 'Dentist' },
        { value: 'Eye Care', label: 'Eye Care' },
        { value: 'Cardiology', label: 'Cardiology' },
    ]},
    { value: 'Police Station', label: 'Police Station' },
    { value: 'Essential Service', label: 'Essential Service' },
];

interface ListingWithCounts extends Listing {
  commentCount: number;
  averageRating: number;
  totalRatings: number;
}

async function getListingStats(slug: string): Promise<{ commentCount: number; averageRating: number; totalRatings: number }> {
  try {
    const commentsRef = collection(db, `content/${slug}/comments`);
    const commentsSnapshot = await getDocs(commentsRef);
    let totalRating = 0;
    let validRatings = 0;

    commentsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.rating && typeof data.rating === 'number') {
        totalRating += data.rating;
        validRatings++;
      }
    });

    return {
      commentCount: commentsSnapshot.size,
      averageRating: validRatings > 0 ? totalRating / validRatings : 0,
      totalRatings: validRatings
    };
  } catch (error) {
    console.error(`Failed to get stats for ${slug}:`, error);
    return { commentCount: 0, averageRating: 0, totalRatings: 0 };
  }
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

export default function ListingsPage() {
  const [allListings, setAllListings] = useState<ListingWithCounts[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching listings...');
        const listings = await getListings();
        console.log('Fetched listings:', listings);

        if (!Array.isArray(listings)) {
          throw new Error('Invalid listings data received');
        }

        const listingsWithStats = await Promise.all(
          listings.map(async (listing) => {
            if (!listing.slug) {
              console.warn('Listing missing slug:', listing);
              return {
                ...listing,
                commentCount: 0,
                averageRating: 0,
                totalRatings: 0
              };
            }
            const stats = await getListingStats(listing.slug);
            return { ...listing, ...stats };
          })
        );

        console.log('Processed listings:', listingsWithStats);
        setAllListings(listingsWithStats);
      } catch (err) {
        console.error('Error loading listings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  // Duplicate error state removed

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError(null);
      try {
        const listings = await getListings();
        console.log('Fetched listings:', listings); // Debug log
        
        if (!Array.isArray(listings)) {
          throw new Error('Listings data is not an array');
        }
                    if (listings.length === 0) {
              console.warn('No listings found. Contact us to get your business listed and reach more customers!');
            }
        const listingsWithCounts = await Promise.all(
          listings.map(async (listing) => {
            if (!listing.slug) {
              console.warn('Listing missing slug:', listing);
              return { ...listing, commentCount: 0, averageRating: 0, totalRatings: 0 };
            }
            const stats = await getListingStats(listing.slug);
            return { ...listing, ...stats };
          })
        );
        
        console.log('Processed listings:', listingsWithCounts); // Debug log
        setAllListings(listingsWithCounts);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load listings';
        console.error('Error fetching listings:', error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const filteredListings = useMemo(() => {
    console.log('Filtering listings:', { selectedCategory, selectedSubCategory, allListings });
    
    if (allListings.length === 0) {
      return [];
    }

    // If there are no filters selected or 'all' is selected, show all listings
    if (selectedCategory === 'all') {
      return allListings;
    }
    
    return allListings.filter(listing => {
      // Make case-insensitive comparison
      const categoryMatch = listing.category?.toLowerCase() === selectedCategory.toLowerCase();
      
      // If it's a Hospital category and a subcategory is selected
      if (categoryMatch && selectedCategory === 'Hospital') {
        if (selectedSubCategory === 'all') {
          return true; // Show all hospital listings when "All Specialties" is selected
        }
        // Check if the subcategory matches (case insensitive)
        return listing.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase();
      }
      
      // For non-hospital categories, just check the category
      return categoryMatch;
    });
  }, [allListings, selectedCategory, selectedSubCategory]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubCategory('all');
  };

  const subCategories = categories.find(c => c.value === selectedCategory)?.subCategories;

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Business Listings</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover, rate, and review the best local spots.
        </p>
      </div>

      <Card className="mb-12 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
                <label className="text-sm font-medium" htmlFor="category-select">Filter by Category</label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="category-select">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {subCategories && (
                <div className="md:col-span-1">
                    <label className="text-sm font-medium" htmlFor="subcategory-select">Filter by Specialty</label>
                     <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                        <SelectTrigger id="subcategory-select">
                            <SelectValue placeholder="Select a specialty" />
                        </SelectTrigger>
                        <SelectContent>
                            {subCategories.map(subCat => (
                                <SelectItem key={subCat.value} value={subCat.value}>{subCat.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
      </Card>

      {loading ? (
         <div className="text-center py-8">
            <p className="text-muted-foreground">Loading listings...</p>
         </div>
      ) : error ? (
         <div className="text-center py-8 text-red-500">
            <p>Error: {error}</p>
         </div>
      ) : allListings.length === 0 ? (
         <div className="text-center py-8">
            <p className="text-muted-foreground">No listings found. Please check the content/listings directory.</p>
            <p className="text-sm text-muted-foreground mt-2">Directory: /content/listings/*.md</p>
         </div>
      ) : filteredListings.length === 0 ? (
         <div className="text-center py-8">
            <p className="text-muted-foreground">No listings found for the selected category.</p>
         </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredListings.map((listing) => (
            <Card 
                key={listing.slug} 
                className={`flex flex-col overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br ${getCategoryColor(listing.category)}`}
                style={{ maxWidth: "320px" }}
            >
                <CardHeader className="p-0 relative">
                    <Image 
                        src={listing.image} 
                        alt={listing.name} 
                        width={320} 
                        height={180} 
                        className="object-cover w-full h-32" 
                        data-ai-hint={listing.imageHint} 
                    />
                    <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 text-black font-semibold">
                            {listing.category}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-3 flex-grow text-white">
                    <CardTitle className="font-headline text-base mb-1 line-clamp-1">{listing.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs text-white/90">
                        <MapPin className="h-3 w-3" /> {listing.address.split(',').pop()?.trim()}
                    </CardDescription>
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                        star <= Math.round(listing.averageRating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-white/40"
                                    }`}
                                />
                            ))}
                            <span className="text-xs ml-1 text-white/90">
                                ({listing.averageRating.toFixed(1)})
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-white/90 text-xs">
                            <MessageSquare className="h-3 w-3" />
                            <span>{listing.commentCount}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                    <Button 
                        asChild 
                        className="w-full bg-white text-black hover:bg-white/90 h-8 text-sm font-semibold"
                    >
                        <Link href={`/listings/${listing.slug}`}>
                            View Details <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
      )}
       <ClientOnly>
        <div className="container my-8 text-center">
          {/* In-feed ad */}
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-1461507496735569"
               data-ad-slot="YOUR_AD_SLOT_ID_2"
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
    </div>
  );
}
