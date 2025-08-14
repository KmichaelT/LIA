import { STRAPI_URL } from '@/lib/utils';
import { getSponsorProfile } from '@/lib/sponsors';

interface SponsorProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: unknown;
}

interface ChildProfile {
  id: number;
  documentId: string;
  fullName: string;
  sponsor: string | SponsorProfile | null;
  [key: string]: unknown;
}

/**
 * Check if user has assigned children
 */
export async function getUserAssignedChildrenCount(sponsorId: number, token: string): Promise<number> {
  try {
    const attempts = [
      {
        name: 'Filter by sponsor ID',
        url: `${STRAPI_URL}/api/children?filters[sponsor]=${sponsorId}&populate[sponsor]=true`,
      },
      {
        name: 'Simple sponsor filter',
        url: `${STRAPI_URL}/api/children?filters[sponsor][$eq]=${sponsorId}&populate[sponsor]=true`,
      },
      {
        name: 'Get all children',
        url: `${STRAPI_URL}/api/children?populate[sponsor]=true&pagination[pageSize]=100`,
      },
    ];

    for (const attempt of attempts) {
      try {
        const response = await fetch(attempt.url, {
          cache: 'no-store',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          let children = data.data || [];
          
          if (attempt.name === 'Get all children') {
            children = children.filter((child: ChildProfile) => {
              const childSponsorId = typeof child.sponsor === 'object' && child.sponsor !== null 
                ? child.sponsor.id 
                : child.sponsor;
              return childSponsorId == sponsorId;
            });
          }
          
          if (children.length > 0) {
            return children.length;
          }
        }
      } catch (err) {
        continue;
      }
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching assigned children count:', error);
    return 0;
  }
}

/**
 * Check if user has open sponsorship requests
 */
export async function hasOpenSponsorshipRequests(email: string, token: string): Promise<boolean> {
  try {
    const sponsorProfile = await getSponsorProfile(email, token);
    
    if (!sponsorProfile) {
      return false;
    }
    
    // Check if they have pending sponsorship (profile exists but no child assigned)
    const isPending = !sponsorProfile.assignedChild && 
                     (sponsorProfile.sponsorshipStatus === 'request_submitted' || 
                      sponsorProfile.sponsorshipStatus === 'pending' ||
                      !sponsorProfile.profileComplete);
    
    return isPending;
  } catch (error) {
    console.error('Error checking sponsorship requests:', error);
    return false;
  }
}

/**
 * Determine if "Sponsor a Child" button should be shown
 */
export async function shouldShowSponsorButton(user: { email: string; sponsor?: { id: number } } | null, token: string): Promise<boolean> {
  if (!user?.sponsor) {
    return true; // Show for users without profiles
  }

  try {
    const [childrenCount, hasOpenRequests] = await Promise.all([
      getUserAssignedChildrenCount(user.sponsor.id, token),
      hasOpenSponsorshipRequests(user.email, token)
    ]);

    // Show button only if user has no assigned children AND no open sponsorship requests
    return childrenCount === 0 && !hasOpenRequests;
  } catch (error) {
    console.error('Error determining sponsor button visibility:', error);
    return true; // Default to showing the button
  }
}