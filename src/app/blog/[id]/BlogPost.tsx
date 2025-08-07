"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface StrapiMedia {
  id: number;
  url: string;
  name: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

interface StrapiBlog {
  id: number;
  documentId: string;
  Heading: string;
  SubHeading: string;
  category: string;
  cover?: StrapiMedia;
  body: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface BlogPostProps {
  post: StrapiBlog;
}

// Component to render Strapi rich text blocks
function renderRichTextBlock(block: any, index: number): JSX.Element {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="mb-4">
          {block.children?.map((child: any, childIndex: number) => (
            <span key={childIndex}>{child.text}</span>
          ))}
        </p>
      );
    
    case 'heading':
      const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag key={index} className={`font-bold mb-4 ${
          block.level === 2 ? 'text-2xl' : 
          block.level === 3 ? 'text-xl' : 'text-lg'
        }`}>
          {block.children?.map((child: any, childIndex: number) => (
            <span key={childIndex}>{child.text}</span>
          ))}
        </HeadingTag>
      );
    
    case 'list':
      const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag key={index} className={`mb-4 ml-6 ${
          block.format === 'ordered' ? 'list-decimal' : 'list-disc'
        }`}>
          {block.children?.map((item: any, itemIndex: number) => (
            <li key={itemIndex} className="mb-1">
              {item.children?.map((child: any, childIndex: number) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </li>
          ))}
        </ListTag>
      );
    
    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-lg mb-4">
          {block.children?.map((child: any, childIndex: number) => (
            <span key={childIndex}>{child.text}</span>
          ))}
        </blockquote>
      );
    
    case 'image':
      if (block.image) {
        return (
          <figure key={index} className="my-8">
            <img
              src={block.image.url.startsWith('http') ? block.image.url : `https://best-desire-8443ae2768.strapiapp.com${block.image.url}`}
              alt={block.image.alternativeText || block.image.name}
              className="w-full rounded-lg"
              width={block.image.width}
              height={block.image.height}
            />
            {block.image.caption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2">
                {block.image.caption}
              </figcaption>
            )}
          </figure>
        );
      }
      return null;
    
    case 'code':
      return (
        <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
          <code className="text-sm">
            {block.children?.map((child: any, childIndex: number) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </code>
        </pre>
      );
    
    default:
      // For debugging unknown block types
      if (process.env.NODE_ENV === 'development') {
        console.log('Unknown block type:', block.type, block);
      }
      return (
        <div key={index} className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">Unknown block type: {block.type}</p>
          <pre className="text-xs mt-2">{JSON.stringify(block, null, 2)}</pre>
        </div>
      );
  }
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <Badge variant="outline">{post.category}</Badge>
          <h1 className="max-w-3xl text-pretty text-5xl font-semibold md:text-6xl">
            {post.Heading}
          </h1>
          <h3 className="text-muted-foreground max-w-3xl text-lg md:text-xl">
            {post.SubHeading}
          </h3>
          <div className="flex items-center gap-3 text-sm md:text-base">
            <span>
              Published on {format(new Date(post.publishedAt), "MMMM d, yyyy")}
            </span>
          </div>
          {post.cover?.url ? (
            <img
              src={`https://best-desire-8443ae2768.strapiapp.com${post.cover.url}`}
              alt={post.Heading}
              className="mb-8 mt-4 aspect-video w-full rounded-lg border object-cover"
            />
          ) : (
            <div className="mb-8 mt-4 aspect-video w-full rounded-lg border bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <span className="text-6xl text-muted-foreground">📝</span>
            </div>
          )}
        </div>
      </div>
      <div className="container">
        <div className="prose dark:prose-invert mx-auto max-w-3xl">
          {post.body && post.body.length > 0 ? (
            post.body.map((block, index) => renderRichTextBlock(block, index))
          ) : (
            <p>No content available for this blog post.</p>
          )}
        </div>
      </div>
    </section>
  );
}