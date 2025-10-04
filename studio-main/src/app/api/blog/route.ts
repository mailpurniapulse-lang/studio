import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
    try {
        const contentDir = path.join(process.cwd(), 'content/blog');
        const files = fs.readdirSync(contentDir);
        
        const posts = files
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(contentDir, file);
                const source = fs.readFileSync(filePath, 'utf-8');
                const { data } = matter(source);
                
                return {
                    slug: file.replace('.md', ''),
                    title: data.title || '',
                    description: data.description || '',
                    author: data.author || '',
                    date: data.date || '',
                    image: data.image || '',
                    imageHint: data.imageHint || '',
                    featured: data.featured || false
                };
            });
            
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Failed to get blog posts:", error);
        return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
    }
}
