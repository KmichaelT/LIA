import { STRAPI_URL } from './utils';

// Helper function to construct Strapi API URLs
function getStrapiURL(path = '') {
  return `${STRAPI_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// Generic fetch function for Strapi API with timeout
async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
  
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
    next: { revalidate: 60 }, // Cache for 60 seconds
    ...options,
  };

  const queryString = new URLSearchParams(urlParamsObject).toString();
  const requestUrl = `${getStrapiURL(path)}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(requestUrl, mergedOptions);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Strapi API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Strapi fetch timeout:', path);
    } else {
      console.error('Strapi fetch error:', error);
    }
    return null;
  }
}

// Services API
export async function getServices(limit?: number) {
  const params: Record<string, string | number | {limit: number}> = {
    'sort[0]': 'createdAt:asc',
    'populate': '*'
  };
  
  if (limit) {
    params.pagination = { limit };
  }

  const data = await fetchAPI('/api/services', params);
  return data?.data || [];
}

export async function getFeaturedServices() {
  const data = await fetchAPI('/api/services', {
    'sort[0]': 'createdAt:asc',
    'populate': '*',
    'pagination[limit]': 4
  });
  return data?.data || [];
}

// Events API
export async function getEvents(limit?: number) {
  const params: Record<string, string | number | {limit: number}> = {
    'sort[0]': 'date:asc',
    'populate': '*'
  };
  
  if (limit) {
    params.pagination = { limit };
  }

  const data = await fetchAPI('/api/events', params);
  return data?.data || [];
}

export async function getFeaturedEvents() {
  const data = await fetchAPI('/api/events', {
    'filters[featured][$eq]': true,
    'sort[0]': 'date:asc',
    'populate': '*',
    'pagination[limit]': 4
  });
  return data?.data || [];
}

export async function getUpcomingEvents(limit = 4) {
  const today = new Date().toISOString();
  const data = await fetchAPI('/api/events', {
    'filters[date][$gte]': today,
    'sort[0]': 'date:asc',
    'populate': '*',
    'pagination[limit]': limit
  });
  return data?.data || [];
}

// Causes API
export async function getCauses(limit?: number) {
  const params: Record<string, string | number | {limit: number}> = {
    'sort[0]': 'createdAt:desc',
    'populate': '*'
  };
  
  if (limit) {
    params.pagination = { limit };
  }

  const data = await fetchAPI('/api/causes', params);
  return data?.data || [];
}

export async function getFeaturedCauses() {
  const data = await fetchAPI('/api/causes', {
    'sort[0]': 'createdAt:desc',
    'populate': '*',
    'pagination[limit]': 5
  });
  return data?.data || [];
}

export async function getActiveCauses(limit = 5) {
  const data = await fetchAPI('/api/causes', {
    'sort[0]': 'createdAt:desc',
    'populate': '*',
    'pagination[limit]': limit
  });
  return data?.data || [];
}

// Stats API
export async function getStats() {
  const data = await fetchAPI('/api/stats', {
    'sort[0]': 'createdAt:asc',
    'populate': '*'
  });
  return data?.data || [];
}

export async function getImpactStats() {
  const data = await fetchAPI('/api/stats', {
    'filters[category][$eq]': 'impact',
    'sort[0]': 'createdAt:asc',
    'populate': '*'
  });
  return data?.data || [];
}

// Links API
export async function getLinks(type?: string) {
  const params: Record<string, string | number | {limit: number}> = {
    'sort[0]': 'createdAt:asc',
    'populate': '*'
  };
  
  if (type) {
    params['filters[type][$eq]'] = type;
  }

  const data = await fetchAPI('/api/links', params);
  return data?.data || [];
}

export async function getCTALinks() {
  return getLinks('cta');
}

export async function getNavigationLinks() {
  return getLinks('navigation');
}

export async function getSocialLinks() {
  return getLinks('social');
}

