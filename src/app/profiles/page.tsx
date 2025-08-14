'use client';

import React, { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { STRAPI_URL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import NoChildrenState from "@/components/NoChildrenState";

interface StrapiImage {
  id: number;
  url: string;
  name: string;
  alternativeText?: string;
  width: number;
  height: number;
}

interface ChildProfile {
  id: number;
  documentId: string;
  fullName: string;
  sponsor: string | { 
    id: number; 
    firstName: string; 
    lastName: string; 
    email: string;
    [key: string]: unknown;
  } | null;
  dateOfBirth: string;
  joinedSponsorshipProgram: string;
  ageAtJoining: string | null;
  gradeAtJoining: string | null;
  currentGrade: string;
  school: string;
  walkToSchool: string;
  family: string;
  location: string;
  aspiration: string;
  hobby: string;
  about: string;
  images?: StrapiImage[];
}

async function getUserAssignedChildren(sponsorId: number, token: string): Promise<ChildProfile[]> {
  try {
    const attempts = [
      {
        name: 'Filter by sponsor ID',
        url: `${STRAPI_URL}/api/children?filters[sponsor]=${sponsorId}&populate[images]=true&populate[sponsor]=true`,
      },
      {
        name: 'Simple sponsor filter',
        url: `${STRAPI_URL}/api/children?filters[sponsor][$eq]=${sponsorId}&populate[images]=true&populate[sponsor]=true`,
      },
      {
        name: 'Get all children',
        url: `${STRAPI_URL}/api/children?populate[images]=true&populate[sponsor]=true&pagination[pageSize]=100`,
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
            console.log('🔍 DEBUG: All children before filtering:', children.map((c: ChildProfile) => ({ 
              name: c.fullName, 
              sponsor: c.sponsor,
              sponsorId: typeof c.sponsor === 'object' && c.sponsor !== null ? c.sponsor.id : c.sponsor
            })));
            console.log('🔍 DEBUG: Looking for sponsor ID:', sponsorId);
            
            children = children.filter((child: ChildProfile) => {
              const childSponsorId = typeof child.sponsor === 'object' && child.sponsor !== null 
                ? child.sponsor.id 
                : child.sponsor;
              const matches = childSponsorId == sponsorId;
              console.log(`🔍 DEBUG: Child "${child.fullName}" sponsor ID: ${childSponsorId} vs ${sponsorId} = ${matches}`);
              return matches;
            });
            
            console.log('🔍 DEBUG: Children after filtering:', children.map((c: ChildProfile) => ({ 
              name: c.fullName, 
              sponsor: c.sponsor 
            })));
          }
          
          if (children.length > 0) {
            return children;
          }
        }
      } catch (err) {
        continue;
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching assigned children:', error);
    return [];
  }
}

function ProfilesPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function checkUserChildren() {
      if (!user) {
        setLoading(false);
        return;
      }

      if (!user.sponsor) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Checking children for user:', user.email, 'Sponsor ID:', user.sponsor.id);
        const children = await getUserAssignedChildren(user.sponsor.id, token);
        console.log('🔍 Found children count:', children.length);

        if (children.length === 1) {
          // Single child: redirect to individual profile page
          const child = children[0];
          console.log('✅ Redirecting to child profile:', child.documentId);
          router.replace(`/profiles/${child.documentId}`);
        } else if (children.length > 1) {
          // Multiple children: redirect to first child (could add selection page later)
          const firstChild = children[0];
          console.log('✅ Multiple children found, redirecting to first:', firstChild.documentId);
          router.replace(`/profiles/${firstChild.documentId}`);
        } else {
          // No children: show NoChildrenState
          console.log('ℹ️ No children found for user');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading children:', err);
        setError('Failed to load your assigned children');
        setLoading(false);
      }
    }

    checkUserChildren();
  }, [user, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Checking your sponsored children...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Children</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Show NoChildrenState for users with no assigned children
  return <NoChildrenState hasProfile={!!user?.sponsor} />;
}

export default function ProfilesPage() {
  return (
    <ProtectedRoute>
      <ProfilesPageContent />
    </ProtectedRoute>
  );
}