"use client";

import { Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { STRAPI_URL, getStrapiImageUrl } from "@/lib/utils";

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

interface BlogListProps {
  posts: StrapiBlog[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <section className="py-32">
      <div>
        <div className="max-w-3xl flex-col gap-6">
          <Badge variant="outline">Articles</Badge>
          <h1 className="mt-4 text-balance">
            Discover the latest trends
          </h1>
          <p className="mt-6">
            Explore our blog for insightful articles, personal reflections and
            ideas that inspire action on the topics you care about.
          </p>
        </div>
        
        {posts.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-muted-foreground">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.documentId} className="flex flex-col">
                <div className="relative">
                  {post.cover?.url ? (
                    <img
                      src={getStrapiImageUrl(post.cover.url)}
                      alt={post.Heading}
                      className="aspect-video w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <span className="text-4xl text-muted-foreground">📝</span>
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="absolute top-4 right-4 bg-background/70 px-3 py-1 text-sm backdrop-blur-sm"
                  >
                    {post.category}
                  </Badge>
                </div>
                <div className="flex h-full flex-col justify-between p-4">
                  <h2 className="mb-5 text-xl font-semibold">
                    {post.Heading}
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {post.SubHeading}
                  </p>
                  <div className="flex justify-between gap-6 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                    </span>
                    <Link 
                      href={`/blog/${post.documentId}`}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Read more
                      <ChevronRight className="h-full w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}