// Single Types API
export async function getHomePage() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
  
  try {
    // Build population query for the new clean homepage structure
    const populateQuery = new URLSearchParams({
      // Populate hero background image
      'populate[heroBackgroundImage][fields][0]': 'url',
      'populate[heroBackgroundImage][fields][1]': 'name',
      'populate[heroBackgroundImage][fields][2]': 'alternativeText',
      'populate[heroBackgroundImage][fields][3]': 'formats',
      
      // Hero button fields
      'populate[donateNowButton][fields][0]': 'label',
      'populate[donateNowButton][fields][1]': 'url',
      'populate[donateNowButton][fields][2]': 'type',
      'populate[donateNowButton][fields][3]': 'isExternal',
      'populate[donateNowButton][fields][4]': 'opensInPopup',
      
      'populate[watchVideoButton][fields][0]': 'label',
      'populate[watchVideoButton][fields][1]': 'url',
      'populate[watchVideoButton][fields][2]': 'type',
      'populate[watchVideoButton][fields][3]': 'isExternal',
      'populate[watchVideoButton][fields][4]': 'opensInPopup',
      
      // Populate hero stats
      'populate[heroStats][fields][0]': 'label',
      'populate[heroStats][fields][1]': 'value',
      'populate[heroStats][fields][2]': 'description',
      
      // Populate causes section with all related causes
      'populate[causes][populate][image][fields][0]': 'url',
      'populate[causes][populate][image][fields][1]': 'alternativeText',
      'populate[causes][populate][blogLink][fields][0]': 'Heading',
      'populate[causes][populate][blogLink][fields][1]': 'documentId',
      // Note: link field commented out until it exists in CMS
      'populate[causes][populate][link][fields][0]': 'url',
      'populate[causes][populate][link][fields][1]': 'label',
      'populate[causes][populate][link][fields][2]': 'type',
      'populate[causes][populate][link][fields][3]': 'isExternal',
      'populate[causes][populate][link][fields][4]': 'opensInPopup',
      'populate[causes][fields][0]': 'title',
      'populate[causes][fields][1]': 'description',
      
      // Populate events section with all related events
      'populate[events][populate][image][fields][0]': 'url',
      'populate[events][populate][image][fields][1]': 'alternativeText',
      'populate[events][populate][registrationLink][fields][0]': 'url',
      'populate[events][populate][registrationLink][fields][1]': 'label',
      'populate[events][populate][registrationLink][fields][2]': 'type',
      'populate[events][populate][registrationLink][fields][3]': 'isExternal',
      'populate[events][populate][registrationLink][fields][4]': 'opensInPopup',
      'populate[events][fields][0]': 'title',
      'populate[events][fields][1]': 'description',
      'populate[events][fields][2]': 'date',
      'populate[events][fields][3]': 'location',
      'populate[events][fields][4]': 'featured',
      
      // Populate services section with all related services
      'populate[services][fields][0]': 'title',
      'populate[services][fields][1]': 'description',
      'populate[services][fields][2]': 'icon',
      'populate[services][fields][3]': 'hasDetails',
      'populate[services][populate][learnMoreBlog][fields][0]': 'Heading',
      'populate[services][populate][learnMoreBlog][fields][1]': 'documentId'
    });
    
    const response = await fetch(`${STRAPI_URL}/api/home-page?${populateQuery.toString()}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API Error:', response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch home page: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Homepage fetch timeout after 8 seconds');
    } else {
      console.error('Error fetching home page:', error);
    }
    return null;
  }
}

export async function getAboutUs() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
  
  try {
    // Build specific population query for about page with team member fields
    const populateQuery = new URLSearchParams({
      // Populate hero image
      'populate[heroImage][fields][0]': 'url',
      'populate[heroImage][fields][1]': 'alternativeText',
      'populate[heroImage][fields][2]': 'name',
      
      // Populate team members image
      'populate[teamMembers][fields][0]': 'url',
      'populate[teamMembers][fields][1]': 'alternativeText',
      'populate[teamMembers][fields][2]': 'name',
      
      // Populate timeline items
      'populate[timelineItems][fields][0]': 'title',
      'populate[timelineItems][fields][1]': 'description',
      'populate[timelineItems][fields][2]': 'startYear',
      'populate[timelineItems][fields][3]': 'endYear',
    });
    
    const response = await fetch(`${STRAPI_URL}/api/about-us?${populateQuery.toString()}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Failed to fetch about us');
    }
    
    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('About Us fetch timeout after 8 seconds');
    } else {
      console.error('Error fetching about us:', error);
    }
    return null;
  }
}

// Utility functions for data transformation
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateProgress(raised: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}