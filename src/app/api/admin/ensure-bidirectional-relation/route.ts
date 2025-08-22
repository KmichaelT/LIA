import { NextRequest, NextResponse } from 'next/server';
import { STRAPI_URL } from '@/lib/utils';

/**
 * Admin endpoint to ensure bidirectional relations are properly set
 * This is a workaround for Strapi v5 admin panel visibility issues
 * 
 * POST /api/admin/ensure-bidirectional-relation
 * Body: { sponsorshipId: number, sponsorId: number }
 */
export async function POST(request: NextRequest) {
  try {
    const systemToken = process.env.STRAPI_API_TOKEN;
    
    if (!systemToken) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { sponsorshipId, sponsorId } = await request.json();

    if (!sponsorshipId || !sponsorId) {
      return NextResponse.json(
        { error: 'Missing sponsorshipId or sponsorId' },
        { status: 400 }
      );
    }

    console.log('🔗 ENSURE: Ensuring bidirectional relation for sponsorship:', sponsorshipId, 'sponsor:', sponsorId);

    // Step 1: Get both entities with their documentIds
    const [sponsorshipResponse, sponsorResponse] = await Promise.all([
      fetch(`${STRAPI_URL}/api/sponsorships/${sponsorshipId}`, {
        headers: {
          'Authorization': `Bearer ${systemToken}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${STRAPI_URL}/api/sponsors?filters[id][$eq]=${sponsorId}`, {
        headers: {
          'Authorization': `Bearer ${systemToken}`,
          'Content-Type': 'application/json',
        },
      })
    ]);

    if (!sponsorshipResponse.ok || !sponsorResponse.ok) {
      throw new Error('Failed to fetch entities');
    }

    const sponsorshipData = await sponsorshipResponse.json();
    const sponsorData = await sponsorResponse.json();
    
    const sponsorship = sponsorshipData.data;
    const sponsor = sponsorData.data?.[0];

    if (!sponsorship || !sponsor) {
      return NextResponse.json(
        { error: 'Sponsorship or sponsor not found' },
        { status: 404 }
      );
    }

    console.log('🔗 ENSURE: Found sponsorship documentId:', sponsorship.documentId);
    console.log('🔗 ENSURE: Found sponsor documentId:', sponsor.documentId);

    // Step 2: Update BOTH sides of the relation explicitly
    // Update sponsorship to point to sponsor
    const updateSponsorshipPromise = fetch(`${STRAPI_URL}/api/sponsorships/${sponsorship.documentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          sponsor: sponsor.documentId // Use documentId for admin panel visibility
        }
      }),
    });

    // Update sponsor to point to sponsorship
    const updateSponsorPromise = fetch(`${STRAPI_URL}/api/sponsors/${sponsor.documentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${systemToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          sponsorship: sponsorship.documentId // Use documentId for admin panel visibility
        }
      }),
    });

    // Execute both updates in parallel
    const [updateSponsorshipResult, updateSponsorResult] = await Promise.all([
      updateSponsorshipPromise,
      updateSponsorPromise
    ]);

    if (!updateSponsorshipResult.ok || !updateSponsorResult.ok) {
      console.log('🔗 ENSURE: Failed to update relations');
      return NextResponse.json(
        { error: 'Failed to update bidirectional relations' },
        { status: 500 }
      );
    }

    // Step 3: Verify both relations are set
    const verifyResponse = await fetch(
      `${STRAPI_URL}/api/sponsors/${sponsor.documentId}?populate=sponsorship`,
      {
        headers: {
          'Authorization': `Bearer ${systemToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (verifyResponse.ok) {
      const verifiedData = await verifyResponse.json();
      const hasSponsorship = verifiedData.data.sponsorship && verifiedData.data.sponsorship.id;
      
      console.log('🔗 ENSURE: Verification result - sponsor has sponsorship?', hasSponsorship);
      
      return NextResponse.json({
        success: true,
        message: 'Bidirectional relation ensured',
        verified: hasSponsorship,
        sponsorshipDocumentId: sponsorship.documentId,
        sponsorDocumentId: sponsor.documentId
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Relations updated but verification failed',
      sponsorshipDocumentId: sponsorship.documentId,
      sponsorDocumentId: sponsor.documentId
    });

  } catch (error) {
    console.error('🔗 ENSURE: Error ensuring bidirectional relation:', error);
    return NextResponse.json(
      { error: 'Server error ensuring bidirectional relation' },
      { status: 500 }
    );
  }
}