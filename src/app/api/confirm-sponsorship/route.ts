import { NextRequest, NextResponse } from 'next/server';
import { STRAPI_URL } from '@/lib/utils';

// Simple token validation (in production, use more secure tokens)
const VALID_TOKENS = ['SPONSOR_CONFIRM_2024', 'ZEFFY_VERIFY_TOKEN', 'MySecureToken2025'];

interface Sponsor {
  id: number;
  documentId: string;
  email: string;
  sponsorshipStatus: string;
  profileComplete: boolean;
  firstName?: string;
  lastName?: string;
  children?: {
    id: number;
    fullName: string;
    [key: string]: unknown;
  }[];
  assignedChild?: {
    id: number;
    fullName: string;
  } | null;
}

/**
 * API endpoint to confirm sponsorship from Zeffy email
 * GET /api/confirm-sponsorship?email=user@example.com&token=VERIFY_TOKEN
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    // Validate parameters
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Invalid link - missing email or token' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate token (basic security)
    if (!VALID_TOKENS.includes(token)) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if sponsor already exists
    const existingSponsor = await checkExistingSponsor(email);

    if (existingSponsor) {
      // Sponsor already exists
      if (existingSponsor.profileComplete) {
        // Profile is complete
        if (existingSponsor.assignedChild) {
          // They have an assigned child
          return NextResponse.json({
            success: true,
            status: 'existing-sponsor',
            message: 'You already have an assigned child',
            data: existingSponsor
          });
        } else {
          // Profile complete but no child assigned yet
          return NextResponse.json({
            success: true,
            status: 'profile-complete',
            message: 'Your profile is complete and under review',
            data: existingSponsor
          });
        }
      } else {
        // Profile incomplete - leave for Make.com to complete
        return NextResponse.json({
          success: true,
          status: 'profile-pending',
          message: 'Your profile is being processed',
          data: existingSponsor
        });
      }
    }

    // Create new minimal sponsor record
    const newSponsor = await createMinimalSponsor(email);

    if (newSponsor) {
      // Successfully created
      return NextResponse.json({
        success: true,
        status: 'confirmed',
        message: 'Sponsorship request created successfully',
        data: newSponsor
      });
    } else {
      // Failed to create
      return NextResponse.json(
        { error: 'Failed to create sponsor record' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in confirm-sponsorship API:', error);
    return NextResponse.json(
      { error: 'Server error processing request' },
      { status: 500 }
    );
  }
}

/**
 * Check if sponsor already exists for email
 */
async function checkExistingSponsor(email: string): Promise<Sponsor | null> {
  try {
    const systemToken = process.env.STRAPI_API_TOKEN;
    
    if (!systemToken) {
      console.error('STRAPI_API_TOKEN environment variable is missing. Please add it to .env.local');
      return null;
    }

    const response = await fetch(
      `${STRAPI_URL}/api/sponsors?filters[email][$eq]=${email}&populate[children]=true&populate[sponsorship]=true`,
      {
        headers: {
          'Authorization': `Bearer ${systemToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404 || response.status === 400) {
        // Content type doesn't exist yet - this is ok
        return null;
      }
      throw new Error('Failed to fetch sponsors');
    }

    const data = await response.json();
    const sponsors = data.data || [];
    
    if (sponsors.length > 0) {
      const sponsor = sponsors[0];
      // Map children array to assignedChild for backward compatibility
      if (sponsor.children && sponsor.children.length > 0) {
        sponsor.assignedChild = sponsor.children[0];
      }
      return sponsor;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking existing sponsor:', error);
    return null;
  }
}

/**
 * Create minimal sponsor record with sponsorship entry
 */
async function createMinimalSponsor(email: string): Promise<Sponsor | null> {
  try {
    const systemToken = process.env.STRAPI_API_TOKEN;
    
    if (!systemToken) {
      console.error('STRAPI_API_TOKEN environment variable is missing. Please add it to .env.local');
      return null;
    }

    // First create the sponsor record
    const sponsorData = {
      email: email,
      profileComplete: false,
      firstName: '', // Will be updated by Make.com
      lastName: '' // Will be updated by Make.com
    };

    const sponsorResponse = await fetch(`${STRAPI_URL}/api/sponsors`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: sponsorData
      }),
    });

    if (!sponsorResponse.ok) {
      const errorData = await sponsorResponse.json();
      console.error('Failed to create sponsor record:', errorData);
      return null;
    }

    const sponsorResult = await sponsorResponse.json();
    const sponsor = sponsorResult.data;

    // Now create the sponsorship record linked to this sponsor
    const sponsorshipData = {
      sponsorshipStatus: 'submitted',
      numberOfChildren: 1, // Default to 1 child request
      sponsor: sponsor.id // Link to the sponsor we just created
    };

    const sponsorshipResponse = await fetch(`${STRAPI_URL}/api/sponsorships`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: sponsorshipData
      }),
    });

    if (!sponsorshipResponse.ok) {
      const sponsorshipErrorData = await sponsorshipResponse.json();
      console.error('Failed to create sponsorship record:', sponsorshipErrorData);
      // Continue anyway - sponsor was created successfully
    } else {
      const sponsorshipResult = await sponsorshipResponse.json();
      console.log('Successfully created both sponsor and sponsorship records');
      console.log('Sponsorship data:', sponsorshipResult.data);
      
      // Now update the sponsor record to link back to the sponsorship (bidirectional relation)
      try {
        const updateSponsorResponse = await fetch(`${STRAPI_URL}/api/sponsors/${sponsor.documentId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${systemToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              sponsorship: sponsorshipResult.data.documentId
            }
          }),
        });

        if (updateSponsorResponse.ok) {
          console.log('Successfully linked sponsorship back to sponsor');
        } else {
          const updateError = await updateSponsorResponse.json();
          console.error('Failed to link sponsorship back to sponsor:', updateError);
        }
      } catch (linkError) {
        console.error('Error linking sponsorship to sponsor:', linkError);
      }
    }

    return sponsor;
  } catch (error) {
    console.error('Error creating minimal sponsor record:', error);
    return null;
  }
}