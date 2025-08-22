'use client';

import Image from 'next/image';
import { CommentsSection } from '@/components/comments-section';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Heart } from 'lucide-react';
// getContent removed: this component is now pure presentational
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';


interface BlogPostProps {
  slug: string;
  language: string;
  commentCount: number;
  likeCount: number;
  frontmatter: any;
  content: string;
}

export default function BlogPost({ slug, language, commentCount, likeCount, frontmatter, content }: BlogPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePostLike = async () => {
    if (!user) {
      toast({ title: "Please sign in to like posts.", variant: "destructive" });
      return;
    }
    const postRef = doc(db, `content/${slug}`);
    const userLikeRef = doc(db, `users/${user.uid}/postLikes/${slug}`);

    if (isLiked) {
      await updateDoc(postRef, { likes: increment(-1) });
      await deleteDoc(userLikeRef);
      setIsLiked(false);
      setLocalLikeCount(prev => prev - 1);
    } else {
      await updateDoc(postRef, { likes: increment(1) });
      await setDoc(userLikeRef, { timestamp: serverTimestamp() });
      setIsLiked(true);
      setLocalLikeCount(prev => prev + 1);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container max-w-4xl mx-auto py-12 px-4 bg-gradient-to-br from-white via-sky-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl shadow-xl"
    >
      <header className="mb-8">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-video w-full mb-6 rounded-xl overflow-hidden shadow-lg"
        >
          <Image
            src={frontmatter.image}
            alt={frontmatter.imageHint || frontmatter.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
          {frontmatter.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          <span>By <strong>{frontmatter.author}</strong></span>
          <span>•</span>
          <span>{new Date(frontmatter.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
          <span>•</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
            </div>
            <button
              onClick={handlePostLike}
              className="flex items-center gap-1 text-pink-600 hover:text-pink-800 transition"
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-pink-600")} />
              <span>{localLikeCount} {localLikeCount === 1 ? 'like' : 'likes'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="prose dark:prose-invert prose-lg max-w-none mb-12 transition-all duration-300">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <Separator className="my-12" />

      <CommentsSection contentId={slug} />
    </motion.article>
  );
}
