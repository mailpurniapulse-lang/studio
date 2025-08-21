// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, where, writeBatch } from 'firebase/firestore';

interface Review {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  text: string;
  rating: number;
  timestamp: any;
  likes: number;
}

interface CommentsSectionProps {
  contentId: string;
  onCommentChange?: () => void;
}

const ReviewItem = ({ comment, contentId, user, likes, handleLikeComment, setEditingComment, handleDeleteComment, editingComment, handleUpdateComment }) => {
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    if (comment.timestamp) {
      setDisplayTime(comment.timestamp.toDate().toLocaleString());
    }
  }, [comment.timestamp]);

  return (
    <Card className="p-4">
      <div className="flex space-x-4">
        <Avatar>
          <AvatarImage src={comment.avatar} data-ai-hint="user avatar" />
          <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold">{comment.author}</p>
            <p className="text-xs text-muted-foreground">
              {displayTime}
            </p>
          </div>
          {editingComment?.id === comment.id ? (
            <div>
              <Textarea 
                value={editingComment.text} 
                onChange={(e) => setEditingComment({...editingComment, text: e.target.value})}
                className="mb-2"
              />
              <div className="flex gap-2">
                  <Button size="sm" onClick={handleUpdateComment}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingComment(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className="text-foreground/90">{comment.text}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-primary" onClick={() => handleLikeComment(comment.id)}>
              <Heart className={cn("h-4 w-4", !!user && likes[comment.id] && "fill-destructive text-destructive")} />
              <span>{comment.likes}</span>
            </Button>
            {user?.uid === comment.authorId && (
              <>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-primary" onClick={() => setEditingComment(comment)}>
                  <Pencil className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-destructive" onClick={() => handleDeleteComment(comment.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function CommentsSection({ contentId, onCommentChange }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const { toast } = useToast();

  // Fetches all comments for the contentId. This is public and should not depend on the user.
  useEffect(() => {
    if (!contentId) return;
    const commentsCollectionRef = collection(db, `content/${contentId}/comments`);
    const q = query(commentsCollectionRef, orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Comment));
      setComments(commentsData);
      // Update comment count in parent component
      onCommentChange?.();
    });
    
    return () => unsubscribe();
  }, [contentId]);

  // Fetches user-specific "likes". This logic is separate and only depends on the user.
  useEffect(() => {
    if (!user) {
      setLikes({});
      return;
    }
    
    const likesRef = collection(db, `users/${user.uid}/likes`);
    const q = query(likesRef, where('contentId', '==', contentId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const userLikes: Record<string, boolean> = {};
        snapshot.forEach(doc => {
            userLikes[doc.data().commentId] = true;
        });
        setLikes(userLikes);
    });

    return () => unsubscribe();
  }, [user, contentId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      toast({ title: "Please sign in to comment.", variant: "destructive" });
      return;
    }

    const commentsCollectionRef = collection(db, `content/${contentId}/comments`);
    await addDoc(commentsCollectionRef, {
      author: user.displayName,
      authorId: user.uid,
      avatar: user.photoURL,
      text: newComment,
      timestamp: serverTimestamp(),
      likes: 0,
    });
    setNewComment('');
    onCommentChange?.();
    toast({ title: "Comment posted!", description: "Thank you for your feedback." });
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !editingComment.text.trim()) return;
    const commentRef = doc(db, `content/${contentId}/comments`, editingComment.id);
    await updateDoc(commentRef, { text: editingComment.text });
    setEditingComment(null);
    toast({ title: "Comment updated!", description: "Your comment was updated." });
  };
  
  const handleDeleteComment = async (id: string) => {
    const commentRef = doc(db, `content/${contentId}/comments`, id);
    await deleteDoc(commentRef);
    onCommentChange?.();
    toast({ title: "Comment deleted.", description: "Your comment was removed.", variant: "destructive" });
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
        toast({ title: "Please sign in to like comments.", variant: "destructive" });
        return;
    }

    const commentRef = doc(db, `content/${contentId}/comments`, commentId);
    const likeRef = doc(db, `users/${user.uid}/likes`, `${contentId}_${commentId}`);
    
    const isLiked = likes[commentId];
    const currentComment = comments.find(c => c.id === commentId);
    if (!currentComment) return;

    const newLikesCount = currentComment.likes + (isLiked ? -1 : 1);
    
    const batch = writeBatch(db);
    batch.update(commentRef, { likes: newLikesCount });
    if (isLiked) {
        batch.delete(likeRef);
    } else {
        batch.set(likeRef, { contentId, commentId });
    }
    await batch.commit();
    toast({
      title: isLiked ? "Like removed" : "Comment liked!",
      description: isLiked ? "You unliked this comment." : "Thanks for liking this comment!"
    });
  };

  return (
    <section>
      <h2 className="text-3xl font-bold font-headline mb-6 flex items-center">
        <MessageSquare className="mr-3 h-7 w-7" />
        Reviews ({comments.length})
      </h2>
      <Card className="mb-6">
        <CardContent className="p-4">
          {user ? (
            <div className="flex space-x-4">
              <Avatar>
                <AvatarImage src={user.photoURL ?? ''} data-ai-hint="user avatar" />
                <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <Textarea
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handlePostComment} className="mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">Post Comment</Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Please sign in to leave a comment.</p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {comments.map((comment) => (
          <ReviewItem 
            key={comment.id}
            comment={comment}
            contentId={contentId}
            user={user}
            likes={likes}
            handleLikeComment={handleLikeComment}
            setEditingComment={setEditingComment}
            handleDeleteComment={handleDeleteComment}
            editingComment={editingComment}
            handleUpdateComment={handleUpdateComment}
          />
        ))}
      </div>
    </section>
  );
}
