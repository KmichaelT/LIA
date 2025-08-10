
import { Suspense } from "react";
import { Gallerygrid } from "@/components/gallerygrid";
import { STRAPI_URL } from "@/lib/utils";

interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

interface StrapiGallery {
  id: number;
  documentId: string;
  name: string;
  category: string;
  image?: StrapiImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

async function getGalleries(): Promise<StrapiGallery[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/galleries?populate=image&sort=publishedAt:desc`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Failed to fetch galleries');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Gallery fetch timeout after 8 seconds');
    } else {
      console.error('Error fetching galleries:', error);
    }
    return [];
  }
}

export default async function Gallery() {
  const galleries = await getGalleries();
  
  return (
    <main>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading galleries...</p>
          </div>
        </div>
      }>
        <Gallerygrid galleries={galleries} />
      </Suspense>
    </main>
  );
}