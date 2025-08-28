import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const resolvedParams = await params;
        const slug = resolvedParams.slug;
        const filePath = path.join(process.cwd(), 'content/blog', `${slug}.md`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content: markdownContent } = matter(fileContent);
        const content = await marked.parse(markdownContent);

        return NextResponse.json({
            content,
            title: frontmatter.title || '',
            description: frontmatter.description || '',
            author: frontmatter.author || '',
            date: frontmatter.date || '',
            image: frontmatter.image || '',
            imageHint: frontmatter.imageHint || '',
            featured: frontmatter.featured || false
        });
    } catch (error) {
        console.error("Failed to get blog post:", error);
        return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
    }
}
