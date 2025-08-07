'use client';

import React, { Suspense } from "react";
import ProfilesClient from "./ProfilesClient";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

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

async function getChildrenProfiles(token: string): Promise<ChildProfile[]> {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://best-desire-8443ae2768.strapiapp.com';
    const response = await fetch(`${STRAPI_URL}/api/children?pagination[pageSize]=200`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch children profiles');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching children profiles:', error);
    return [];
  }
}

function ProfilesPageContent() {
  const { user } = useAuth();
  const [childProfiles, setChildProfiles] = React.useState<ChildProfile[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      const token = localStorage.getItem('jwt');
      if (token) {
        getChildrenProfiles(token)
          .then(setChildProfiles)
          .finally(() => setLoading(false));
      }
    }
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading children profiles...</p>
        </div>
      </main>
    );
  }

  return <ProfilesClient profiles={childProfiles} />;
}

export default function ProfilesPage() {
  return (
    <ProtectedRoute>
      <ProfilesPageContent />
    </ProtectedRoute>
  );
}