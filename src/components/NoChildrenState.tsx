'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Heart, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getSponsorshipRequests, createSponsorshipRequest, getAvailableChildrenCount, SponsorshipRequest } from '@/lib/sponsorshipRequests';
import SponsorshipStatusTimeline from './SponsorshipStatusTimeline';

interface NoChildrenStateProps {
  hasProfile: boolean;
}

export default function NoChildrenState({ hasProfile }: NoChildrenStateProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [sponsorshipRequests, setSponsorshipRequests] = useState<SponsorshipRequest[]>([]);
  const [availableChildrenCount, setAvailableChildrenCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user?.sponsor) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('jwt');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Temporarily disable sponsorship requests since the content type doesn't exist
        const availableCount = await getAvailableChildrenCount(token);
        
        setSponsorshipRequests([]); // Temporarily empty
        setAvailableChildrenCount(availableCount);
      } catch (err) {
        console.error('Error loading sponsorship data:', err);
        setError('Failed to load sponsorship information');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const handleSponsorChild = async () => {
    if (!user?.sponsor) {
      window.location.href = '/complete-profile';
      return;
    }

    const token = localStorage.getItem('jwt');
    if (!token) {
      setError('Authentication required');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      // Create a pending sponsorship request
      const requestData = {
        firstName: user.sponsor.firstName,
        lastName: user.sponsor.lastName,
        email: user.sponsor.email,
        phone: user.sponsor.phone,
        address: user.sponsor.address,
        city: user.sponsor.city,
        country: user.sponsor.country,
        monthlyContribution: 25, // Default amount
        motivation: 'Submitted from sponsor dashboard',
        status: 'pending' as const
      };

      const newRequest = await createSponsorshipRequest(requestData, token);
      
      if (newRequest) {
        // Add to local state
        setSponsorshipRequests(prev => [newRequest, ...prev]);
        
        // Redirect to complete profile/sponsorship form
        window.location.href = '/complete-profile?flow=sponsorship';
      }
    } catch (err) {
      console.error('Error creating sponsorship request:', err);
      setError(err instanceof Error ? err.message : 'Failed to create sponsorship request');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-600">Loading sponsorship information...</p>
      </div>
    );
  }

  // No profile scenario
  if (!hasProfile) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Profile First</h3>
          <p className="text-gray-600 mb-6">
            Please complete your sponsor profile before viewing your sponsored children.
          </p>
          <Button
            onClick={() => window.location.href = '/complete-profile'}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }

  // Has active sponsorship requests
  if (sponsorshipRequests.length > 0) {
    const latestRequest = sponsorshipRequests[0];
    
    return (
      <div  >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your Sponsorship Request</h3>
          <p className="text-gray-600">
            We're working on matching you with a child. Here's your current status:
          </p>
        </div>

        <SponsorshipStatusTimeline request={latestRequest} />

        {/* Show option to sponsor another child if available */}
        {availableChildrenCount > 0 && (
          <div className="mt-8 text-center">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Sponsor Another Child?</h4>
              <p className="text-blue-800 mb-4">
                There are {availableChildrenCount} children still waiting for sponsors.
              </p>
              <Button
                onClick={handleSponsorChild}
                disabled={creating}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Sponsor Another Child
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
    );
  }

  // No sponsorship requests exist
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">💝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Child Assigned Yet</h3>
        <p className="text-gray-600 mb-6">
          No child is assigned to you yet. Ready to make a difference in a child's life?
        </p>

        {availableChildrenCount > 0 ? (
          <>
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>{availableChildrenCount}</strong> children are currently waiting for sponsors like you.
              </p>
            </div>
            
            <Button
              onClick={handleSponsorChild}
              disabled={creating}
              className="bg-primary text-white hover:bg-primary/90"
              size="lg"
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Starting Your Journey...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  Sponsor a Child
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                All children are currently sponsored. We'll notify you when new children join our program.
              </p>
            </div>
            
            <Button
              onClick={() => window.location.href = 'mailto:support@loveinaction.co?subject=Interest in Sponsorship'}
              variant="outline"
              className="border-gray-300"
            >
              Contact Us for Updates
            </Button>
          </>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}