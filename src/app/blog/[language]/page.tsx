import Head from 'next/head';
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BlogPostStats } from "@/components/blog-post-stats";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getContent } from "@/lib/markdown-utils";
import fs from "fs/promises";
import path from "path";
import { cache } from "react";

interface BlogPost {
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

const translations = {
  english: {
    heading: "From Our Blog",
    subheading: "Insights, tutorials, and updates from the PurniaPulse team.",
    featured: "Read Featured Post",
    latest: "Read Latest Post",
    readMore: "Read More",
    toggle: "हिंदी में पढ़ें",
  },
  hindi: {
    heading: "हमारे ब्लॉग से",
    subheading: "पुर्णिया पल्स टीम की अंतर्दृष्टि, ट्यूटोरियल और अपडेट्स।",
    featured: "फीचर्ड पोस्ट पढ़ें",
    latest: "लेटेस्ट पोस्ट पढ़ें",
    readMore: "और पढ़ें",
    toggle: "Read in English",
  },
};

const getBlogPosts = cache(async (language: string): Promise<Omit<BlogPost, "commentCount" | "likeCount">[]> => {
  try {
    const blogDir = path.join(process.cwd(), "content/blog", language);
    const filenames = await fs.readdir(blogDir);
    const mdFiles = filenames.filter((fn) => fn.endsWith(".md"));

    const posts = await Promise.all(
      mdFiles.map(async (filename) => {
        const slug = filename.replace(/\.md$/, "");
        const post = await getContent("blog", `${language}/${slug}`);
        const { frontmatter } = post!;
        const description =
          frontmatter.description || `Read more about ${frontmatter.title}.`;
        return {
          slug,
          title: frontmatter.title,
          author: frontmatter.author,
          date: frontmatter.date,
          image: frontmatter.image,
          imageHint: frontmatter.imageHint,
          description,
          featured:
            frontmatter.featured === true || frontmatter.featured === "true",
        };
      })
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Failed to get blog posts:", error);
    return [];
  }
});

import { doc, getDoc } from "firebase/firestore";
async function getCounts(slug: string): Promise<{ commentCount: number; likeCount: number }> {
  try {
    // Get comment count
    const commentsRef = collection(db, `content/${slug}/comments`);
    const commentsSnapshot = await getDocs(commentsRef);
    const commentCount = commentsSnapshot.size;

    // Get like count from main post doc
    const postRef = doc(db, `content/${slug}`);
    const postSnap = await getDoc(postRef);
    let likeCount = 0;
    if (postSnap.exists()) {
      const data = postSnap.data();
      likeCount = typeof data.likes === 'number' ? data.likes : 0;
    }

    return { commentCount, likeCount };
  } catch (error) {
    console.error(`Failed to get counts for ${slug}:`, error);
    return { commentCount: 0, likeCount: 0 };
  }
}

async function getPostsWithCounts(language: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts(language);
  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const { commentCount, likeCount } = await getCounts(post.slug);
      return { ...post, commentCount, likeCount };
    })
  );
  return postsWithCounts;
}

