import { getSponsorshipRequests } from '@/lib/sponsorshipRequests';
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

    // Check for sponsorship requests
    const sponsorshipRequests = await getSponsorshipRequests(user.email, token);
    const pendingRequests = sponsorshipRequests.filter(request => 
      request.status === 'submitted' ||
      request.status === 'pending' || 
      (request.requestStatus && ['submitted', 'pending'].includes(request.requestStatus.toLowerCase()))
    );
    
    pendingRequestsCount = pendingRequests.length;
    hasPendingRequests = pendingRequestsCount > 0;

    // Check for assigned children if user has a sponsor profile
    if (hasProfile && user.sponsor) {
      assignedChildrenCount = await getUserAssignedChildrenCount(user.sponsor.id, token);
    }

    const hasAssignedChildren = assignedChildrenCount > 0;

    // Determine category based on sponsorship status
    let category: UserCategory = 'USER';
    
    if (hasAssignedChildren || hasPendingRequests) {
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

    case 'USER':
    case 'SPONSOR':
    default:
      // Authenticated users see both buttons, but they behave differently based on their status
      return {
        showLoginButton: false,
        showSponsorButton: true,
        showMyChildrenButton: true,
        showCompleteProfileButton: false,
        loginButtonText: 'Login',
        loginButtonHref: '/login',
        sponsorButtonText: 'Sponsor a Child',
        sponsorButtonHref: '/sponsor-a-child', // Authenticated users go directly to form
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