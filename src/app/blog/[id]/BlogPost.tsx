"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { STRAPI_URL } from "@/lib/utils";

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
  body: unknown[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface BlogPostProps {
  post: StrapiBlog;
}

// Component to render Strapi rich text blocks
function renderRichTextBlock(block: unknown, index: number): JSX.Element | null {
  const blockObj = block as { type?: string; children?: unknown[]; level?: number; format?: string; image?: unknown };
  switch (blockObj.type) {
    case 'paragraph':
      return (
        <p key={index} className="mb-4">
          {(blockObj.children as any[])?.map((child: any, childIndex: number) => (
            <span key={childIndex}>{child.text}</span>
          ))}
        </p>
      );
    
    case 'heading':
      const HeadingTag = `h${blockObj.level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag key={index} className={`font-bold mb-4 ${
          blockObj.level === 2 ? 'text-2xl' : 
          blockObj.level === 3 ? 'text-xl' : 'text-lg'
        }`}>
          {(blockObj.children as any[])?.map((child: any, childIndex: number) => (
            <span key={childIndex}>{child.text}</span>
          ))}
        </HeadingTag>
      );
    
    case 'list':
      const ListTag = blockObj.format === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag key={index} className={`mb-4 ml-6 ${
          blockObj.format === 'ordered' ? 'list-decimal' : 'list-disc'
        }`}>
          {(blockObj.children as any[])?.map((item: any, itemIndex: number) => (
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
          {(blockObj.children as any[])?.map((child: any, childIndex: number) => (
            <span key={childIndex}>{child.text}</span>
          ))}
        </blockquote>
      );
    
    case 'image':
      if (blockObj.image) {
        return (
          <figure key={index} className="my-8">
            <img
              src={(blockObj.image as any).url.startsWith('http') ? (blockObj.image as any).url : `${STRAPI_URL}${(blockObj.image as any).url}`}
              alt={(blockObj.image as any).alternativeText || (blockObj.image as any).name}
              className="w-full rounded-lg"
              width={(blockObj.image as any).width}
              height={(blockObj.image as any).height}
            />
            {(blockObj.image as any).caption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2">
                {(blockObj.image as any).caption}
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
            {(blockObj.children as any[])?.map((child: any, childIndex: number) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </code>
        </pre>
      );
    
    default:
      // For debugging unknown block types
      if (process.env.NODE_ENV === 'development') {
        console.log('Unknown block type:', blockObj.type, blockObj);
      }
      return (
        <div key={index} className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">Unknown block type: {blockObj.type}</p>
          <pre className="text-xs mt-2">{JSON.stringify(blockObj, null, 2)}</pre>
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
              src={`${STRAPI_URL}${post.cover.url}`}
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