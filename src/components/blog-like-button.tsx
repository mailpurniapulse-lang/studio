"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

interface BlogLikeButtonProps {
  slug: string;
  initialLikeCount: number;
}

export default function BlogLikeButton({ slug, initialLikeCount }: BlogLikeButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    if (!user) return;
    const checkUserLike = async () => {
      const userLikeRef = doc(db, `users/${user.uid}/postLikes/${slug}`);
      const docSnap = await getDoc(userLikeRef);
      setIsLiked(docSnap.exists());
    };
    checkUserLike();
  }, [user, slug]);

  const handleLike = async () => {
    if (!user) {
      toast({ title: "Please sign in to like posts.", variant: "destructive" });
      return;
    }
    const postRef = doc(db, `content/${slug}`);
    const userLikeRef = doc(db, `users/${user.uid}/postLikes/${slug}`);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) {
      // Create the doc if it doesn't exist
      await setDoc(postRef, { likes: 1 }, { merge: true });
      await setDoc(userLikeRef, { timestamp: serverTimestamp() });
      setIsLiked(true);
      setLikeCount(1);
      return;
    }
    const postData = postSnap.data();
    if (typeof postData.likes !== "number") {
      // Initialize likes to 0 if missing or invalid
      await updateDoc(postRef, { likes: 0 });
    }
    if (isLiked) {
      await updateDoc(postRef, { likes: increment(-1) });
      await deleteDoc(userLikeRef);
      setIsLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await updateDoc(postRef, { likes: increment(1) });
      await setDoc(userLikeRef, { timestamp: serverTimestamp() });
      setIsLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  return (
<Button
  variant="ghost"
  className={cn(
    "flex items-center gap-4 relative group px-4 py-2 rounded-full transition-all duration-300",
    isLiked
      ? "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white shadow-lg"
      : "text-destructive hover:bg-gradient-to-r hover:from-pink-100 hover:via-red-100 hover:to-yellow-100"
  )}
  onClick={handleLike}
  disabled={!user}
  aria-label={isLiked ? "Unlike post" : "Like post"}
>
  <span className="relative inline-block">
    <AnimatePresence>
      {isLiked ? (
        <motion.div
          key="liked"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1.2, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Heart className="w-10 h-10 fill-white text-white drop-shadow" />
        </motion.div>
      ) : (
        <motion.div
          key="unliked"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Heart className="w-10 h-10 text-destructive transition-transform group-hover:scale-110" />
        </motion.div>
      )}
    </AnimatePresence>

    <span className="absolute -top-2 -right-2 bg-white border border-destructive text-destructive rounded-full px-2 py-0.5 text-xs font-bold shadow group-hover:scale-110 transition-transform">
      {likeCount}
    </span>
  </span>
  <span className={cn("font-semibold text-lg", isLiked ? "text-white" : "text-destructive")}>
    {isLiked ? "Liked" : "Like"}
  </span>
</Button>
  );
}
