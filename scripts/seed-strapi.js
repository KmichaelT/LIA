const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || ''; // You'll need to set this

// Read the JSON data
const dataPath = path.join(__dirname, '..', 'lia-children-profiles-with-sponsors.json');
const childrenData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Function to create a single child profile
async function createChildProfile(child) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}` // Only needed if API requires authentication
      },
      body: JSON.stringify({
        data: {
          liaId: child.id,
          fullName: child.fullName,
          dateOfBirth: child.dateOfBirth,
          joinedSponsorshipProgram: child.joinedSponsorshipProgram,
          ageAtJoining: child.ageAtJoining ? String(child.ageAtJoining) : null,
          gradeAtJoining: child.gradeAtJoining,
          currentGrade: child.currentGrade,
          school: child.school,
          walkToSchool: child.walkToSchool,
          family: child.family,
          location: child.location,
          education: child.education,
          aspiration: child.aspiration,
          hobby: child.hobby,
          about: child.about,
          sponsor: child.sponsor
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create profile for ${child.fullName}: ${error}`);
    }

    const result = await response.json();
    console.log(`✅ Created profile for ${child.fullName}`);
    return result;
  } catch (error) {
    console.error(`❌ Error creating profile for ${child.fullName}:`, error.message);
    throw error;
  }
}

// Main seeding function
async function seedData() {
  console.log(`\n🌱 Starting to seed ${childrenData.length} child profiles...\n`);
  
  let successCount = 0;
  let failureCount = 0;
  const errors = [];

  for (const child of childrenData) {
    try {
      await createChildProfile(child);
      successCount++;
      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      failureCount++;
      errors.push({ child: child.fullName, error: error.message });
    }
  }

  console.log('\n📊 Seeding Summary:');
  console.log(`✅ Successfully created: ${successCount} profiles`);
  console.log(`❌ Failed: ${failureCount} profiles`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(({ child, error }) => {
      console.log(`  - ${child}: ${error}`);
    });
  }

  console.log('\n✨ Seeding process completed!\n');
}

// Check if Strapi is running
async function checkStrapiConnection() {
  try {
    // Try to fetch any API endpoint to check if Strapi is running
    const response = await fetch(`${STRAPI_URL}/api/home-page`);
    if (response.status === 404) {
      // API is running but endpoint doesn't exist yet - that's OK
      console.log('✅ Connected to Strapi successfully\n');
      return true;
    }
    if (response.ok) {
      console.log('✅ Connected to Strapi successfully\n');
      return true;
    }
    return true; // Strapi is responding
  } catch (error) {
    console.error('❌ Could not connect to Strapi. Make sure it\'s running on', STRAPI_URL);
    console.error('   Error:', error.message);
    return false;
  }
}

// Run the seeding process
async function main() {
  console.log('🚀 Strapi Data Seeder\n');
  console.log('================================\n');
  
  // Check if API token is provided (if needed)
  if (!API_TOKEN) {
    console.log('⚠️  Warning: No API token provided. This might work if your Strapi API is public.');
    console.log('   If you get authentication errors, set STRAPI_API_TOKEN environment variable.\n');
  }

  // Check Strapi connection
  const isConnected = await checkStrapiConnection();
  if (!isConnected) {
    process.exit(1);
  }

  // Run the seeding
  await seedData();
}

// Execute if run directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { seedData, createChildProfile };