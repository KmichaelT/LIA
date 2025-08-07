import { Suspense } from "react";
import BlogList from "./BlogList";

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
  try {
    const response = await fetch('https://best-desire-8443ae2768.strapiapp.com/api/blogs?populate=cover&sort=publishedAt:desc', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
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