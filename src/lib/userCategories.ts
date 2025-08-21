import { getSponsorProfile } from '@/lib/sponsors';
import { getUserAssignedChildrenCount } from '@/lib/userStatus';

export type UserCategory = 'PUBLIC' | 'USER' | 'SPONSOR';

export interface UserCategoryInfo {
  category: UserCategory;
  hasProfile: boolean;
  hasAssignedChildren: boolean;
  hasPendingRequests: boolean;
  assignedChildrenCount: number;
  pendingRequestsCount: number;
}

/**
 * Determine user category and status information
 */
export async function getUserCategory(user: { email: string; sponsor?: { id: number } } | null, token: string | null): Promise<UserCategoryInfo> {
  // PUBLIC: Not authenticated
  if (!user || !token) {
    return {
      category: 'PUBLIC',
      hasProfile: false,
      hasAssignedChildren: false,
      hasPendingRequests: false,
      assignedChildrenCount: 0,
      pendingRequestsCount: 0,
    };
  }

  try {
    const hasProfile = !!user.sponsor;
    let assignedChildrenCount = 0;
    let pendingRequestsCount = 0;
    let hasPendingRequests = false;

    // Check for sponsor profile
    const sponsorProfile = await getSponsorProfile(user.email, token);
    if (sponsorProfile) {
      // Check if they have pending sponsorship using new sponsorship architecture
      const hasActiveSponsorship = sponsorProfile.sponsorship && 
                                  (sponsorProfile.sponsorship.sponsorshipStatus === 'submitted' || 
                                   sponsorProfile.sponsorship.sponsorshipStatus === 'pending');
      
      const isPending = !sponsorProfile.assignedChild && 
                       (hasActiveSponsorship || !sponsorProfile.profileComplete);
      
      if (isPending) {
        pendingRequestsCount = 1;
        hasPendingRequests = true;
      }
    }

    // Check for assigned children if user has a sponsor profile
    if (hasProfile && user.sponsor) {
      assignedChildrenCount = await getUserAssignedChildrenCount(user.sponsor.id, token);
    }

    const hasAssignedChildren = assignedChildrenCount > 0;

    // Determine category based on sponsorship status
    let category: UserCategory = 'USER';
    
    // User is SPONSOR if they have:
    // 1. Assigned children, OR
    // 2. Pending requests, OR 
    // 3. Completed profile with sponsorship record (Make.com edge case)
    const hasCompletedSponsorProfile = sponsorProfile && 
                                     sponsorProfile.profileComplete && 
                                     sponsorProfile.sponsorship;
    
    if (hasAssignedChildren || hasPendingRequests || hasCompletedSponsorProfile) {
      category = 'SPONSOR';
    }

    return {
      category,
      hasProfile,
      hasAssignedChildren,
      hasPendingRequests,
      assignedChildrenCount,
      pendingRequestsCount,
    };
  } catch (error) {
    console.error('Error determining user category:', error);
    
    // Fallback to USER category for authenticated users
    return {
      category: 'USER',
      hasProfile: !!user.sponsor,
      hasAssignedChildren: false,
      hasPendingRequests: false,
      assignedChildrenCount: 0,
      pendingRequestsCount: 0,
    };
  }
}

/**
 * Get navigation button configuration based on user category
 */
export function getNavigationConfig(categoryInfo: UserCategoryInfo) {
  const { category } = categoryInfo;

  // Show consistent navigation for all users: Child Profile + Sponsor a Child
  switch (category) {
    case 'PUBLIC':
      return {
        showLoginButton: false,
        showSponsorButton: true,
        showMyChildrenButton: true,
        showCompleteProfileButton: false,
        loginButtonText: 'Login',
        loginButtonHref: '/login',
        sponsorButtonText: 'Sponsor a Child',
        sponsorButtonHref: '/register', // Non-authenticated users go to register first
        myChildrenButtonHref: '/child-profile', // Will redirect to login if not authenticated
        completeProfileButtonHref: '/complete-profile',
      };

    case 'SPONSOR':
      // Sponsors don't need to see "Sponsor a Child" button
      return {
        showLoginButton: false,
        showSponsorButton: false, // Hide sponsor button for existing sponsors
        showMyChildrenButton: true,
        showCompleteProfileButton: false,
        loginButtonText: 'Login',
        loginButtonHref: '/login',
        sponsorButtonText: 'Sponsor a Child',
        sponsorButtonHref: '/sponsor-a-child',
        myChildrenButtonHref: '/child-profile',
        completeProfileButtonHref: '/complete-profile',
      };
    
    case 'USER':
    default:
      // Regular authenticated users can see both buttons
      return {
        showLoginButton: false,
        showSponsorButton: true,
        showMyChildrenButton: true,
        showCompleteProfileButton: false,
        loginButtonText: 'Login',
        loginButtonHref: '/login',
        sponsorButtonText: 'Sponsor a Child',
        sponsorButtonHref: '/sponsor-a-child',
        myChildrenButtonHref: '/child-profile',
        completeProfileButtonHref: '/complete-profile',
      };
  }
}

/**
 * Check if user should be redirected from sponsor-a-child page
 */
export function shouldRedirectFromSponsorPage(categoryInfo: UserCategoryInfo): boolean {
  const { category, hasAssignedChildren, hasPendingRequests } = categoryInfo;
  
  // Redirect SPONSOR users who already have children or pending requests
  return category === 'SPONSOR' && (hasAssignedChildren || hasPendingRequests);
}

/**
 * Get the appropriate redirect URL for different scenarios
 */
export function getRedirectUrl(categoryInfo: UserCategoryInfo, currentPath: string): string | null {
  if (currentPath === '/sponsor-a-child' && shouldRedirectFromSponsorPage(categoryInfo)) {
    return '/child-profile';
  }
  
  return null;
}