export default async function BlogLanguagePage(props: { params: { language: string } }) {
  const { language } = props.params;
  const selectedLanguage = language === "hindi" ? "hindi" : "english";
  const t = translations[selectedLanguage];
  const blogPosts = await getPostsWithCounts(selectedLanguage);

  const featured = blogPosts.find((post) => post.featured);
  const postsWithoutFeatured = featured
    ? blogPosts.filter((p) => p.slug !== featured.slug)
    : blogPosts;
  const [latest, ...rest] = postsWithoutFeatured;

  return (
    <>
      <Head>
        <title>{selectedLanguage === 'english' ? 'PurniaPulse Blog - English' : 'PurniaPulse Blog - हिंदी'}</title>
        <meta name="description" content={t.subheading} />
        <meta property="og:title" content={t.heading} />
        <meta property="og:description" content={t.subheading} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="PurniaPulse" />
        <meta property="og:locale" content={selectedLanguage === 'english' ? 'en_US' : 'hi_IN'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.heading} />
        <meta name="twitter:description" content={t.subheading} />
      </Head>
  <div className="w-full flex justify-center px-2 sm:px-4 md:px-6 lg:px-0">
      <div className="w-full max-w-6xl py-8 md:py-16">
      {/* Language Toggle */}
      <div className="flex justify-end mb-6">
        <Button asChild variant="outline">
          <Link href={`/blog/${selectedLanguage === "english" ? "hindi" : "english"}`}>{t.toggle}</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline drop-shadow-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-gradient-x">
          {t.heading}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground animate-fade-in">{t.subheading}</p>
      </div>

  {/* Layout Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Featured Post - Large, colorful, animated */}
        {featured && (
          <Card className="lg:col-span-3 mb-8 shadow-2xl border-0 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 animate-gradient-x transition-transform duration-500 hover:scale-[1.02]">
            <CardHeader className="p-0 relative">
              <Image
                src={featured.image}
                alt={featured.title}
                width={1200}
                height={500}
                className="object-cover w-full h-48 md:h-72 rounded-t-lg opacity-90 hover:opacity-100 transition-opacity duration-300"
                data-ai-hint={featured.imageHint}
                priority
              />
              <span className="absolute top-4 left-4 bg-white/80 text-pink-600 font-bold px-4 py-1 rounded-full shadow animate-bounce">Featured</span>
            </CardHeader>
            <CardContent className="p-6 md:p-8 flex flex-col items-center text-white">
              <CardTitle className="font-headline text-4xl mb-2 text-center drop-shadow-lg animate-fade-in-up">
                {featured.title}
              </CardTitle>
              <CardDescription className="mb-6 text-center text-lg animate-fade-in-up delay-100">
                {featured.description}
              </CardDescription>
              <BlogPostStats
                slug={featured.slug}
                initialCommentCount={featured.commentCount}
                initialLikeCount={featured.likeCount}
                className="justify-center gap-6 mb-4"
                iconClass="h-5 w-5"
              />
              <Button asChild size="lg" className="mt-2 bg-white text-pink-600 font-bold shadow-lg hover:bg-pink-100 animate-fade-in-up delay-200">
                <Link href={`/blog/${selectedLanguage}/${featured.slug}`}>
                  {t.featured} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
        {/* Latest Post - Card, hugs right below featured */}
        {latest && (
          <Card className="lg:grid-cols-3 shadow-xl border-0 bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400 animate-gradient-x transition-transform duration-500 hover:scale-105 mb-8">
            <CardHeader className="p-0 relative">
              <Image
                src={latest.image}
                alt={latest.title}
                width={400}
                height={300}
                className="object-cover w-full h-48 rounded-t-lg opacity-90 hover:opacity-100 transition-opacity duration-300"
                data-ai-hint={latest.imageHint}
              />
              <span className="absolute top-4 left-4 bg-white/80 text-indigo-600 font-bold px-4 py-1 rounded-full shadow animate-bounce">Latest</span>
            </CardHeader>
            <CardContent className="p-6 text-white">
              <CardTitle className="font-headline text-2xl mb-2 animate-fade-in-up">
                {latest.title}
              </CardTitle>
              <CardDescription className="mb-4 animate-fade-in-up delay-100">
                {latest.description}
              </CardDescription>
              <BlogPostStats
                slug={latest.slug}
                initialCommentCount={latest.commentCount}
                initialLikeCount={latest.likeCount}
                className="gap-6 mb-4 text-white"
                iconClass="h-4 w-4"
              />
              <Button asChild variant="link" className="mt-2 text-white font-bold animate-fade-in-up delay-200">
                <Link href={`/blog/${selectedLanguage}/${latest.slug}`}>
                  {t.latest} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
        {/* All Posts - 2 in a row, right of latest, animated */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
          {rest.map((post: BlogPost, idx) => (
            <Card
              key={post.slug}
              className="flex flex-col overflow-hidden shadow-lg border-0 bg-gradient-to-br from-green-300 via-blue-200 to-purple-200 hover:from-yellow-200 hover:to-pink-200 transition-all duration-500 group hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <CardHeader className="p-0 relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                  data-ai-hint={post.imageHint}
                />
                <span className="absolute top-4 left-4 bg-white/80 text-green-600 font-bold px-3 py-1 rounded-full shadow animate-pulse">Blog</span>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="font-headline text-xl mb-2 text-green-900 animate-fade-in-up">
                  {post.title}
                </CardTitle>
                <CardDescription className="mb-4 text-green-800 animate-fade-in-up delay-100">
                  {post.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <BlogPostStats
                  slug={post.slug}
                  initialCommentCount={post.commentCount}
                  initialLikeCount={post.likeCount}
                  className="gap-4 text-green-700 text-sm"
                  iconClass="w-4 h-4"
                />
                <Button asChild variant="ghost" className="text-green-700 hover:text-green-900 animate-fade-in-up delay-200">
                  <Link href={`/blog/${selectedLanguage}/${post.slug}`}>
                    {t.readMore} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </div>
    </>
  );
}
