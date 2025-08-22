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
  title: string;
  message: string;
  link?: Link | string; // Support both relation and legacy string format
  linkText?: string; // For backward compatibility
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
  // Try multiple endpoint variations with link population
  const endpoints = [
    `${STRAPI_URL}/api/alerts/active?populate=link`,
    `${STRAPI_URL}/api/alerts?filters[isActive][$eq]=true&populate=link`,
    `${STRAPI_URL}/api/alerts?populate=link`,
    `${STRAPI_URL}/api/announcements?filters[isActive][$eq]=true&populate=link`,
    `${STRAPI_URL}/api/announcements?populate=link`
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
          const mappedAlerts = alerts.map((alert: Record<string, unknown>) => {
            // Handle link relation or legacy string format
            let linkData: Link | string | undefined;
            
            if (alert.link && typeof alert.link === 'object' && (alert.link as Record<string, unknown>).url) {
              // It's a Link relation
              const linkObj = alert.link as Record<string, unknown>;
              linkData = {
                id: Number(linkObj.id),
                documentId: String(linkObj.documentId),
                url: String(linkObj.url),
                label: String(linkObj.label || linkObj.text || 'Learn More'),
                type: linkObj.type ? String(linkObj.type) : undefined,
                isExternal: Boolean(linkObj.isExternal),
                opensInPopup: Boolean(linkObj.opensInPopup)
              };
            } else if (typeof alert.link === 'string' && alert.link) {
              // Legacy string format
              linkData = alert.link;
            } else if (alert.url) {
              // Fallback to url field
              linkData = alert.url as string;
            }

            return {
              id: alert.id,
              documentId: alert.documentId || String(alert.id),
              title: alert.title || '',
              message: alert.message || alert.description || '',
              link: linkData,
              linkText: alert.linkText || alert.buttonText || (typeof linkData === 'object' ? linkData.label : 'Learn More'),
              isActive: alert.isActive !== undefined ? alert.isActive : true,
              type: alert.type || 'announcement',
              priority: alert.priority || 0,
              startDate: alert.startDate,
              endDate: alert.endDate,
              createdAt: alert.createdAt,
              updatedAt: alert.updatedAt
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
      `${STRAPI_URL}/api/alerts/${id}?populate=link`,
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

    // Handle link relation or legacy string format
    let linkData: Link | string | undefined;
    
    if (alert.link && typeof alert.link === 'object' && (alert.link as Record<string, unknown>).url) {
      // It's a Link relation
      const linkObj = alert.link as Record<string, unknown>;
      linkData = {
        id: Number(linkObj.id),
        documentId: String(linkObj.documentId),
        url: String(linkObj.url),
        label: String(linkObj.label || linkObj.text || 'Learn More'),
        type: linkObj.type ? String(linkObj.type) : undefined,
        isExternal: Boolean(linkObj.isExternal),
        opensInPopup: Boolean(linkObj.opensInPopup)
      };
    } else if (typeof alert.link === 'string' && alert.link) {
      // Legacy string format
      linkData = alert.link;
    } else if (alert.url) {
      // Fallback to url field
      linkData = alert.url as string;
    }

    // Map alert to announcement format
    return {
      id: alert.id,
      documentId: alert.documentId || alert.id.toString(),
      title: alert.title || '',
      message: alert.message || alert.description || '',
      link: linkData,
      linkText: alert.linkText || alert.buttonText || (typeof linkData === 'object' ? linkData.label : 'Learn More'),
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