import { Suspense } from "react";
import BlogPost from "./BlogPost";

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
  try {
    const response = await fetch(`https://best-desire-8443ae2768.strapiapp.com/api/blogs/${id}?populate=cover`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
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