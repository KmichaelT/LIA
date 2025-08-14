import { STRAPI_URL } from '@/lib/utils';

export interface Sponsor {
  id: number;
  documentId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  monthlyContribution?: number;
  motivation?: string;
  sponsorshipStatus: 'request_submitted' | 'pending' | 'matched';
  profileComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
  preferredAge?: string;
  preferredGender?: string;
  hearAboutUs?: string;
  children?: {
    id: number;
    fullName: string;
    [key: string]: unknown;
  }[];
  assignedChild?: {
    id: number;
    fullName: string;
    [key: string]: unknown;
  } | null;
  notes?: string;
}

/**
 * Fetch sponsor profile for a specific user by email
 */
export async function getSponsorProfile(email: string, token: string): Promise<Sponsor | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/sponsors?filters[email][$eq]=${email}&populate=children`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404 || response.status === 400) {
        // Sponsors content type doesn't exist yet or has issues - this is ok
        console.log('Sponsors API not available yet');
        return null;
      }
      throw new Error(`Failed to fetch sponsor profile: ${response.status}`);
    }

    const data = await response.json();
    const sponsors = data.data || [];
    
    if (sponsors.length > 0) {
      const sponsor = sponsors[0];
      // Map children array to assignedChild for backward compatibility
      if (sponsor.children && sponsor.children.length > 0) {
        sponsor.assignedChild = sponsor.children[0];
      }
      return sponsor;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching sponsor profile:', error);
    return null;
  }
}

/**
 * Get status information for sponsor profile
 */
export function getSponsorStatusInfo(sponsor: Sponsor | null) {
  if (!sponsor) {
    return {
      status: 'none',
      message: 'No sponsorship found',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      hasChild: false
    };
  }

  // Check if they have an assigned child
  if (sponsor.assignedChild) {
    return {
      status: 'matched',
      message: `You are sponsoring ${sponsor.assignedChild.fullName}`,
      bgColor: 'bg-accent/10',
      textColor: 'text-accent',
      hasChild: true,
      childName: sponsor.assignedChild.fullName
    };
  }

  // Check profile completion status
  if (!sponsor.profileComplete) {
    return {
      status: 'processing',
      message: 'Your profile is being processed',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      hasChild: false
    };
  }

  // Profile complete but no child assigned yet
  switch (sponsor.sponsorshipStatus) {
    case 'request_submitted':
    case 'pending':
      return {
        status: 'pending',
        message: 'Your sponsorship is under review',
        bgColor: 'bg-primary/10',
        textColor: 'text-primary',
        hasChild: false
      };
    case 'matched':
      return {
        status: 'matched-no-child',
        message: 'Match approved - child assignment pending',
        bgColor: 'bg-accent/10',
        textColor: 'text-accent',
        hasChild: false
      };
    default:
      return {
        status: 'unknown',
        message: 'Status unknown',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        hasChild: false
      };
  }
}

/**
 * Legacy function name for backward compatibility
 * @deprecated Use getSponsorProfile instead
 */
export async function getSponsorshipRequests(email: string, token: string): Promise<Sponsor[]> {
  const sponsor = await getSponsorProfile(email, token);
  return sponsor ? [sponsor] : [];
}

/**
 * Legacy interface for backward compatibility
 * @deprecated Use Sponsor interface instead
 */
export interface SponsorshipRequest extends Sponsor {
  requestStatus?: string; // Legacy field name
}