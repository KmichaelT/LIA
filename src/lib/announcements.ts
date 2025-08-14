import { STRAPI_URL } from '@/lib/utils';

export interface Announcement {
  id: number;
  documentId: string;
  title: string;
  message: string;
  link?: string;
  linkText?: string;
  isActive: boolean;
  type?: 'announcement' | 'info' | 'warning' | 'success';
  priority?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch active announcements from Strapi
 */
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  // Try multiple endpoint variations
  const endpoints = [
    `${STRAPI_URL}/api/alerts/active`,
    `${STRAPI_URL}/api/alerts?filters[isActive][$eq]=true`,
    `${STRAPI_URL}/api/alerts`,
    `${STRAPI_URL}/api/announcements?filters[isActive][$eq]=true`,
    `${STRAPI_URL}/api/announcements`
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle both single alert and array of alerts
        let alerts = Array.isArray(data) ? data : (data.data ? (Array.isArray(data.data) ? data.data : [data.data]) : []);
        
        // Filter for active alerts if not already filtered by endpoint
        if (!endpoint.includes('active') && !endpoint.includes('isActive')) {
          alerts = alerts.filter((alert: Record<string, unknown>) => alert.isActive === true);
        }

        if (alerts.length > 0) {
          // Map alerts to announcement format
          const mappedAlerts = alerts.map((alert: Record<string, unknown>) => ({
            id: alert.id,
            documentId: alert.documentId || String(alert.id),
            title: alert.title || '',
            message: alert.message || alert.description || '',
            link: alert.link || alert.url || '',
            linkText: alert.linkText || alert.buttonText || 'Learn More',
            isActive: alert.isActive !== undefined ? alert.isActive : true,
            type: alert.type || 'announcement',
            priority: alert.priority || 0,
            startDate: alert.startDate,
            endDate: alert.endDate,
            createdAt: alert.createdAt,
            updatedAt: alert.updatedAt
          }));
          
          return mappedAlerts;
        }
      }
    } catch (error) {
      continue;
    }
  }
  
  return [];
}

/**
 * Get the highest priority active announcement
 */
export async function getTopAnnouncement(): Promise<Announcement | null> {
  const announcements = await getActiveAnnouncements();
  return announcements.length > 0 ? announcements[0] : null;
}

/**
 * Fetch a specific alert by ID
 */
export async function getAlert(id: string | number): Promise<Announcement | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/alerts/${id}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Alert with ID ${id} not found`);
      } else {
        console.error(`Failed to fetch alert ${id}:`, response.status);
      }
      return null;
    }

    const data = await response.json();
    const alert = data.data || data;

    // Map alert to announcement format
    return {
      id: alert.id,
      documentId: alert.documentId || alert.id.toString(),
      title: alert.title || '',
      message: alert.message || alert.description || '',
      link: alert.link || alert.url || '',
      linkText: alert.linkText || alert.buttonText || 'Learn More',
      isActive: alert.isActive !== undefined ? alert.isActive : true,
      priority: alert.priority || 0,
      startDate: alert.startDate,
      endDate: alert.endDate,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt
    };
  } catch (error) {
    console.error(`Error fetching alert ${id}:`, error);
    return null;
  }
}