
// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface StarRatingProps {
  contentId: string;
  totalStars?: number;
  readonly?: boolean;
}

export function StarRating({ contentId, totalStars = 5, readonly = false }: StarRatingProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setRating(0);
      return;
    };
    
    const ratingRef = doc(db, `users/${user.uid}/ratings/${contentId}`);
    const fetchRating = async () => {
      const docSnap = await getDoc(ratingRef);
      if (docSnap.exists()) {
        setRating(docSnap.data().rating);
      }
    };
    fetchRating();
  }, [user, contentId]);


  const handleRate = async (rateValue: number) => {
    if (readonly || !user) {
        if (!user) toast({ title: "Please sign in to rate.", variant: "destructive" });
        return;
    };
    
    setRating(rateValue);

    const ratingRef = doc(db, `users/${user.uid}/ratings/${contentId}`);
    try {
        await setDoc(ratingRef, {
            rating: rateValue,
            timestamp: serverTimestamp(),
            contentId: contentId,
        }, { merge: true });

        // You might want to update an aggregate rating on the content itself
        // This requires more complex logic, possibly with cloud functions

        toast({ title: `You rated ${rateValue} out of ${totalStars} stars!`, description: "Thank you for your feedback." });
    } catch(error) {
        console.error("Error setting rating:", error);
        toast({ title: "Failed to save rating.", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            type="button"
            disabled={readonly}
            onClick={() => handleRate(starValue)}
            onMouseEnter={() => !readonly && setHover(starValue)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={cn(
              "p-0 bg-transparent border-none",
              !readonly && "cursor-pointer"
            )}
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                starValue <= (hover || rating)
                  ? "text-accent fill-accent"
                  : "text-muted-foreground/50"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
