'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, MessageSquare } from 'lucide-react';

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
}

export function BlogCard({ slug, title, description, image, date, author }: BlogCardProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Get users collection for counting likes
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        let totalLikes = 0;

        // Count likes across all users
        for (const userDoc of usersSnap.docs) {
          const userLikeRef = doc(db, 'users', userDoc.id, 'likes', slug);
          const likeSnap = await getDoc(userLikeRef);
          if (likeSnap.exists()) {
            totalLikes++;
          }
        }
        setLikeCount(totalLikes);

        // Get comments count
        const commentsRef = collection(db, 'content', slug, 'comments');
        const commentsSnap = await getDocs(commentsRef);
        setCommentCount(commentsSnap.size);
      } catch (err) {
        console.warn('Could not fetch social counts:', err);
      }
    };

    fetchCounts();
  }, [slug]);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1280px) 384px, (min-width: 1024px) 288px, (min-width: 768px) 342px, calc(100vw - 32px)"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-muted-foreground text-sm mb-3">{description}</p>
          <div className="text-sm text-muted-foreground">
            By {author} on {formattedDate}
          </div>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t flex justify-between bg-muted/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Heart className="h-4 w-4" />
              {likeCount}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              {commentCount}
            </span>
          </div>
          <span className="text-sm text-muted-foreground/80">Read more →</span>
        </CardFooter>
      </Link>
    </Card>
  );
}
