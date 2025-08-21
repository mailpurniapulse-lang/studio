---
# Blog Post Template
# Copy everything below the second --- line to start your new blog post

---
title: "Your Blog Post Title"
author: "Your Name"
date: "YYYY-MM-DD"
tags: ["Tag1", "Tag2", "Tag3"] # Choose relevant tags
description: "A brief description of your blog post - this will appear in previews and meta tags"
image: "/blog/img/your-image.jpg" # Place your image in public/img/topost/
imageHint: "brief description of the image for accessibility"
# To feature this post on the blog home page, add the following line:
# featured: true
---

# Introduction to Your Post

Write your introductory paragraph here. Hook your readers with an engaging opening.

## Main Section Title

Your main content goes here. You can use various markdown features:

### Subsections

- Bullet points for lists
- Another point
  - Nested point

1. Numbered lists
2. For sequential items

### Code Examples

```javascript
// For code snippets
const example = "This is a code block";
console.log(example);
```

### Styling Text

You can use *italic* or **bold** text for emphasis.

### Adding Images

You can add images using Next.js Image component:

<Image
  src="/blog/img/your-image.jpg"
  alt="Description of image"
  width={1200}
  height={600}
  className="rounded-lg mb-8 w-full object-cover"
  priority
/>

### Links

[Link text](https://example.com)

## Conclusion

Wrap up your post with a strong conclusion.

---
# Tips for Writing Blog Posts:
1. Use descriptive titles
2. Include relevant tags
3. Write clear meta descriptions
4. Use high-quality images
5. Structure content with headings
6. Include code examples if technical
7. End with a call to action
8. Use proper image paths in public/img/topost/
9. To make a post featured, add `featured: true` to the frontmatter (above). Only one post should have this at a time.
