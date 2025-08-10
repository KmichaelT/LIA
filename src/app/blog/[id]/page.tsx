import { Suspense } from "react";
import BlogPost from "./BlogPost";
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

async function getBlogPost(id: string): Promise<StrapiBlog | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/blogs/${id}?populate=cover`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Blog post fetch timeout after 8 seconds');
    } else {
      console.error('Error fetching blog post:', error);
    }
    return null;
  }
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }
  
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </main>
    }>
      <BlogPost post={post} />
    </Suspense>
  );
}