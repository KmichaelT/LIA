import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Strapi URL utility - automatically switches between dev and prod
const isDevelopment = process.env.NODE_ENV === 'development';
// const devUrl = process.env.NEXT_PUBLIC_STRAPI_DEV_URL || 'http://localhost:1337';
const devUrl = process.env.NEXT_PUBLIC_STRAPI_DEV_URL || 'http://127.0.0.1:1337';
const prodUrl = process.env.NEXT_PUBLIC_STRAPI_PROD_URL || 'https://best-desire-8443ae2768.strapiapp.com';

export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || (isDevelopment ? devUrl : prodUrl);

// Helper to get full Strapi URL for images
export function getStrapiImageUrl(url: string): string {
  if (!url) return '';
  // Return as-is if it's already a full URL (starts with http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Add base URL for relative paths
  return `${STRAPI_URL}${url}`;
}
