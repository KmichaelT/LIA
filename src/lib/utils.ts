import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Strapi URL utility
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://best-desire-8443ae2768.strapiapp.com';

// Helper to get full Strapi URL for images
export function getStrapiImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}
