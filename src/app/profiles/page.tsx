"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import childProfiles from "./lia-children-profiles-with-sponsors.json";
import { Search, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/carousel";
import Image from "next/image";

interface ChildProfile {
  id: string;
  fullName: string;
  sponsor: string | null;
  dateOfBirth: string;
  joinedSponsorshipProgram: string;
  ageAtJoining: number | null;
  gradeAtJoining: string | null;
  currentGrade: string;
  school: string;
  walkToSchool: string;
  family: string;
  location: string;
  aspiration: string;
  hobby: string;
  about: string;
}

interface ProfileImagesState {
  [key: string]: string[];
}

export default function ProfilesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImages, setProfileImages] = useState<ProfileImagesState>({});
  const [loadingImages, setLoadingImages] = useState(false);

  // Function to check if an image exists
  const checkImageExists = async (imagePath: string): Promise<boolean> => {
    try {
      const res = await fetch(imagePath, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  };

  // Function to fetch all image paths for a profile
  const getProfileImages = async (profileName: string) => {
    if (profileImages[profileName]?.length > 0 || loadingImages) {
      return profileImages[profileName] || [];
    }

    setLoadingImages(true);
    const folderName = profileName.toLowerCase().replace(/\s+/g, "_");
    const existingImages: string[] = [];
    
    // Check images sequentially until we find one that doesn't exist
    for (let i = 1; i <= 8; i++) {
      const imagePath = `/images/sponsee_pictures/${folderName}/img${i}.jpg`;
      const exists = await checkImageExists(imagePath);
      if (exists) {
        existingImages.push(imagePath);
      } else {
        break; // Stop checking once we find a missing image
      }
    }

    setProfileImages(prev => ({
      ...prev,
      [profileName]: existingImages
    }));
    setLoadingImages(false);
    return existingImages;
  };

  // Load images when a profile is selected
  useEffect(() => {
    if (selectedProfile) {
      getProfileImages(selectedProfile.fullName);
    }
  }, [selectedProfile]);

  // Filter profiles based on search term
  const filteredProfiles = searchTerm
    ? (childProfiles as ChildProfile[]).filter(
        (profile) =>
          profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (profile.sponsor?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      )
    : [];

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
              <Search className="absolute right-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchTerm && (
              <div
                id="search-suggestions"
                role="listbox"
                className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile) => (
                    <button
                      key={profile.id}
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
                  <p className="text-muted-foreground">Sponsor: {selectedProfile.sponsor || "Not Assigned"}</p>
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
              {selectedProfile && (
                <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full h-full"
                  >
                    <CarouselContent>
                      {profileImages[selectedProfile.fullName]?.map((imagePath, index) => (
                        <CarouselItem key={index} className="relative aspect-square">
                          <Image
                            src={imagePath}
                            alt={`${selectedProfile.fullName} - Photo ${index + 1}`}
                            fill
                            className="object-contain"
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => {
                              // Remove this image from the state if it fails to load
                              setProfileImages(prev => ({
                                ...prev,
                                [selectedProfile.fullName]: prev[selectedProfile.fullName].filter(path => path !== imagePath)
                              }));
                            }}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                      <CarouselPrevious className="relative inline-flex h-8 w-8" />
                      <CarouselNext className="relative inline-flex h-8 w-8" />
                    </div>
                  </Carousel>
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
                      <dt className="text-sm text-muted-foreground">Grade at Joining</dt>
                      <dd>{selectedProfile.gradeAtJoining || "N/A"}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold mb-2">About</h3>
                <p >{selectedProfile.about}</p>
              </div>

              <div className="grid gap-4 ">
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
                  <dl className="space-y-3">
                      <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <dt className="text-sm text-muted-foreground">Aspiration</dt>
                      <dd>{selectedProfile.aspiration}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Hobby</dt>
                      <dd className="text-base" >{selectedProfile.hobby}</dd>
                    </div>
                      </div>

                  </dl>
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