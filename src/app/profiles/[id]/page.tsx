'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { STRAPI_URL, getStrapiImageUrl } from '@/lib/utils';
import { X, MapPin, User, CalendarDays, Loader2, ChevronLeft, ChevronRight, School, Footprints, Landmark, Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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

function ChildProfilePageContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const childId = params.id as string;

  useEffect(() => {
    async function loadChildProfile() {
      if (!user) {
        router.push('/login');
        return;
      }

      if (!user.sponsor) {
        setError('No sponsor profile found. Please complete your profile.');
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
        console.log('🔍 Loading child profile:', childId);
        
        // Fetch the specific child by ID
        const childResponse = await fetch(`${STRAPI_URL}/api/children/${childId}?populate[images]=true&populate[sponsor]=true`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!childResponse.ok) {
          if (childResponse.status === 404) {
            setError('Child not found');
          } else {
            setError('Failed to load child profile');
          }
          setLoading(false);
          return;
        }

        const childData = await childResponse.json();
        const childProfile = childData.data;

        console.log('👶 Child data:', childProfile);
        console.log('🔍 Child sponsor ID:', childProfile.sponsor?.id);
        console.log('🔍 Current user sponsor ID:', user.sponsor.id);

        // Verify this child belongs to the current user
        const childSponsorId = typeof childProfile.sponsor === 'object' && childProfile.sponsor !== null 
          ? childProfile.sponsor.id 
          : childProfile.sponsor;

        if (childSponsorId !== user.sponsor.id) {
          console.log('❌ Child does not belong to current user');
          setError('You do not have access to this child profile');
          setLoading(false);
          return;
        }

        console.log('✅ Child belongs to current user');
        setChild(childProfile);
        setError(null);
      } catch (err) {
        console.error('Error loading child profile:', err);
        setError('Failed to load child profile');
      } finally {
        setLoading(false);
      }
    }

    loadChildProfile();
  }, [childId, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading child profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/profiles')} className="mr-2">
            Back to Profiles
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👶</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Child Not Found</h3>
          <p className="text-gray-600 mb-4">The requested child profile could not be found.</p>
          <Button onClick={() => router.push('/profiles')}>
            Back to Profiles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Child Profile</h1>
            <p className="text-sm text-gray-600">Detailed information about your sponsored child</p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => router.push('/profiles')}
          >
            <X className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{child.fullName}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  Sponsored by {user?.sponsor?.firstName} {user?.sponsor?.lastName}
                </span>
                <span className="text-gray-600">Grade {child.currentGrade}</span>
                <span className="text-gray-600">{child.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-5">
          {/* Left column: media and quick facts */}
          <div className="md:col-span-2 space-y-4">
            <MiniCarousel images={child.images || []} alt={child.fullName} />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick facts</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{child.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>DOB: {formatDate(child.dateOfBirth)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  <span>School: {child.school}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Footprints className="h-4 w-4" />
                  <span>Walk: {child.walkToSchool}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{child.location}</span>
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
                    <CardTitle className="text-2xl font-semibold tracking-tight">{child.fullName}</CardTitle>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" /> 
                        Sponsor: {user?.sponsor?.firstName} {user?.sponsor?.lastName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div>Joined: {formatDate(child.joinedSponsorshipProgram)}</div>
                    <div>Age at joining: {child.ageAtJoining || "N/A"}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border p-3">
                    <div className="text-xs text-muted-foreground">Grade at joining</div>
                    <div className="font-medium">{child.gradeAtJoining || "N/A"}</div>
                  </div>
                  <div className="rounded-xl border p-3">
                    <div className="text-xs text-muted-foreground">Current grade</div>
                    <div className="font-medium">{child.currentGrade}</div>
                  </div>
                  <div className="rounded-xl border p-3">
                    <div className="text-xs text-muted-foreground">Aspiration</div>
                    <div className="font-medium">{child.aspiration}</div>
                  </div>
                </div>

                <Separator />

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold tracking-tight">About</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{child.about}</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold tracking-tight">Family</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{child.family}</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-sm font-semibold tracking-tight">Hobby</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{child.hobby}</p>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChildProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ChildProfilePageContent />
    </Suspense>
  );
}