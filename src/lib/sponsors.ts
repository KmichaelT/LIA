import { STRAPI_URL } from '@/lib/utils';

export interface Sponsorship {
  id: number;
  documentId: string;
  sponsorshipStatus: 'submitted' | 'pending' | 'matched';
  numberOfChildren: number;
  sponsor?: {
    id: number;
    email: string;
    [key: string]: unknown;
  };
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

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
  sponsorshipStatus?: 'request_submitted' | 'pending' | 'matched'; // Legacy field for backward compatibility
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
  sponsorship?: Sponsorship; // One-to-one relation to sponsorship collection
  notes?: string;
}

/**
 * Fetch sponsor profile for a specific user by email
 */
export async function getSponsorProfile(email: string, token: string): Promise<Sponsor | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/sponsors?filters[email][$eq]=${email}&populate[children]=true&populate[sponsorship]=true`,
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
      
      // Debug log to see the actual structure
      console.log('Sponsor data from API:', {
        email: sponsor.email,
        hasChildren: !!sponsor.children?.length,
        hasSponsorship: !!sponsor.sponsorship,
        sponsorshipStatus: sponsor.sponsorship?.sponsorshipStatus,
        profileComplete: sponsor.profileComplete
      });
      
      return sponsor;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching sponsor profile:', error);
    return null;
  }
}

/**
 * Get active sponsorship request for a sponsor
 */
export function getActiveSponsorshipRequest(sponsor: Sponsor | null): Sponsorship | null {
  if (!sponsor || !sponsor.sponsorship) {
    return null;
  }
  
  // Check if the sponsorship is not matched (active request)
  const sponsorship = sponsor.sponsorship;
  if (sponsorship.sponsorshipStatus === 'submitted' || sponsorship.sponsorshipStatus === 'pending') {
    return sponsorship;
  }
  
  return null;
}

/**
 * Check if sponsor has any matched children
 */
export function hasMatchedChildren(sponsor: Sponsor | null): boolean {
  if (!sponsor) return false;
  
  // Check if they have assigned children (this is the primary indicator)
  if (sponsor.assignedChild || (sponsor.children && sponsor.children.length > 0)) {
    return true;
  }
  
  // Check sponsorship for matched status
  if (sponsor.sponsorship && sponsor.sponsorship.sponsorshipStatus === 'matched') {
    return true;
  }
  
  return false;
}

/**
 * Check if sponsor exists in the system (has a sponsor record)
 */
export function isExistingSponsor(sponsor: Sponsor | null): boolean {
  return !!sponsor && !!sponsor.id;
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
      hasChild: false,
      hasActiveRequest: false
    };
  }

  const hasChildren = hasMatchedChildren(sponsor);
  const activeRequest = getActiveSponsorshipRequest(sponsor);

  // Check if they have assigned children
  if (hasChildren) {
    return {
      status: 'matched',
      message: sponsor.assignedChild 
        ? `You are sponsoring ${sponsor.assignedChild.fullName}`
        : 'You have sponsored children',
      bgColor: 'bg-accent/10',
      textColor: 'text-accent',
      hasChild: true,
      hasActiveRequest: !!activeRequest,
      childName: sponsor.assignedChild?.fullName
    };
  }

  // Check for active sponsorship requests
  if (activeRequest) {
    // Check profile completion status
    if (!sponsor.profileComplete) {
      return {
        status: 'processing',
        message: 'Your profile is being processed',
        bgColor: 'bg-secondary/10',
        textColor: 'text-secondary',
        hasChild: false,
        hasActiveRequest: true
      };
    }

    // Active request status
    switch (activeRequest.sponsorshipStatus) {
      case 'submitted':
        return {
          status: 'pending',
          message: 'Your sponsorship request is under review',
          bgColor: 'bg-primary/10',
          textColor: 'text-primary',
          hasChild: false,
          hasActiveRequest: true
        };
      case 'pending':
        return {
          status: 'pending',
          message: 'Match in progress - we are finding your child',
          bgColor: 'bg-primary/10',
          textColor: 'text-primary',
          hasChild: false,
          hasActiveRequest: true
        };
    }
  }

  // Check if sponsor exists but has no sponsorship record (existing sponsor who completed their first sponsorship)
  if (isExistingSponsor(sponsor) && !sponsor.sponsorship) {
    return {
      status: 'existing',
      message: 'Ready to sponsor another child',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      hasChild: false,
      hasActiveRequest: false
    };
  }

  // Fallback to legacy status for backward compatibility
  if (!sponsor.profileComplete) {
    return {
      status: 'processing',
      message: 'Your profile is being processed',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      hasChild: false,
      hasActiveRequest: false
    };
  }

  // No active requests or children
  return {
    status: 'none',
    message: 'No active sponsorship requests',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    hasChild: false,
    hasActiveRequest: false
  };
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