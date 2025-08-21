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
          // Check if they have a sponsorship record - if not, create one
          // This handles the case where Make.com completed the profile before confirmation link was clicked
          if (!existingSponsor.sponsorship) {
            console.log('Existing complete sponsor has no sponsorship record - creating one');
            const sponsorshipCreated = await createSponsorshipForExistingSponsor(existingSponsor.id, existingSponsor.documentId);
            
            if (sponsorshipCreated) {
              // Re-fetch the sponsor with the new sponsorship relation
              const updatedSponsor = await checkExistingSponsor(email);
              return NextResponse.json({
                success: true,
                status: 'confirmed',
                message: 'Sponsorship request created successfully',
                data: updatedSponsor
              });
            } else {
              console.error('Failed to create sponsorship record for existing sponsor');
            }
          }
          
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
    
    console.log('Creating sponsorship with data:', JSON.stringify(sponsorshipData));
    console.log('Target sponsor ID:', sponsor.id, 'DocumentID:', sponsor.documentId);

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
      
      // Critical error - we have a sponsor without sponsorship, this breaks the flow
      // Try to delete the sponsor record to allow retry
      console.log('Attempting to delete sponsor record to maintain data consistency...');
      try {
        await fetch(`${STRAPI_URL}/api/sponsors/${sponsor.documentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${systemToken}`,
          },
        });
        console.log('Deleted incomplete sponsor record');
      } catch (deleteError) {
        console.error('Failed to delete incomplete sponsor record:', deleteError);
      }
      
      return null; // Return null to indicate failure
    }
    
    const sponsorshipResult = await sponsorshipResponse.json();
    console.log('Successfully created sponsorship record:', sponsorshipResult.data);
    
    // CRITICAL: Update the sponsor record to link back to the sponsorship (bidirectional relation)
    // This MUST happen for the relation to work properly in both directions
    console.log('Attempting to link sponsorship to sponsor...');
    console.log('Sponsorship ID:', sponsorshipResult.data.id);
    console.log('Sponsorship DocumentID:', sponsorshipResult.data.documentId);
    console.log('Sponsor DocumentID:', sponsor.documentId);
    
    // Try multiple approaches for setting the relation
    const relationApproaches = [
      { sponsorship: sponsorshipResult.data.id }, // Try with ID
      { sponsorship: { id: sponsorshipResult.data.id } }, // Try with object containing ID
      { sponsorship: sponsorshipResult.data.documentId }, // Try with documentId
      { sponsorship: { connect: [sponsorshipResult.data.id] } }, // Try Strapi v4 connect syntax
      { sponsorship: { set: [sponsorshipResult.data.id] } } // Try set syntax
    ];
    
    let updateSuccess = false;
    
    for (const approach of relationApproaches) {
      try {
        console.log('Trying relation approach:', JSON.stringify(approach));
        const updateSponsorResponse = await fetch(`${STRAPI_URL}/api/sponsors/${sponsor.documentId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${systemToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: approach
          }),
        });

        if (updateSponsorResponse.ok) {
          const updatedSponsor = await updateSponsorResponse.json();
          console.log('Successfully linked sponsorship back to sponsor with approach:', JSON.stringify(approach));
          console.log('Updated sponsor data:', JSON.stringify(updatedSponsor.data));
          
          // Verify the relation was established by fetching with population
          try {
            const verifyResponse = await fetch(`${STRAPI_URL}/api/sponsors/${sponsor.documentId}?populate=sponsorship`, {
              headers: {
                'Authorization': `Bearer ${systemToken}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (verifyResponse.ok) {
              const verifiedSponsor = await verifyResponse.json();
              console.log('Verification: Sponsor with populated sponsorship:', JSON.stringify(verifiedSponsor.data.sponsorship));
              updateSuccess = true;
              return verifiedSponsor.data;
            }
          } catch (verifyError) {
            console.log('Error verifying relation:', verifyError);
          }
          
          updateSuccess = true;
          // Return the updated sponsor with the sponsorship relation
          return updatedSponsor.data;
        } else {
          const updateError = await updateSponsorResponse.json();
          console.log('Failed with approach:', JSON.stringify(approach), 'Error:', updateError.error?.message);
        }
      } catch (attemptError) {
        console.log('Error with approach:', JSON.stringify(approach), attemptError);
      }
    }
    
    if (!updateSuccess) {
      console.error('Failed to link sponsorship back to sponsor with all approaches');
      // Still return the sponsor - at least the sponsorship exists
      return sponsor;
    }
  } catch (error) {
    console.error('Error creating minimal sponsor record:', error);
    return null;
  }
}

/**
 * Create sponsorship record for existing complete sponsor (Make.com edge case)
 */
async function createSponsorshipForExistingSponsor(sponsorId: number, sponsorDocumentId: string): Promise<boolean> {
  try {
    const systemToken = process.env.STRAPI_API_TOKEN;
    
    if (!systemToken) {
      console.error('STRAPI_API_TOKEN environment variable is missing');
      return false;
    }

    // Create the sponsorship record
    const sponsorshipData = {
      sponsorshipStatus: 'submitted',
      numberOfChildren: 1,
      sponsor: sponsorId
    };
    
    console.log('Creating sponsorship for existing sponsor:', { sponsorId, sponsorDocumentId });

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
      const errorData = await sponsorshipResponse.json();
      console.error('Failed to create sponsorship for existing sponsor:', errorData);
      return false;
    }

    const sponsorshipResult = await sponsorshipResponse.json();
    console.log('Created sponsorship for existing sponsor:', sponsorshipResult.data);
    
    // Update sponsor to link back to sponsorship (bidirectional relation)
    const relationApproaches = [
      { sponsorship: sponsorshipResult.data.id },
      { sponsorship: { id: sponsorshipResult.data.id } },
      { sponsorship: sponsorshipResult.data.documentId }
    ];
    
    for (const approach of relationApproaches) {
      try {
        console.log('Linking sponsorship to existing sponsor with approach:', JSON.stringify(approach));
        const updateResponse = await fetch(`${STRAPI_URL}/api/sponsors/${sponsorDocumentId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${systemToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: approach
          }),
        });

        if (updateResponse.ok) {
          console.log('Successfully linked sponsorship to existing sponsor');
          return true;
        } else {
          const updateError = await updateResponse.json();
          console.log('Failed linking approach:', JSON.stringify(approach), 'Error:', updateError.error?.message);
        }
      } catch (attemptError) {
        console.log('Error with linking approach:', JSON.stringify(approach), attemptError);
      }
    }
    
    console.log('All linking approaches failed, but sponsorship was created');
    return true; // Sponsorship exists even if relation failed
  } catch (error) {
    console.error('Error creating sponsorship for existing sponsor:', error);
    return false;
  }
}