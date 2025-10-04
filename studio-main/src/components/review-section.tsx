'use client';

import { CommentsSection } from "@/components/comments-section";
import { useRouter } from 'next/navigation';

interface ReviewSectionProps {
  contentId: string;
}

export function ReviewSection({ contentId }: ReviewSectionProps) {
  const router = useRouter();

  const handleReviewChange = () => {
    // Refresh the page data
    router.refresh();
  };

  return (
    <CommentsSection 
      contentId={contentId}
      onCommentChange={handleReviewChange}
    />
  );
}
