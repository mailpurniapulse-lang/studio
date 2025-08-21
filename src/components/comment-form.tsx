'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface CommentFormProps {
    slug: string;
    initialLikeCount: number;
    onCommentPost?: () => void;
}

export function CommentForm({ slug, initialLikeCount, onCommentPost }: CommentFormProps) {
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [localLikeCount, setLocalLikeCount] = useState(initialLikeCount);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (!user) return;
        const checkUserLike = async () => {
            const userLikeRef = doc(db, `users/${user.uid}/postLikes/${slug}`);
            const docSnap = await getDoc(userLikeRef);
            setIsLiked(docSnap.exists());
        };
        checkUserLike();
    }, [user, slug]);

    const handlePostLike = async () => {
        if (!user) {
            toast({ title: "Please sign in to like posts.", variant: "destructive" });
            return;
        }

        const postRef = doc(db, `content/${slug}`);
        const userLikeRef = doc(db, `users/${user.uid}/postLikes/${slug}`);

        try {
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
        } catch (error) {
            console.error('Error updating like:', error);
            toast({ title: "Failed to update like", variant: "destructive" });
        }
    };

    const handlePostComment = () => {
        if (!user) {
            toast({ title: "Please sign in to comment", variant: "destructive" });
            return;
        }

        if (!newComment.trim()) {
            toast({ title: "Please enter a comment", variant: "destructive" });
            return;
        }

        try {
            onCommentPost?.();
            setNewComment('');
            toast({ title: "Comment posted!", variant: "default" });
        } catch (error) {
            console.error('Error posting comment:', error);
            toast({ title: "Failed to post comment", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4">
                <Button 
                    variant="outline" 
                    className="flex items-center gap-2" 
                    onClick={handlePostLike}
                    disabled={!user}
                >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-destructive text-destructive")} />
                    <span>{isLiked ? 'Unlike' : 'Like'} Post</span>
                </Button>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className={cn("h-4 w-4", localLikeCount > 0 && "fill-destructive text-destructive")} />
                    <span>{localLikeCount} {localLikeCount === 1 ? 'like' : 'likes'}</span>
                </div>
            </div>

            <div className="space-y-4">
                <Textarea
                    placeholder={user ? "Write a comment..." : "Please sign in to comment"}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="w-full resize-none"
                    disabled={!user}
                />
                <Button onClick={handlePostComment} disabled={!user || !newComment.trim()}>
                    Post Comment
                </Button>
                {!user && (
                    <p className="text-sm text-muted-foreground mt-2">
                        Sign in to like posts and leave comments.
                    </p>
                )}
            </div>
        </div>
    );
}
