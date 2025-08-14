import { STRAPI_URL } from '@/lib/utils';

export interface SponsorshipRequest {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  monthlyContribution?: number;
  sponsee?: number;
  motivation: string;
  status: 'submitted' | 'pending' | 'matched' | 'rejected';
  requestStatus?: string; // Legacy field name
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  preferredAge?: string;
  preferredGender?: string;
  hearAboutUs?: string;
  assignedChild?: {
    id: number;
    fullName: string;
    [key: string]: unknown;
  } | null;
  notes?: string;
}

/**
 * Fetch sponsorship requests for a specific user by email
 */
export async function getSponsorshipRequests(email: string, token: string): Promise<SponsorshipRequest[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/sponsorship-requests?filters[email][$eq]=${email}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404 || response.status === 400) {
        // Sponsorship requests content type doesn't exist yet or has issues - this is ok
        console.log('Sponsorship requests API not available yet');
        return [];
      }
      throw new Error('Failed to fetch sponsorship requests');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching sponsorship requests:', error);
    return [];
  }
}

/**
 * Create a new sponsorship request
 */
export async function createSponsorshipRequest(
  requestData: Partial<SponsorshipRequest>,
  token: string
): Promise<SponsorshipRequest | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/sponsorship-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          ...requestData,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || 'Failed to create sponsorship request');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating sponsorship request:', error);
    throw error;
  }
}

/**
 * Update an existing sponsorship request
 */
export async function updateSponsorshipRequest(
  requestId: string,
  updates: Partial<SponsorshipRequest>,
  token: string
): Promise<SponsorshipRequest | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/sponsorship-requests/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: updates
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update sponsorship request');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating sponsorship request:', error);
    throw error;
  }
}

/**
 * Check if there are available children for sponsorship (children without a sponsor relation)
 */
export async function getAvailableChildrenCount(token: string): Promise<number> {
  try {
    // Fetch available children count
    
    // Try to get all children and filter client-side if direct filtering fails
    const response = await fetch(
      `${STRAPI_URL}/api/children?populate[sponsor]=true&pagination[pageSize]=100`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return 1; // Return 1 to show sponsor options, since we can't verify
    }

    const data = await response.json();
    
    // Count children without sponsors
    const children = data.data || [];
    const availableCount = children.filter((child: { sponsor?: unknown }) => !child.sponsor || child.sponsor === null).length;
    return availableCount;
  } catch (error) {
    console.error('Error fetching available children count:', error);
    return 1; // Return 1 to show sponsor options as fallback
  }
}

/**
 * Get the status display text and color for a sponsorship request
 */
export function getRequestStatusDisplay(status: string): { text: string; color: string; description: string } {
  const normalizedStatus = (status || '').toLowerCase();
  
  switch (normalizedStatus) {
    case 'submitted':
      return {
        text: 'Email Confirmed',
        color: 'bg-cyan-100 text-cyan-800',
        description: 'Thank you for confirming your email. We\'re processing your sponsorship request.'
      };
    case 'pending':
      return {
        text: 'Pending Review',
        color: 'bg-yellow-100 text-yellow-800',
        description: 'Your request is being reviewed by our team.'
      };
    case 'matched':
      return {
        text: 'Matched',
        color: 'bg-green-100 text-green-800',
        description: 'Congratulations! You\'ve been matched with a child.'
      };
    case 'rejected':
      return {
        text: 'Needs Attention',
        color: 'bg-red-100 text-red-800',
        description: 'Please contact us for more information about your request.'
      };
    default:
      return {
        text: 'Unknown',
        color: 'bg-gray-100 text-gray-800',
        description: 'Status information unavailable.'
      };
  }
}