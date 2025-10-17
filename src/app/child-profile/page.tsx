"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { getUserCategory } from "@/lib/userCategories";
import { getSponsorProfile, getSponsorStatusInfo, getActiveSponsorshipRequest, hasMatchedChildren, isExistingSponsor, Sponsor, Sponsorship } from "@/lib/sponsors";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Heart,
  User,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Target,
  BookOpen,
  Clock
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TimelineSection from "@/components/TimelineSection";
import AdditionalSponsorshipModal from "@/components/AdditionalSponsorshipModal";
import { STRAPI_URL, getStrapiImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GallerySlider from "@/components/GallerySlider";

interface StrapiImage {
  id: number;
  url: string;
  name: string;
  alternativeText?: string;
  width: number;
  height: number;
}

interface ChildProfile {
  id: number | string; // allow string ids like "LIA-00041"
  documentId?: string;
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
  ageAtJoining: string | number | null;
  gradeAtJoining: string | null;
  currentGrade: string;
  school: string;
  walkToSchool: string;
  family: string;
  location: string;
  aspiration: string;
  hobby: string;
  about?: string;
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
  const [showSponsorshipModal, setShowSponsorshipModal] = useState(false);

  // Fetch assigned children
  async function fetchAssignedChildren(sponsorId: number, token: string): Promise<ChildProfile[]> {
    try {
      const attempts = [
        {
          name: "Filter by sponsor ID",
          url: `${STRAPI_URL}/api/children?filters[sponsor]=${sponsorId}&populate[images]=true&populate[sponsor]=true`,
        },
        {
          name: "Simple sponsor filter",
          url: `${STRAPI_URL}/api/children?filters[sponsor][$eq]=${sponsorId}&populate[images]=true&populate[sponsor]=true`,
        },
        {
          name: "Get all children",
          url: `${STRAPI_URL}/api/children?populate[images]=true&populate[sponsor]=true&pagination[pageSize]=100`,
        },
      ];

      for (const attempt of attempts) {
        try {
          const response = await fetch(attempt.url, {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            let children = data.data || [];

            if (attempt.name === "Get all children") {
              children = children.filter((child: ChildProfile) => {
                const childSponsorId = typeof child.sponsor === "object" && child.sponsor !== null ? child.sponsor.id : child.sponsor;
                return childSponsorId == sponsorId;
              });
            }

            if (children.length > 0) {
              return children;
            }
          }
        } catch (_) {
          continue;
        }
      }

      return [];
    } catch (error) {
      console.error("Error fetching assigned children:", error);
      return [];
    }
  }

  // Extract loadUserData function so it can be called from modal
  const loadUserData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const categoryInfo = await getUserCategory(user, token);
      if (categoryInfo.category !== "SPONSOR") {
        router.push("/sponsor-a-child");
        return;
      }

      const profile = await getSponsorProfile(user.email, token);
      setSponsorProfile(profile);

      if (profile && profile.id) {
        const children = await fetchAssignedChildren(profile.id, token);
        setAssignedChildren(children);
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Failed to load your sponsorship information");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const currentChild = assignedChildren[selectedChildIndex];
  const hasAssignedChildren = assignedChildren.length > 0;
  const sponsorStatusInfo = getSponsorStatusInfo(sponsorProfile);
  const activeRequest = getActiveSponsorshipRequest(sponsorProfile);
  const hasChildren = hasMatchedChildren(sponsorProfile);
  const isExisting = isExistingSponsor(sponsorProfile);
  
  // Determine display state
  const showChildrenOnly = hasChildren && !activeRequest;
  const showRequestOnly = !hasChildren && (activeRequest || (isExisting && !hasChildren)); // Show timeline for pending or data issues
  const showBoth = hasChildren && activeRequest;
  const showRegistration = !isExisting && !activeRequest && !hasChildren; // Only show to completely new users

  // Helpers
  function calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  function calculateTimeInProgram(joinedDate: string): string {
    const joined = new Date(joinedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joined.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    if (years > 0) return `${years} year${years > 1 ? "s" : ""}, ${months} month${months > 1 ? "s" : ""}`;
    return `${months} month${months > 1 ? "s" : ""}`;
  }

  function getDisplayId(child?: ChildProfile): string {
    if (!child) return "";
    if (child.documentId && typeof child.documentId === "string") return child.documentId;
    if (typeof child.id === "string") return child.id;
    const numeric = Number(child.id);
    if (!Number.isNaN(numeric)) return `LIA-${numeric.toString().padStart(5, "0")}`;
    return "";
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 py-28">
        <div className="mx-auto px-4 max-w-6xl">
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-gray-600">Loading your sponsorship information...</p>
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <Alert className="max-w-md mx-auto">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{hasAssignedChildren ? (assignedChildren.length === 1 ? "My Sponsored Child" : "My Sponsored Children") : "Your Sponsorship Journey"}</h1>
                    <p className="text-gray-600 mt-1">
                      {hasAssignedChildren
                        ? assignedChildren.length === 1
                          ? "View your sponsored child's profile and information"
                          : `You are sponsoring ${assignedChildren.length} children`
                        : "Track progress or start a new application"}
                    </p>
                    
                    {/* Active Request Status - Only show for additional requests (when they already have children) */}
                    {activeRequest && hasChildren && (
                      <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-gray-800">
                              Additional Request: {activeRequest.numberOfChildren} {activeRequest.numberOfChildren === 1 ? 'child' : 'children'}
                            </span>
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {activeRequest.sponsorshipStatus === 'submitted' ? 'Under Review' : 
                               activeRequest.sponsorshipStatus === 'pending' ? 'Finding Match' : 
                               activeRequest.sponsorshipStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Child switcher when multiple */}
                  {hasAssignedChildren && assignedChildren.length > 1 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowChildDropdown((v) => !v)}
                        className="flex items-center gap-2 px-4 py-2  bg-white text-primary border-2 border-gray-200 rounded-lg hover:bg-gray-200 transition-all"
                        aria-haspopup="listbox"
                        aria-expanded={showChildDropdown}
                        aria-label="Select child"
                      >
                        <User size={16} />
                        <span className="truncate max-w-[220px]">Viewing: {currentChild?.fullName}</span>
                        <ChevronDown size={16} />
                      </button>

                      {showChildDropdown && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden" role="listbox">
                          {assignedChildren.map((child, index) => (
                            <button
                              key={`${child.id}-${index}`}
                              onClick={() => { setSelectedChildIndex(index); setShowChildDropdown(false); }}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${index === selectedChildIndex ? "bg-primary/10 text-primary" : ""}`}
                              role="option"
                              aria-selected={index === selectedChildIndex}
                            >
                              <div className="font-medium leading-tight truncate">{child.fullName}</div>
                              <div className="text-xs text-gray-500">Grade {child.currentGrade}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic content based on sponsor state */}
              {(showChildrenOnly || showBoth) && hasAssignedChildren && currentChild && (
                <>
                  {/* Child Profile Section */}
                  <Card className="mb-6 shadow-sm">
                    <CardContent >
                      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                        {/* Main Profile Photo - First Image Only */}
                        <div>
                          {currentChild.images?.length ? (
                            <div className="rounded-2xl overflow-hidden shadow-sm bg-white">
                              <div className="relative" style={{ height: '300px' }}>
                                <Image
                                  src={getStrapiImageUrl(currentChild.images[0].url)}
                                  alt={currentChild.images[0].alternativeText || currentChild.fullName}
                                  fill
                                  className="object-contain"
                                  priority
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-[300px] bg-gray-200 rounded-2xl flex items-center justify-center">
                              <User className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Right info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
                          <div className="md:col-span-2 xl:col-span-3 bg-white rounded-xl p-4 border border-gray-100">
                            <div className="flex flex-wrap items-center gap-3">
                              <h2 className="text-2xl font-bold text-gray-900">{currentChild.fullName}</h2>
                              {/* {getDisplayId(currentChild) && (
                                <Badge variant="secondary">ID: {getDisplayId(currentChild)}</Badge>
                              )} */}
                            </div>
                            <p className="text-gray-600 mt-1 flex items-center gap-2">
                              <MapPin size={16} className="text-gray-500" />
                              <span className="truncate">{currentChild.location || "Location unavailable"}</span>
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1 text-sm text-gray-600"><BookOpen size={16} /> School</div>
                            <p className="font-semibold text-gray-900 leading-snug">{currentChild.school}</p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1 text-sm text-gray-600"><GraduationCap size={16} /> Current Grade</div>
                            <p className="font-semibold text-gray-900">{currentChild.currentGrade}</p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1 text-sm text-gray-600"><Clock size={16} /> Walk to School</div>
                            <p className="font-semibold text-gray-900">{currentChild.walkToSchool}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Details */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Personal Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <dl className="divide-y divide-gray-100">
                          <div className="flex items-center justify-between py-2">
                            <dt className="text-gray-600 font-medium">Age</dt>
                            <dd className="font-semibold text-gray-900">{calculateAge(currentChild.dateOfBirth)} years</dd>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <dt className="text-gray-600 font-medium">Date of Birth</dt>
                            <dd className="font-semibold text-gray-900">{new Date(currentChild.dateOfBirth).toLocaleDateString()}</dd>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 py-2">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Target size={16} /> Aspiration</h4>
                              <p className="text-gray-700 text-sm leading-relaxed">{currentChild.aspiration}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Heart size={16} /> Hobby</h4>
                              <p className="text-gray-700 text-sm leading-relaxed">{currentChild.hobby}</p>
                            </div>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Family Profile</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed">{currentChild.family}</p>
                        </div>
                        <dl className="divide-y divide-gray-100">
                          <div className="flex items-center justify-between py-2">
                            <dt className="text-gray-600 font-medium">Time in Program</dt>
                            <dd className="font-semibold text-gray-900">{calculateTimeInProgram(currentChild.joinedSponsorshipProgram)}</dd>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <dt className="text-gray-600 font-medium">Joined Program</dt>
                            <dd className="font-semibold text-gray-900">{new Date(currentChild.joinedSponsorshipProgram).toLocaleDateString()}</dd>
                          </div>
                          {currentChild.ageAtJoining && (
                            <div className="flex items-center justify-between py-2">
                              <dt className="text-gray-600 font-medium">Age at Joining</dt>
                              <dd className="font-semibold text-gray-900">{currentChild.ageAtJoining} years</dd>
                            </div>
                          )}
                          {currentChild.gradeAtJoining && (
                            <div className="flex items-center justify-between py-2">
                              <dt className="text-gray-600 font-medium">Grade at Joining</dt>
                              <dd className="font-semibold text-gray-900">{currentChild.gradeAtJoining}</dd>
                            </div>
                          )}
                        </dl>
                      </CardContent>
                    </Card>
                  </div>

                  {/* About section when present */}
                  {currentChild.about && (
                    <Card className="shadow-sm mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg">About {currentChild.fullName}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">{currentChild.about}</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Active Sponsorship Request Status - shown when there's an active request */}
              {showRequestOnly && activeRequest && (
                <TimelineSection
                  phases={[
                    { id: 1, date: "Step 1", title: "Request Submitted", description: "Your sponsorship request has been submitted and received." },
                    { id: 2, date: "Step 2", title: "Finding Match", description: "We are finding the perfect child match for your sponsorship." },
                    { id: 3, date: "Step 3", title: "Child Assigned", description: "Your sponsored child will be assigned and you'll receive their profile." },
                  ]}
                  currentPhase={
                    activeRequest.sponsorshipStatus === "submitted" ? 1 :
                    activeRequest.sponsorshipStatus === "pending" ? 2 : 1
                  }
                />
              )}

              {/* Registration form for completely new users only */}
              {showRegistration && (
                <div className="text-center">
                  <div className="bg-white rounded-lg shadow-sm p-10 mb-6">
                    <div className="text-6xl mb-4">💝</div>
                    <h2 className="text-2xl font-semibold mb-3">Start Your Sponsorship Journey</h2>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">You have not submitted a sponsorship application yet. Ready to make a lasting impact on a child's life?</p>
                    <Button onClick={() => router.push("/sponsor-a-child")} className="bg-primary text-white hover:bg-accent" size="lg">
                      <Heart className="mr-2 h-5 w-5" /> Start Sponsorship Application
                    </Button>
                  </div>
                </div>
              )}


              {/* Sponsor Another Child CTA - shown for existing sponsors */}
              {(showChildrenOnly || showBoth) && (
                <Card className="shadow-sm mb-6">
                  <CardContent >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Sponsor Another Child</h3>
                        <p className="text-gray-600 mt-1">There are more children who could benefit from your support.</p>
                      </div>
                      <Button onClick={() => setShowSponsorshipModal(true)} className="bg-primary text-white hover:bg-accent">
                        <Heart className="h-4 w-4 mr-2" /> Sponsor Another Child
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Photo Gallery - Show remaining images (if more than 1 image) */}
              {(showChildrenOnly || showBoth) && hasAssignedChildren && currentChild && currentChild.images && currentChild.images.length > 1 && (
                <GallerySlider
                  images={currentChild.images.slice(1)} 
                  childName={currentChild.fullName}
                />
              )}

              {/* Contact Section for pending requests */}
              {(showRequestOnly || showBoth) && (
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-2">Questions about your {showBoth ? 'additional ' : ''}sponsorship request?</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <a href="mailto:support@loveinaction.co" className="hover:text-primary">support@loveinaction.co</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Additional Sponsorship Modal */}
        {sponsorProfile && (
          <AdditionalSponsorshipModal
            isOpen={showSponsorshipModal}
            onClose={() => setShowSponsorshipModal(false)}
            sponsorId={sponsorProfile.id}
            sponsorEmail={sponsorProfile.email}
            onSuccess={() => {
              // Reload sponsor profile to get updated data
              loadUserData();
            }}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}
