import { NextRequest, NextResponse } from 'next/server';
import { STRAPI_URL } from '@/lib/utils';

// Simple token validation (in production, use more secure tokens)
const VALID_TOKENS = ['SPONSOR_CONFIRM_2024', 'ZEFFY_VERIFY_TOKEN'];

interface SponsorshipRequest {
  id: number;
  documentId: string;
  email: string;
  requestStatus: string;
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

    // Check if sponsorship request already exists
    const existingRequest = await checkExistingSponsorshipRequest(email);

    if (existingRequest) {
      // User already has a sponsorship request
      if (existingRequest.assignedChild) {
        // They have an assigned child
        return NextResponse.json({
          success: true,
          status: 'existing-sponsor',
          message: 'You already have an assigned child',
          data: existingRequest
        });
      } else {
        // They have a pending request
        const currentStatus = existingRequest.requestStatus || 'pending';
        return NextResponse.json({
          success: true,
          status: `existing-${currentStatus}`,
          message: 'You already have a sponsorship request',
          data: existingRequest
        });
      }
    }

    // Create new minimal sponsorship request
    const newRequest = await createMinimalSponsorshipRequest(email);

    if (newRequest) {
      // Successfully created
      return NextResponse.json({
        success: true,
        status: 'confirmed',
        message: 'Sponsorship request created successfully',
        data: newRequest
      });
    } else {
      // Failed to create
      return NextResponse.json(
        { error: 'Failed to create sponsorship request' },
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
 * Check if sponsorship request already exists for email
 */
async function checkExistingSponsorshipRequest(email: string): Promise<SponsorshipRequest | null> {
  try {
    // Get a system token for API calls (you might need to implement this based on your Strapi setup)
    const systemToken = process.env.STRAPI_API_TOKEN;
    
    if (!systemToken) {
      console.error('STRAPI_API_TOKEN environment variable is missing. Please add it to .env.local');
      return null;
    }

    const response = await fetch(
      `${STRAPI_URL}/api/sponsorship-requests?filters[email][$eq]=${email}`,
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
      throw new Error('Failed to fetch sponsorship requests');
    }

    const data = await response.json();
    const requests = data.data || [];
    
    return requests.length > 0 ? requests[0] : null;
  } catch (error) {
    console.error('Error checking existing sponsorship request:', error);
    return null;
  }
}

/**
 * Create minimal sponsorship request with just email and submitted status
 */
async function createMinimalSponsorshipRequest(email: string): Promise<SponsorshipRequest | null> {
  try {
    // Get a system token for API calls
    const systemToken = process.env.STRAPI_API_TOKEN;
    
    if (!systemToken) {
      console.error('STRAPI_API_TOKEN environment variable is missing. Please add it to .env.local');
      return null;
    }

    const requestData = {
      email: email,
      firstName: 'Pending', // Will be updated by Make.com
      lastName: 'Confirmation', // Will be updated by Make.com
      phone: '',
      address: '',
      city: '',
      country: '',
      motivation: 'Email confirmation from Zeffy - details to be updated via automation',
      requestStatus: 'submitted', // Using requestStatus instead of status
      submittedAt: new Date().toISOString()
    };

    const response = await fetch(`${STRAPI_URL}/api/sponsorship-requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: requestData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create sponsorship request:', errorData);
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating minimal sponsorship request:', error);
    return null;
  }
}