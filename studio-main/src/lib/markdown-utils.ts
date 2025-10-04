
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { cache } from 'react';

const contentDir = path.join(process.cwd(), 'content');

type ContentPath = string | [string, string];

export const getContent = cache(async (type: 'blog' | 'listings', pathOrSlug: ContentPath) => {
  const filePath = typeof pathOrSlug === 'string'
    ? path.join(contentDir, type, `${pathOrSlug}.md`)
    : path.join(contentDir, type, pathOrSlug[0], `${pathOrSlug[1]}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: markdownContent } = matter(fileContent);
  
  const content = await marked.parse(markdownContent);

  return { content, frontmatter };
});
