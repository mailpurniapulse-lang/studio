import { notFound } from "next/navigation";
import Head from 'next/head';
import { getContent } from "@/lib/markdown-utils";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import BlogPostClient from "@/components/blog-post-client";

interface BlogPostProps {
  params: Promise<{
    language: string;
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  // Await the params Promise before destructuring
  const resolvedParams = await params;
  const { language, slug } = resolvedParams;
  const post = await getContent("blog", `${language}/${slug}`);

  if (!post) return notFound();

  const { frontmatter, content } = post;

  // Fetch comments and likes
  const commentsRef = collection(db, `content/${slug}/comments`);
  const commentsSnapshot = await getDocs(commentsRef);
  const commentCount = commentsSnapshot.size;

  let likeCount = 0;
  commentsSnapshot.forEach((doc) => {
    likeCount += doc.data().likes || 0;
  });

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://purniapulse.in/blog/${language}/${slug}`} />
      </Head>
      <BlogPostClient
        slug={slug}
        language={language}
        frontmatter={frontmatter}
        content={content}
        likeCount={likeCount}
        commentCount={commentCount}
      />
    </>
  );
}
