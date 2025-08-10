import { Suspense } from "react";
import BlogList from "./BlogList";
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

async function getBlogPosts(): Promise<StrapiBlog[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/blogs?populate=cover&sort=publishedAt:desc`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Blog fetch timeout after 8 seconds');
    } else {
      console.error('Error fetching blog posts:', error);
    }
    return [];
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </main>
    }>
      <BlogList posts={blogPosts} />
    </Suspense>
  );
}