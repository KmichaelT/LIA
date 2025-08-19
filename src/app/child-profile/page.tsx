'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCategory } from '@/lib/userCategories';
import { getSponsorProfile, getSponsorStatusInfo, Sponsor } from '@/lib/sponsors';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Heart, User, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import TimelineSection from '@/components/TimelineSection';
import NoChildrenState from '@/components/NoChildrenState';
import { STRAPI_URL, getStrapiImageUrl } from '@/lib/utils';

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

export default function ChildProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sponsorProfile, setSponsorProfile] = useState<Sponsor | null>(null);
  const [assignedChildren, setAssignedChildren] = useState<ChildProfile[]>([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [showChildDropdown, setShowChildDropdown] = useState(false);

  // Fetch assigned children
  async function fetchAssignedChildren(sponsorId: number, token: string): Promise<ChildProfile[]> {
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
              children = children.filter((child: ChildProfile) => {
                const childSponsorId = typeof child.sponsor === 'object' && child.sponsor !== null 
                  ? child.sponsor.id 
                  : child.sponsor;
                return childSponsorId == sponsorId;
              });
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

  useEffect(() => {
    async function loadUserData() {
      if (!isAuthenticated || !user) {
        router.push('/login');
        return;
      }

      const token = localStorage.getItem('jwt');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Get user category to determine what to show
        const categoryInfo = await getUserCategory(user, token);
        
        // Only SPONSOR category users should access this page
        if (categoryInfo.category !== 'SPONSOR') {
          router.push('/sponsor-a-child');
          return;
        }

        // Load sponsor profile
        const profile = await getSponsorProfile(user.email, token);
        setSponsorProfile(profile);

        // Load assigned children if sponsor profile exists
        if (profile && profile.id) {
          const children = await fetchAssignedChildren(profile.id, token);
          setAssignedChildren(children);
        }

      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load your sponsorship information');
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [isAuthenticated, user, router]);

  const currentChild = assignedChildren[selectedChildIndex];
  const hasAssignedChildren = assignedChildren.length > 0;
  const sponsorStatusInfo = getSponsorStatusInfo(sponsorProfile);
  const hasPendingRequests = sponsorProfile && !sponsorStatusInfo.hasChild;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-32">
        <div className="mx-auto px-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-gray-600">Loading your sponsorship information...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-32">
        <div className="mx-auto px-4 text-center">
          <Alert className="max-w-md mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 py-32">
        <div className=" mx-auto px-4 max-w-6xl">
          {/* STATE 2: Active - Show child profile when children are assigned */}
          {hasAssignedChildren ? (
            <>
              {/* Header with child selector */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="mb-2">
                      My Sponsored {assignedChildren.length === 1 ? 'Child' : 'Children'}
                    </h1>
                    <p>
                      {assignedChildren.length === 1 
                        ? 'Here is your sponsored child\'s profile and updates'
                        : `You are sponsoring ${assignedChildren.length} children`
                      }
                    </p>
                  </div>
                  
                  {/* Multiple children dropdown */}
                  {assignedChildren.length > 1 && (
                    <div className="mt-4 md:mt-0 relative">
                      <button
                        onClick={() => setShowChildDropdown(!showChildDropdown)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <User size={16} />
                        <span>Viewing: {currentChild.fullName}</span>
                        <ChevronDown size={16} />
                      </button>
                      
                      {showChildDropdown && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          {assignedChildren.map((child, index) => (
                            <button
                              key={child.id}
                              onClick={() => {
                                setSelectedChildIndex(index);
                                setShowChildDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                                index === selectedChildIndex ? 'bg-primary/10 text-primary' : ''
                              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                                index === assignedChildren.length - 1 ? 'rounded-b-lg' : ''
                              }`}
                            >
                              <div className="font-medium">{child.fullName}</div>
                              <div className="text-sm text-gray-500">Grade {child.currentGrade}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Child Profile Content */}
              {currentChild && (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Profile Image and Basic Info */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {currentChild.images && currentChild.images.length > 0 ? (
                        <Image
                          src={getStrapiImageUrl(currentChild.images[0].url)}
                          alt={currentChild.fullName}
                          width={400}
                          height={256}
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                          <User size={48} className="text-gray-400" />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h2 className="mb-4">
                          {currentChild.fullName}
                        </h2>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">Current Grade:</span>
                            <span className="text-gray-600">{currentChild.currentGrade}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">School:</span>
                            <span className="text-gray-600">{currentChild.school}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="text-gray-600">{currentChild.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* About Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="mb-4">About {currentChild.fullName}</h3>
                      <p className="leading-relaxed">{currentChild.about}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="mb-3">Personal Details</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Date of Birth:</strong> {new Date(currentChild.dateOfBirth).toLocaleDateString()}</div>
                          <div><strong>Aspiration:</strong> {currentChild.aspiration}</div>
                          <div><strong>Hobby:</strong> {currentChild.hobby}</div>
                          <div><strong>Walk to School:</strong> {currentChild.walkToSchool}</div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="mb-3">Family & Program</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Family:</strong> {currentChild.family}</div>
                          <div><strong>Joined Program:</strong> {new Date(currentChild.joinedSponsorshipProgram).toLocaleDateString()}</div>
                          {currentChild.ageAtJoining && (
                            <div><strong>Age at Joining:</strong> {currentChild.ageAtJoining}</div>
                          )}
                          {currentChild.gradeAtJoining && (
                            <div><strong>Grade at Joining:</strong> {currentChild.gradeAtJoining}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sponsor Another Child Button */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                      <h4 className="text-primary mb-2">Sponsor Another Child?</h4>
                      <p className="text-primary/80 mb-4">
                        There are more children who could benefit from your support. 
                        Would you like to sponsor an additional child?
                      </p>
                      <Button
                        onClick={() => router.push('/sponsor-a-child')}
                        className="bg-primary text-white hover:bg-accent"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Sponsor Another Child
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* STATE 1: Pending - Show timeline when no children assigned yet */
            <div className="max-w-4xl mx-auto">
              {hasPendingRequests ? (
                /* Show timeline for pending requests */
                <>
                  <TimelineSection
                    title="Your Sponsorship Journey"
                    description="Track the progress of your sponsorship application"
                    phases={[
                      {
                        id: 1,
                        date: "Step 1",
                        title: "Application Received",
                        description: "Your sponsorship application has been submitted and received."
                      },
                      {
                        id: 2,
                        date: "Step 2", 
                        title: "Processing",
                        description: "We are reviewing your application and assessing available children."
                      },
                      {
                        id: 3,
                        date: "Step 3",
                        title: "Decision",
                        description: "Final decision based on your application and children in need."
                      }
                    ]}
                    currentPhase={
                      sponsorProfile?.sponsorshipStatus === 'request_submitted' && !sponsorProfile?.profileComplete ? 1 :
                      sponsorProfile?.sponsorshipStatus === 'pending' || (sponsorProfile?.profileComplete && sponsorProfile?.sponsorshipStatus === 'request_submitted') ? 2 :
                      sponsorProfile?.sponsorshipStatus === 'matched' ? 3 : 1
                    }
                  />

                  {/* Contact info */}
                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">Questions about your application?</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail size={16} />
                        <a href="mailto:support@loveinaction.co" className="hover:text-primary">
                          support@loveinaction.co
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone size={16} />
                        <span>+1 (555) 123-4567</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* No pending requests - encourage to start */
                <>
                  <div className="text-center mb-8">
                    <h1 className="mb-4">
                      Your Sponsorship Journey
                    </h1>
                    <p className="text-xl">
                      Ready to start your sponsorship journey? Begin by submitting your application.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                      <div className="text-6xl mb-4">💝</div>
                      <h2 className="mb-4">
                        Start Your Sponsorship Journey
                      </h2>
                      <p className="mb-6 max-w-md mx-auto">
                        You haven't submitted a sponsorship application yet. 
                        Ready to make a lasting impact on a child's life?
                      </p>
                      <Button
                        onClick={() => router.push('/sponsor-a-child')}
                        className="bg-primary text-white hover:bg-accent"
                        size="lg"
                      >
                        <Heart className="mr-2 h-5 w-5" />
                        Start Sponsorship Application
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}