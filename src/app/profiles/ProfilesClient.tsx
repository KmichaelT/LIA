"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { STRAPI_URL, getStrapiImageUrl } from '@/lib/utils';
import { X, MapPin, User, CalendarDays, Loader2, ChevronLeft, ChevronRight, School, Footprints, Landmark, Heart, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NoChildrenState from "@/components/NoChildrenState";
import Image from "next/image";

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

interface ProfilesClientProps {
  profiles: ChildProfile[];
  hasProfile: boolean;
}

// Mini Carousel Component for Images
function MiniCarousel({ images = [], alt }: { images: StrapiImage[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const safeImages = images.length > 0 ? images : [];

  const next = () => setIndex((i) => (i + 1) % safeImages.length);
  const prev = () => setIndex((i) => (i - 1 + safeImages.length) % safeImages.length);

  useEffect(() => {
    setLoading(true);
  }, [index]);

  if (safeImages.length === 0) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl border bg-background">
        <div className="aspect-[4/3] w-full bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-sm">No photos available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border bg-background">
      <div className="aspect-[4/3] w-full">
        <Image
          src={getStrapiImageUrl(safeImages[index].url)}
          alt={safeImages[index].alternativeText || alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className={`object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
          onLoadingComplete={() => setLoading(false)}
          priority
        />
        {loading && (
          <div className="absolute inset-0 grid place-items-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>

      {safeImages.length > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-2">
            <div className="pointer-events-auto">
              <Button variant="secondary" size="icon" onClick={prev} aria-label="Previous image">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="pointer-events-auto">
              <Button variant="secondary" size="icon" onClick={next} aria-label="Next image">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1">
            {safeImages.map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-primary" : "bg-muted-foreground/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to format dates
function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso;
  }
}

function ProfilesClientContent({ profiles: initialProfiles, hasProfile }: ProfilesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);
  const [profileImages, setProfileImages] = useState<StrapiImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);

  // Handle child selection from URL or default selection
  useEffect(() => {
    const childId = searchParams.get('childId');
    
    if (initialProfiles.length === 0) {
      setSelectedProfile(null);
      return;
    }

    if (initialProfiles.length === 1) {
      // Auto-select single child
      setSelectedProfile(initialProfiles[0]);
      return;
    }

    // Multiple children - handle selection
    if (childId) {
      const child = initialProfiles.find(p => p.id.toString() === childId || p.documentId === childId);
      if (child) {
        setSelectedProfile(child);
        return;
      }
    }

    // Default to first child if no valid selection
    setSelectedProfile(initialProfiles[0]);
  }, [initialProfiles, searchParams]);

  // Update URL when child selection changes
  const selectChild = (child: ChildProfile) => {
    setSelectedProfile(child);
    setShowChildSelector(false);
    
    // Update URL with child selection
    const params = new URLSearchParams(searchParams.toString());
    params.set('childId', child.documentId);
    router.push(`/profiles?${params.toString()}`, { scroll: false });
  };

  // Fetch images and updated profile data for selected profile
  useEffect(() => {
    async function fetchProfileData() {
      if (!selectedProfile) {
        setProfileImages([]);
        return;
      }

      setLoadingImages(true);
      try {
        const response = await fetch(`${STRAPI_URL}/api/children/${selectedProfile.documentId}?populate=images&timestamp=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setProfileImages(data.data?.images || []);
          
          // Don't update selectedProfile here to avoid infinite loop
          // The profile data is already available from the initial fetch
        } else {
          console.error('Failed to fetch profile data');
          setProfileImages([]);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setProfileImages([]);
      } finally {
        setLoadingImages(false);
      }
    }

    fetchProfileData();
  }, [selectedProfile?.documentId, selectedProfile]);

  // Close child selector when clicking outside
  const handleClickOutside = () => {
    setShowChildSelector(false);
  };

  return (
    <div className="w-full" onClick={handleClickOutside}>
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Sponsored Children</h1>
            <p className="text-sm text-gray-600">View and manage your sponsored children's profiles</p>
          </div>
          
          {/* Child Selector for Multiple Children */}
          {initialProfiles.length > 1 && (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowChildSelector(!showChildSelector)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-expanded={showChildSelector}
                aria-haspopup="listbox"
              >
                <span className="font-medium">
                  {selectedProfile ? selectedProfile.fullName : 'Select Child'}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showChildSelector ? 'rotate-180' : ''}`} />
              </button>

              {/* Child Selection Dropdown */}
              {showChildSelector && (
                <div className="absolute z-50 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-64 max-h-60 overflow-auto">
                  {initialProfiles.map((profile) => (
                    <button
                      key={profile.documentId}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                        selectedProfile?.documentId === profile.documentId ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => selectChild(profile)}
                    >
                      <div className="font-medium text-gray-900">{profile.fullName}</div>
                      <div className="text-sm text-gray-500">
                        Grade {profile.currentGrade} • {profile.location}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 py-6">
        {/* Selected Profile Dashboard */}
        {selectedProfile && (
          <div className="space-y-6">
            {/* Profile Header with Close Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Child Profile</h2>
                <p className="text-gray-600">Detailed information and photos</p>
              </div>
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedProfile(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* New Dashboard Layout */}
            <div className="grid gap-6 md:grid-cols-5">
              {/* Left column: media and quick facts */}
              <div className="md:col-span-2 space-y-4">
                {loadingImages ? (
                  <div className="relative w-full overflow-hidden rounded-2xl border bg-background">
                    <div className="aspect-[4/3] w-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p className="text-sm">Loading images...</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <MiniCarousel images={profileImages} alt={selectedProfile.fullName} />
                )}

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick facts</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{selectedProfile.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>DOB: {formatDate(selectedProfile.dateOfBirth)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4" />
                      <span>School: {selectedProfile.school}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Footprints className="h-4 w-4" />
                      <span>Walk: {selectedProfile.walkToSchool}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedProfile.location}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column: profile details */}
              <div className="md:col-span-3 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">{selectedProfile.fullName}</CardTitle>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5" /> 
                            Sponsor: {
                              selectedProfile.sponsor 
                                ? (typeof selectedProfile.sponsor === 'string' 
                                    ? selectedProfile.sponsor 
                                    : `${selectedProfile.sponsor.firstName} ${selectedProfile.sponsor.lastName}`
                                  )
                                : "Available for sponsorship"
                            }
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div>Joined: {formatDate(selectedProfile.joinedSponsorshipProgram)}</div>
                        <div>Age at joining: {selectedProfile.ageAtJoining || "N/A"}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 h-full">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border p-3">
                        <div className="text-xs text-muted-foreground">Grade at joining</div>
                        <div className="font-medium">{selectedProfile.gradeAtJoining || "N/A"}</div>
                      </div>
                      <div className="rounded-xl border p-3">
                        <div className="text-xs text-muted-foreground">Current grade</div>
                        <div className="font-medium">{selectedProfile.currentGrade}</div>
                      </div>
                      <div className="rounded-xl border p-3">
                        <div className="text-xs text-muted-foreground">Aspiration</div>
                        <div className="font-medium">{selectedProfile.aspiration}</div>
                      </div>
                    </div>

                    <Separator />

                    <section className="space-y-2">
                      <h3 className="text-sm font-semibold tracking-tight">About</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{selectedProfile.about}</p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-sm font-semibold tracking-tight">Family</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{selectedProfile.family}</p>
                    </section>

                    <section className="space-y-2">
                      <h3 className="text-sm font-semibold tracking-tight">Hobby</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{selectedProfile.hobby}</p>
                    </section>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* No Children State */}
        {initialProfiles.length === 0 && (
          <NoChildrenState hasProfile={hasProfile} />
        )}
      </div>
    </div>
  );
}

export default function ProfilesClient({ profiles, hasProfile }: ProfilesClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading children profiles...</p>
        </div>
      </div>
    }>
      <ProfilesClientContent profiles={profiles} hasProfile={hasProfile} />
    </Suspense>
  );
}