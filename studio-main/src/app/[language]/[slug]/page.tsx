import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import BlogPost from '@/components/blog-post';

export default async function PostPage({ params }: { params: Promise<{ language: string; slug: string }> }) {
    const resolvedParams = await params;
    const validLanguages = ['english', 'hindi'];

    if (!validLanguages.includes(resolvedParams.language) || !resolvedParams?.slug) {
        notFound();
    }

    try {
        const commentsRef = collection(db, `content/${resolvedParams.slug}/comments`);
        const commentsSnapshot = await getDocs(commentsRef);
        const commentCount = commentsSnapshot.size;

        let likeCount = 0;
        commentsSnapshot.forEach((doc) => {
            likeCount += doc.data().likes || 0;
        });

        return (
            <BlogPost 
                slug={resolvedParams.slug} 
                language={resolvedParams.language} 
                commentCount={commentCount}
                likeCount={likeCount}
            />
        );
    } catch (error) {
        console.error('Error loading blog post:', error);
        notFound();
    }
}
