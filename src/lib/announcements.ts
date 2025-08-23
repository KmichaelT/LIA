import { STRAPI_URL } from '@/lib/utils';

export interface Link {
  id: number;
  documentId: string;
  url: string;
  label: string;
  type?: string;
  isExternal?: boolean;
  opensInPopup?: boolean;
}

export interface Announcement {
  id: number;
  documentId: string;
  title: string | null;
  message: string;
  linkUrl?: string; // Simple text field for link URL
  linkText?: string; // Simple text field for link label
  isActive: boolean;
  type?: 'announcement' | 'info' | 'warning' | 'success';
  priority?: number;
  startAt?: string;
  endAt?: string;
  createdAt: string;
  updatedAt: string;
  // Legacy fields for backward compatibility
  link?: string;
  actionLink?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Fetch active announcements from Strapi
 */
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  // Use simple endpoints without complex relations
  const endpoints = [
    `${STRAPI_URL}/api/alerts?filters[isActive][$eq]=true`,
    `${STRAPI_URL}/api/alerts`
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
        
        // Additional date-based filtering
        const now = new Date();
        alerts = alerts.filter((alert: Record<string, unknown>) => {
          const startAt = alert.startAt ? new Date(alert.startAt as string) : null;
          const endAt = alert.endAt ? new Date(alert.endAt as string) : null;
          
          // If no start date, assume it's active
          if (!startAt && !endAt) return true;
          
          // Check if current time is within the alert's active period
          const isAfterStart = !startAt || now >= startAt;
          const isBeforeEnd = !endAt || now <= endAt;
          
          return isAfterStart && isBeforeEnd;
        });

        if (alerts.length > 0) {
          // Map alerts to announcement format
          const mappedAlerts = alerts.map((alert: Record<string, unknown>) => {
            // Handle simple text-based links
            const linkUrl = alert.linkUrl || alert.actionLink || alert.link || alert.url;
            const linkText = alert.linkText || alert.linkLabel || alert.buttonText || 'Learn More';

            return {
              id: alert.id,
              documentId: alert.documentId || String(alert.id),
              title: alert.title || null,
              message: alert.message || alert.description || '',
              linkUrl: linkUrl ? String(linkUrl) : undefined,
              linkText: linkText ? String(linkText) : undefined,
              isActive: alert.isActive !== undefined ? alert.isActive : true,
              type: alert.type || 'announcement',
              priority: alert.priority || 0,
              startAt: alert.startAt,
              endAt: alert.endAt,
              createdAt: alert.createdAt,
              updatedAt: alert.updatedAt,
              // Legacy fields for backward compatibility
              link: linkUrl ? String(linkUrl) : undefined,
              actionLink: linkUrl ? String(linkUrl) : undefined,
              startDate: alert.startAt,
              endDate: alert.endAt
            };
          });
          
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

    // Handle simple text-based links
    const linkUrl = alert.linkUrl || alert.actionLink || alert.link || alert.url;
    const linkText = alert.linkText || alert.linkLabel || alert.buttonText || 'Learn More';

    // Map alert to announcement format
    return {
      id: alert.id,
      documentId: alert.documentId || alert.id.toString(),
      title: alert.title || null,
      message: alert.message || alert.description || '',
      linkUrl: linkUrl ? String(linkUrl) : undefined,
      linkText: linkText ? String(linkText) : undefined,
      isActive: alert.isActive !== undefined ? alert.isActive : true,
      type: alert.type || 'announcement',
      priority: alert.priority || 0,
      startAt: alert.startAt,
      endAt: alert.endAt,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
      // Legacy fields for backward compatibility
      link: linkUrl ? String(linkUrl) : undefined,
      actionLink: linkUrl ? String(linkUrl) : undefined,
      startDate: alert.startAt,
      endDate: alert.endAt
    };
  } catch (error) {
    console.error(`Error fetching alert ${id}:`, error);
    return null;
  }
}