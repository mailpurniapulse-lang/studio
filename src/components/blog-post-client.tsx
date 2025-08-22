"use client";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { CommentsSection } from "@/components/comments-section";
import { Separator } from "@/components/ui/separator";
import BlogLikeButton from "@/components/blog-like-button";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useAuth } from "@/hooks/use-auth";

interface BlogPostClientProps {
  slug: string;
  language: string;
  frontmatter: any;
  content: string;
  likeCount: number;
  commentCount: number;
}

export default function BlogPostClient({ slug, language, frontmatter, content, likeCount, commentCount }: BlogPostClientProps) {
  const { user } = useAuth();
  const formattedDate = frontmatter.date ? new Date(frontmatter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <div className="w-full flex justify-center px-2 sm:px-4 md:px-6 lg:px-0">
      <div className="w-full max-w-4xl py-8 md:py-12">
        <article className="prose dark:prose-invert lg:prose-xl mx-auto">
        <header className="not-prose mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{frontmatter.title}</h1>
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400">
              By {frontmatter.author} on {formattedDate}
            </div>
            <Link 
              href={`/blog/${language}`} 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 no-underline"
            >
              ← Back to Blog
            </Link>
          </div>
          {frontmatter.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">{frontmatter.description}</p>
          )}
        </header>

        {frontmatter.image && (
          <div className="not-prose mb-8">
            <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image 
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 56rem, calc(100vw - 2rem)"
                priority
              />
            </div>
            {frontmatter.imageHint && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                {frontmatter.imageHint}
              </p>
            )}
          </div>
        )}

        <div className="not-prose flex gap-4 items-center mb-8">
          <div className="flex items-center gap-6">
            <BlogLikeButton slug={slug} initialLikeCount={likeCount} />
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MessageSquare className="w-5 h-5" />
              <span>{commentCount} {language === 'hindi' ? 'टिप्पणियाँ' : 'Comments'}</span>
            </div>
          </div>
          {!user && (
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
              Sign in to like and comment
            </p>
          )}
        </div>

        <div className="prose-lg prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg dark:prose-invert">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl mt-8" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl mt-6" {...props} />,
              p: ({node, ...props}) => <p className="mt-4 mb-4" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside my-4" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside my-4" {...props} />,
              li: ({node, ...props}) => <li className="my-2" {...props} />,
              img: ({node, src, alt, ...props}) => {
                const {width, height, ...safeProps} = props;
                return (
                  <div className="my-4">
                    <Image
                      src={src || ''}
                      alt={alt || ''}
                      width={800}
                      height={400}
                      className="rounded-lg mx-auto"
                      {...safeProps}
                    />
                  </div>
                );
              },
              table: ({node, ...props}) => (
                <div className="my-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300" {...props} />
                </div>
              ),
              th: ({node, ...props}) => (
                <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold" {...props} />
              ),
              td: ({node, ...props}) => (
                <td className="px-4 py-2 border border-gray-200 dark:border-gray-700" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        </article>

        <Separator className="my-12" />
        <CommentsSection contentId={slug} />
      </div>
    </div>
  );
}
