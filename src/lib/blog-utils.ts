import { cache } from 'react';
import fs from 'fs/promises';
import path from 'path';
import { getContent } from '@/lib/markdown-utils';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    author: string;
    date: string;
    image: string;
    imageHint: string;
    commentCount: number;
    likeCount: number;
    featured?: boolean;
}

export const getBlogPosts = cache(async (language: string = 'english'): Promise<Omit<BlogPost, 'commentCount' | 'likeCount'>[]> => {
    try {
        const blogDir = path.join(process.cwd(), 'content/blog', language);
        const filenames = await fs.readdir(blogDir);
        const mdFiles = filenames.filter(fn => fn.endsWith('.md'));

        const posts = await Promise.all(mdFiles.map(async (filename) => {
            const slug = filename.replace(/\.md$/, '');
            const post = await getContent('blog', [language, slug]);
            if (!post) return null;
            const { frontmatter } = post;
            const description = frontmatter.description || `Read more about ${frontmatter.title}.`;
            return {
                slug,
                title: frontmatter.title,
                author: frontmatter.author,
                date: frontmatter.date,
                image: frontmatter.image,
                imageHint: frontmatter.imageHint,
                description: description,
                featured: frontmatter.featured === true || frontmatter.featured === 'true',
                language
            };
        }));

        return (posts.filter(Boolean) as Omit<BlogPost, 'commentCount' | 'likeCount'>[])
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error("Failed to get blog posts:", error);
        return [];
    }
});

export async function getCounts(slug: string): Promise<{ commentCount: number; likeCount: number }> {
    try {
        const commentsRef = collection(db, `content/${slug}/comments`);
        const commentsSnapshot = await getDocs(commentsRef);
        const commentCount = commentsSnapshot.size;

        let totalLikes = 0;
        commentsSnapshot.forEach(doc => {
            totalLikes += doc.data().likes || 0;
        });

        return { commentCount, likeCount: totalLikes };
    } catch (error) {
        console.error(`Failed to get counts for ${slug}:`, error);
        return { commentCount: 0, likeCount: 0 };
    }
}

export async function getPostsWithCounts(language: string): Promise<BlogPost[]> {
    const posts = await getBlogPosts(language);
    const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
            const { commentCount, likeCount } = await getCounts(post.slug);
            return { ...post, commentCount, likeCount };
        })
    );
    return postsWithCounts;
}
