"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Heart } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export function BlogPostStats({ slug, initialCommentCount, initialLikeCount, className = "", iconClass = "" }: {
  slug: string;
  initialCommentCount: number;
  initialLikeCount: number;
  className?: string;
  iconClass?: string;
}) {
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Get comment count
        const commentsRef = collection(db, `content/${slug}/comments`);
        const commentsSnapshot = await getDocs(commentsRef);
        setCommentCount(commentsSnapshot.size);

        // Get like count from main post doc
        const postRef = doc(db, `content/${slug}`);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const data = postSnap.data();
          setLikeCount(typeof data.likes === 'number' ? data.likes : 0);
        }
      } catch (error) {
        // Silent fail
      }
    }
    fetchCounts();
  }, [slug]);

  return (
    <div className={className + " flex items-center gap-6"}>
      <span className="flex items-center gap-2">
        <MessageSquare className={iconClass + " h-4 w-4"} />
        {commentCount}
      </span>
      <span className="flex items-center gap-2">
        <Heart className={cn(iconClass + " h-4 w-4", likeCount > 0 ? "fill-destructive text-destructive" : "")} />
        {likeCount}
      </span>
    </div>
  );
}
