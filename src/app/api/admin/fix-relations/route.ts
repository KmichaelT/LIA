import { NextRequest, NextResponse } from 'next/server';
import { STRAPI_URL } from '@/lib/utils';

interface OrphanedSponsorship {
  id: number;
  documentId: string;
  sponsorshipStatus: string;
  numberOfChildren: number;
  sponsor: {
    id: number;
    documentId: string;
    email: string;
  };
}

interface RelationRepairResult {
  totalChecked: number;
  orphanedFound: number;
  repairsAttempted: number;
  repairsSuccessful: number;
  repairsFailed: number;
  details: {
    sponsorshipId: number;
    sponsorEmail: string;
    success: boolean;
    error?: string;
  }[];
}

/**
 * Admin endpoint to find and repair broken bidirectional relations
 * GET /api/admin/fix-relations - Find orphaned sponsorships
 * POST /api/admin/fix-relations - Repair orphaned sponsorships
 */

export async function GET(request: NextRequest) {
  try {
    const systemToken = process.env.STRAPI_API_TOKEN;
    
    if (!systemToken) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get admin key from query params or headers for security
    const searchParams = request.nextUrl.searchParams;
    const adminKey = searchParams.get('key') || request.headers.get('X-Admin-Key');
    
    if (!adminKey || adminKey !== process.env.ADMIN_REPAIR_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin key' },
        { status: 401 }
      );
    }

    console.log('🔍 ADMIN: Starting orphaned sponsorship detection...');

    // Fetch all sponsorships with sponsor relations
    const sponsorshipsResponse = await fetch(
      `${STRAPI_URL}/api/sponsorships?populate=sponsor&pagination[pageSize]=100`,
      {
        headers: {
          'Authorization': `Bearer ${systemToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!sponsorshipsResponse.ok) {
      throw new Error('Failed to fetch sponsorships');
    }

    const sponsorshipsData = await sponsorshipsResponse.json();
    const sponsorships = sponsorshipsData.data || [];

    console.log(`🔍 Found ${sponsorships.length} sponsorships to check`);

    // Check each sponsorship for broken bidirectional relation
    const orphanedSponsorships: OrphanedSponsorship[] = [];

    for (const sponsorship of sponsorships) {
      if (sponsorship.sponsor && sponsorship.sponsor.documentId) {
        // Check if the sponsor has the bidirectional relation
        const sponsorResponse = await fetch(
          `${STRAPI_URL}/api/sponsors/${sponsorship.sponsor.documentId}?populate=sponsorship`,
          {
            headers: {
              'Authorization': `Bearer ${systemToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (sponsorResponse.ok) {
          const sponsorData = await sponsorResponse.json();
          const hasSponsorship = sponsorData.data.sponsorship && sponsorData.data.sponsorship.id;
          
          if (!hasSponsorship) {
            console.log(`🔍 Found orphaned sponsorship: ${sponsorship.id} -> sponsor: ${sponsorship.sponsor.email}`);
            orphanedSponsorships.push(sponsorship);
          }
        }
      }
    }

    console.log(`🔍 ADMIN: Found ${orphanedSponsorships.length} orphaned sponsorships`);

    return NextResponse.json({
      success: true,
      totalChecked: sponsorships.length,
      orphanedFound: orphanedSponsorships.length,
      orphanedSponsorships: orphanedSponsorships.map(s => ({
        sponsorshipId: s.id,
        sponsorshipDocumentId: s.documentId,
        sponsorId: s.sponsor.id,
        sponsorDocumentId: s.sponsor.documentId,
        sponsorEmail: s.sponsor.email,
        sponsorshipStatus: s.sponsorshipStatus,
        numberOfChildren: s.numberOfChildren
      }))
    });

  } catch (error) {
    console.error('🔍 ADMIN: Error detecting orphaned sponsorships:', error);
    return NextResponse.json(
      { error: 'Server error detecting orphaned sponsorships' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const systemToken = process.env.STRAPI_API_TOKEN;
    
    if (!systemToken) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get admin key from request body or headers for security
    const body = await request.json();
    const adminKey = body.adminKey || request.headers.get('X-Admin-Key');
    
    if (!adminKey || adminKey !== process.env.ADMIN_REPAIR_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin key' },
        { status: 401 }
      );
    }

    console.log('🔧 ADMIN: Starting orphaned sponsorship repair...');

    // First, detect orphaned sponsorships (reuse logic from GET)
    const sponsorshipsResponse = await fetch(
      `${STRAPI_URL}/api/sponsorships?populate=sponsor&pagination[pageSize]=100`,
      {
        headers: {
          'Authorization': `Bearer ${systemToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!sponsorshipsResponse.ok) {
      throw new Error('Failed to fetch sponsorships');
    }

    const sponsorshipsData = await sponsorshipsResponse.json();
    const sponsorships = sponsorshipsData.data || [];
    const orphanedSponsorships: OrphanedSponsorship[] = [];

    // Detect orphaned sponsorships
    for (const sponsorship of sponsorships) {
      if (sponsorship.sponsor && sponsorship.sponsor.documentId) {
        const sponsorResponse = await fetch(
          `${STRAPI_URL}/api/sponsors/${sponsorship.sponsor.documentId}?populate=sponsorship`,
          {
            headers: {
              'Authorization': `Bearer ${systemToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (sponsorResponse.ok) {
          const sponsorData = await sponsorResponse.json();
          const hasSponsorship = sponsorData.data.sponsorship && sponsorData.data.sponsorship.id;
          
          if (!hasSponsorship) {
            orphanedSponsorships.push(sponsorship);
          }
        }
      }
    }

    console.log(`🔧 ADMIN: Found ${orphanedSponsorships.length} orphaned sponsorships to repair`);

    // Repair each orphaned sponsorship
    const repairResult: RelationRepairResult = {
      totalChecked: sponsorships.length,
      orphanedFound: orphanedSponsorships.length,
      repairsAttempted: 0,
      repairsSuccessful: 0,
      repairsFailed: 0,
      details: []
    };

    for (const sponsorship of orphanedSponsorships) {
      repairResult.repairsAttempted++;
      
      console.log(`🔧 ADMIN: Repairing sponsorship ${sponsorship.id} -> sponsor ${sponsorship.sponsor.email}`);

      // Extended relation approaches for maximum compatibility
      const relationApproaches = [
        { sponsorship: sponsorship.id },
        { sponsorship: { id: sponsorship.id } },
        { sponsorship: sponsorship.documentId },
        { sponsorship: { connect: [sponsorship.id] } },
        { sponsorship: { set: [sponsorship.id] } },
        { sponsorship: { connect: [{ id: sponsorship.id }] } },
        { sponsorship: { connect: [sponsorship.documentId] } },
        { sponsorship: [sponsorship.id] },
        { sponsorship: [{ id: sponsorship.id }] },
        { sponsorship: { documentId: sponsorship.documentId } },
      ];

      let repairSuccess = false;
      let lastError = null;

      for (let i = 0; i < relationApproaches.length; i++) {
        const approach = relationApproaches[i];
        try {
          console.log(`🔧 ADMIN: Trying approach ${i + 1}/${relationApproaches.length}:`, JSON.stringify(approach));
          
          const updateResponse = await fetch(`${STRAPI_URL}/api/sponsors/${sponsorship.sponsor.documentId}`, {
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
            // Verify the repair worked
            const verifyResponse = await fetch(
              `${STRAPI_URL}/api/sponsors/${sponsorship.sponsor.documentId}?populate=sponsorship`,
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
              
              if (hasSponsorship) {
                console.log(`🔧 ADMIN: Successfully repaired sponsorship ${sponsorship.id}`);
                repairSuccess = true;
                repairResult.repairsSuccessful++;
                repairResult.details.push({
                  sponsorshipId: sponsorship.id,
                  sponsorEmail: sponsorship.sponsor.email,
                  success: true
                });
                break;
              }
            }
          } else {
            const errorData = await updateResponse.json();
            lastError = errorData;
          }
        } catch (error) {
          lastError = error;
        }
      }

      if (!repairSuccess) {
        console.log(`🔧 ADMIN: Failed to repair sponsorship ${sponsorship.id}:`, lastError);
        repairResult.repairsFailed++;
        repairResult.details.push({
          sponsorshipId: sponsorship.id,
          sponsorEmail: sponsorship.sponsor.email,
          success: false,
          error: lastError ? JSON.stringify(lastError) : 'Unknown error'
        });
      }
    }

    console.log(`🔧 ADMIN: Repair complete. Success: ${repairResult.repairsSuccessful}, Failed: ${repairResult.repairsFailed}`);

    return NextResponse.json({
      success: true,
      message: 'Relation repair completed',
      result: repairResult
    });

  } catch (error) {
    console.error('🔧 ADMIN: Error repairing orphaned sponsorships:', error);
    return NextResponse.json(
      { error: 'Server error repairing orphaned sponsorships' },
      { status: 500 }
    );
  }
}