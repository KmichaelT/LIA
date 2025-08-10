// Base Strapi Types
export interface StrapiImage {
  id: number;
  attributes: {
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: Record<string, {name: string, hash: string, ext: string, mime: string, width: number, height: number, size: number, url: string}>;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  attributes: Record<string, unknown>;
}

// Collection Types
export interface Service extends StrapiEntity {
  attributes: {
    title: string;
    description: string;
    icon: string;
    backgroundColor?: string;
    featured: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Event extends StrapiEntity {
  attributes: {
    title: string;
    description: string;
    date: string;
    location: string;
    registrationLink?: string;
    featured: boolean;
    image?: {
      data: StrapiImage;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Cause extends StrapiEntity {
  attributes: {
    title: string;
    description: string;
    goalAmount: number;
    raisedAmount: number;
    category: string;
    causeStatus: 'active' | 'completed' | 'paused';
    featured: boolean;
    image?: {
      data: StrapiImage;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Stat extends StrapiEntity {
  attributes: {
    label: string;
    value: number;
    description?: string;
    icon: string;
    unit: string;
    category: 'impact' | 'finance' | 'community';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Link extends StrapiEntity {
  attributes: {
    label: string;
    url: string;
    type: 'cta' | 'navigation' | 'social';
    style?: 'primary' | 'secondary';
    platform?: string;
    icon?: string;
    isExternal: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// Component Types
export interface EventViewer {
  id: number;
  __component: 'viewers.event-viewer';
  title?: string;
  maxEvents: number;
  showFeatured: boolean;
}

export interface CauseViewer {
  id: number;
  __component: 'viewers.cause-viewer';
  title?: string;
  maxCauses: number;
  showFeatured: boolean;
}

export interface ServiceViewer {
  id: number;
  __component: 'viewers.service-viewer';
  title?: string;
  maxServices: number;
  showFeatured: boolean;
}

export interface StatsViewer {
  id: number;
  __component: 'viewers.stats-viewer';
  title?: string;
  category?: string;
}

export interface TimelineItem {
  id: number;
  __component: 'content.timeline-item';
  startYear: string;
  endYear?: string;
  title: string;
  description: string;
}

export interface NewsletterSection {
  id: number;
  __component: 'content.newsletter-section';
  title: string;
  description: string;
  buttonText: string;
  actionUrl: string;
}

export interface BibleVerse {
  id: number;
  __component: 'content.bible-verse';
  verse: string;
  reference: string;
}

// Single Type Interfaces (Strapi 5 - no attributes wrapper)
export interface HomePage {
  id: number;
  documentId?: string;
  heroTitle: string;
  heroDescription: string;
  heroBackgroundImage?: {
    id: number;
    url: string;
    name?: string;
    alternativeText?: string;
    formats?: Record<string, unknown>;
  };
  heroPrimaryButton?: LinkData;
  heroSecondaryButton?: LinkData;
  heroStats?: StatData[];
  sections?: Array<EventViewer | CauseViewer | ServiceViewer | StatsViewer | NewsletterSection | BibleVerse>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AboutUs extends StrapiEntity {
  attributes: {
    heroTitle: string;
    heroDescription: string;
    missionTitle: string;
    missionDescription: string;
    visionTitle: string;
    visionDescription: string;
    valuesTitle: string;
    valuesDescription: string;
    timelineTitle: string;
    currentPhase: number;
    timelineItems: TimelineItem[];
    joinMissionTitle: string;
    joinMissionDescription: string;
    heroImage?: {
      data: StrapiImage;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// Utility Types for Frontend Use
export interface ServiceData {
  id: number;
  title: string;
  description: string;
  icon: string;
  backgroundColor?: string;
  featured: boolean;
  order: number;
}

export interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  registrationLink?: string;
  featured: boolean;
  image: string;
  href?: string;
}

export interface CauseData {
  id: number;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  progress: number;
  category: string;
  causeStatus: string;
  featured: boolean;
  image: string;
  href: string;
  goal?: string;
  createdAt?: string;
  amountRaised?: number;
}

export interface StatData {
  id: number;
  label: string;
  value: number;
  description?: string;
  icon: string;
  unit: string;
  category: string;
}

export interface LinkData {
  id: number;
  label: string;
  url: string;
  type: string;
  style?: string;
  platform?: string;
  icon?: string;
  isExternal: boolean;
}

// Transform functions to convert Strapi data to frontend-friendly format
export function transformService(service: Service): ServiceData {
  return {
    id: service.id,
    title: service.attributes.title,
    description: service.attributes.description,
    icon: service.attributes.icon,
    backgroundColor: service.attributes.backgroundColor,
    featured: service.attributes.featured,
    order: service.attributes.order,
  };
}

export function transformEvent(event: Event): EventData {
  return {
    id: event.id,
    title: event.attributes.title,
    description: event.attributes.description,
    date: event.attributes.date,
    location: event.attributes.location,
    registrationLink: event.attributes.registrationLink,
    featured: event.attributes.featured,
    image: event.attributes.image?.data?.attributes?.url || '/images/events/default.png',
    href: event.attributes.registrationLink,
  };
}

export function transformCause(cause: Cause): CauseData {
  const progress = Math.min(Math.round((cause.attributes.raisedAmount / cause.attributes.goalAmount) * 100), 100);
  
  return {
    id: cause.id,
    title: cause.attributes.title,
    description: cause.attributes.description,
    goalAmount: cause.attributes.goalAmount,
    raisedAmount: cause.attributes.raisedAmount,
    progress,
    category: cause.attributes.category,
    causeStatus: cause.attributes.causeStatus,
    featured: cause.attributes.featured,
    image: cause.attributes.image?.data?.attributes?.url || '/images/causes/default.webp',
    href: `/causes/${cause.attributes.title.toLowerCase().replace(/\s+/g, '-')}`,
    goal: cause.attributes.description,
    createdAt: new Date(cause.attributes.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    amountRaised: cause.attributes.raisedAmount,
  };
}

export function transformStat(stat: Stat): StatData {
  return {
    id: stat.id,
    label: stat.attributes.label,
    value: stat.attributes.value,
    description: stat.attributes.description,
    icon: stat.attributes.icon,
    unit: stat.attributes.unit,
    category: stat.attributes.category,
  };
}

export function transformLink(link: Link): LinkData {
  return {
    id: link.id,
    label: link.attributes.label,
    url: link.attributes.url,
    type: link.attributes.type,
    style: link.attributes.style,
    platform: link.attributes.platform,
    icon: link.attributes.icon,
    isExternal: link.attributes.isExternal,
  };
}