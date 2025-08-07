"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { STRAPI_URL, getStrapiImageUrl } from '@/lib/utils';
import { Search, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/carousel";
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
  sponsor: string | null;
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
}

export default function ProfilesClient({ profiles: initialProfiles }: ProfilesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImages, setProfileImages] = useState<StrapiImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [searchResults, setSearchResults] = useState<ChildProfile[]>([]);
  const [searching, setSearching] = useState(false);

  // Function to search Strapi database
  const searchProfiles = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      // Use Strapi's filters to search in multiple fields
      const searchParams = new URLSearchParams({
        'pagination[pageSize]': '50',
        'filters[$or][0][fullName][$containsi]': term,
        'filters[$or][1][sponsor][$containsi]': term,
        'filters[$or][2][about][$containsi]': term,
        'filters[$or][3][aspiration][$containsi]': term,
        'filters[$or][4][hobby][$containsi]': term,
        'filters[$or][5][location][$containsi]': term,
        'filters[$or][6][school][$containsi]': term,
      });

      const response = await fetch(`${STRAPI_URL}/api/children?${searchParams}`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data || []);
        setError(null);
      } else {
        console.error('Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching profiles:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
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
          
          // Update the selected profile with fresh data
          const updatedProfile = { ...data.data };
          setSelectedProfile(updatedProfile);
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
  }, [selectedProfile?.documentId]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchProfiles(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Use search results if searching, otherwise empty array
  const filteredProfiles = searchResults;

  // Close suggestions when clicking outside
  const handleClickOutside = () => {
    setShowSuggestions(false);
  };

  return (
    <main className="min-h-screen flex items-center py-12" onClick={handleClickOutside}>
      <div className="container">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Child Profiles</h1>
            <p className="text-muted-foreground">
              Find and learn about the children you are sponsoring.
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center justify-between">
              <p>{error}</p>
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Search Input with Suggestions */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                  setError(null);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by child or sponsor name..."
                className="w-full px-4 py-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                aria-label="Search profiles"
                aria-expanded={showSuggestions}
                role="combobox"
                aria-controls="search-suggestions"
                aria-autocomplete="list"
              />
              {searching ? (
                <div className="absolute right-3 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
              ) : (
                <Search className="absolute right-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchTerm && (
              <div
                id="search-suggestions"
                role="listbox"
                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {searching ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                      Searching...
                    </div>
                  </div>
                ) : filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile) => (
                    <button
                      key={profile.documentId}
                      role="option"
                      className="w-full px-4 py-2 text-left hover:bg-secondary/10 focus:outline-none focus:bg-secondary/10"
                      onClick={() => {
                        setSelectedProfile(profile);
                        setSearchTerm("");
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="font-medium">{profile.fullName}</div>
                      {profile.sponsor && (
                        <div className="text-sm text-muted-foreground">
                          Sponsor: {profile.sponsor}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    No profiles found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Profile Card */}
          {selectedProfile && (
            <div className="border rounded-lg p-6 space-y-6 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProfile.fullName}</h2>
                  <p className="text-muted-foreground">
                    Sponsor: {selectedProfile.sponsor || "Not Assigned"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => setSelectedProfile(null)}
                >
                  Close
                </Button>
              </div>

              {/* Image Carousel */}
              {loadingImages ? (
                <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p>Loading images...</p>
                  </div>
                </div>
              ) : profileImages && profileImages.length > 0 ? (
                <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full h-full"
                  >
                    <CarouselContent>
                      {profileImages.map((image, index) => (
                        <CarouselItem key={image.id} className="relative aspect-square">
                          <Image
                            src={getStrapiImageUrl(image.url)}
                            alt={image.alternativeText || `${selectedProfile.fullName} - Photo ${index + 1}`}
                            fill
                            className="object-contain"
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {profileImages.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                        <CarouselPrevious className="relative inline-flex h-8 w-8" />
                        <CarouselNext className="relative inline-flex h-8 w-8" />
                      </div>
                    )}
                  </Carousel>
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {profileImages.length} photo(s)
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="text-4xl mb-2">📷</div>
                    <p>No photos available</p>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-bold mb-2">Personal Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-muted-foreground">Date of Birth</dt>
                      <dd>{selectedProfile.dateOfBirth}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Current Grade</dt>
                      <dd>{selectedProfile.currentGrade}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">School</dt>
                      <dd>{selectedProfile.school}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Walk to School</dt>
                      <dd>{selectedProfile.walkToSchool}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Sponsorship Details</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-muted-foreground">Sponsor</dt>
                      <dd>{selectedProfile.sponsor || "Not sponsored"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Joined Program</dt>
                      <dd>{selectedProfile.joinedSponsorshipProgram}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Age at Joining</dt>
                      <dd>{selectedProfile.ageAtJoining || "N/A"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Grade at Joining</dt>
                      <dd>{selectedProfile.gradeAtJoining || "N/A"}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold mb-2">About</h3>
                <p>{selectedProfile.about}</p>
              </div>

              <div className="grid gap-4">
                <div>
                  <h3 className="font-bold mb-2">Additional Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-muted-foreground">Location</dt>
                      <dd>{selectedProfile.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Family</dt>
                      <dd>{selectedProfile.family}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Dreams & Interests</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <dt className="text-sm text-muted-foreground">Aspiration</dt>
                      <dd>{selectedProfile.aspiration}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Hobby</dt>
                      <dd className="text-base">{selectedProfile.hobby}</dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedProfile && !searchTerm && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Search for a child or sponsor above to view their profile</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}