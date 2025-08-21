import { NextRequest, NextResponse } from 'next/server';
import { STRAPI_URL } from '@/lib/utils';

interface UpdateSponsorshipRequest {
  sponsorId: number;
  numberOfChildren: number;
  sponsorEmail: string;
}

/**
 * API endpoint to update sponsorship request for additional children
 * POST /api/update-sponsorship
 */
export async function POST(request: NextRequest) {
  try {
    const { sponsorId, numberOfChildren, sponsorEmail }: UpdateSponsorshipRequest = await request.json();

    // Validate input
    if (!sponsorId || !numberOfChildren || !sponsorEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: sponsorId, numberOfChildren, or sponsorEmail' },
        { status: 400 }
      );
    }

    if (numberOfChildren < 1 || numberOfChildren > 10) {
      return NextResponse.json(
        { error: 'Number of children must be between 1 and 10' },
        { status: 400 }
      );
    }

    const systemToken = process.env.STRAPI_API_TOKEN;
    
    if (!systemToken) {
      console.error('STRAPI_API_TOKEN environment variable is missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Find existing sponsorship record for this sponsor
    let existingSponsorship = await findSponsorshipBySponsore(sponsorId, systemToken);

    if (!existingSponsorship) {
      console.log('No existing sponsorship found, creating new one for sponsor:', sponsorId);
      
      // Create a new sponsorship record if none exists
      existingSponsorship = await createSponsorshipRecord(sponsorId, systemToken);
      
      if (!existingSponsorship) {
        return NextResponse.json(
          { error: 'Failed to create or find sponsorship record' },
          { status: 500 }
        );
      }
    }

    // Update the sponsorship record
    const updateData = {
      sponsorshipStatus: 'submitted',
      numberOfChildren: numberOfChildren
    };

    const response = await fetch(`${STRAPI_URL}/api/sponsorships/${existingSponsorship.documentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: updateData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to update sponsorship record:', errorData);
      return NextResponse.json(
        { error: 'Failed to update sponsorship request' },
        { status: 500 }
      );
    }

    const result = await response.json();
    console.log('Successfully updated sponsorship:', result.data);
    
    return NextResponse.json({
      success: true,
      message: `Successfully updated sponsorship request for ${numberOfChildren} children`,
      data: result.data
    });

  } catch (error) {
    console.error('Error in update-sponsorship API:', error);
    return NextResponse.json(
      { error: 'Server error processing request' },
      { status: 500 }
    );
  }
}

/**
 * Find existing sponsorship record by sponsor ID
 */
async function findSponsorshipBySponsore(sponsorId: number, token: string) {
  try {
    // Find sponsorship by sponsor relation
    const response = await fetch(
      `${STRAPI_URL}/api/sponsorships?filters[sponsor][id][$eq]=${sponsorId}&populate=sponsor`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch sponsorship records');
      return null;
    }

    const data = await response.json();
    const sponsorships = data.data || [];
    
    console.log('Found sponsorships:', sponsorships.length);
    console.log('Looking for sponsor ID:', sponsorId);
    
    if (sponsorships.length > 0) {
      console.log('Found matching sponsorship:', sponsorships[0]);
      console.log('Sponsorship sponsor field:', sponsorships[0].sponsor);
      return sponsorships[0];
    }
    
    console.log('No matching sponsorship found for sponsor ID:', sponsorId);
    return null;
  } catch (error) {
    console.error('Error finding sponsorship by sponsor:', error);
    return null;
  }
}

/**
 * Create a new sponsorship record for sponsor
 */
async function createSponsorshipRecord(sponsorId: number, token: string) {
  try {
    const sponsorshipData = {
      sponsorshipStatus: 'submitted',
      numberOfChildren: 1,
      sponsor: sponsorId
    };

    const response = await fetch(`${STRAPI_URL}/api/sponsorships`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: sponsorshipData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create sponsorship record:', errorData);
      return null;
    }

    const result = await response.json();
    console.log('Successfully created new sponsorship record:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error creating sponsorship record:', error);
    return null;
  }
}