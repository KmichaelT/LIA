const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = 'http://localhost:1337';

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
      },
      body: JSON.stringify({
        data: child  // Send all fields as-is
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorText;
      } catch {
        errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log(`✅ Created: ${child.fullName}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed: ${child.fullName} - ${error.message}`);
    throw error;
  }
}

// Main seeding function with batching
async function seedDataInBatches(batchSize = 5) {
  console.log(`\n🌱 Seeding ${childrenData.length} child profiles in batches of ${batchSize}...\n`);
  
  let successCount = 0;
  let failureCount = 0;
  const errors = [];

  for (let i = 0; i < childrenData.length; i += batchSize) {
    const batch = childrenData.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(childrenData.length/batchSize)}...`);
    
    const promises = batch.map(child => 
      createChildProfile(child)
        .then(() => {
          successCount++;
          return { success: true, name: child.fullName };
        })
        .catch(error => {
          failureCount++;
          errors.push({ child: child.fullName, error: error.message });
          return { success: false, name: child.fullName, error: error.message };
        })
    );
    
    await Promise.allSettled(promises);
    
    // Small delay between batches
    if (i + batchSize < childrenData.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 SEEDING SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successfully created: ${successCount}/${childrenData.length} profiles`);
  console.log(`❌ Failed: ${failureCount}/${childrenData.length} profiles`);
  
  if (errors.length > 0) {
    console.log('\n❌ Failed entries:');
    errors.forEach(({ child, error }) => {
      console.log(`  • ${child}: ${error}`);
    });
  }

  console.log('\n✨ Seeding process completed!\n');
  return { successCount, failureCount, errors };
}

// Quick test function to verify the API endpoint
async function testEndpoint() {
  try {
    console.log('🔍 Testing API endpoint...');
    const response = await fetch(`${STRAPI_URL}/api/children`);
    
    if (response.status === 404) {
      console.log('\n❌ The /api/children endpoint does not exist.');
      console.log('   Please create a "children" content type in Strapi first.');
      console.log('\n📝 Required fields for the content type:');
      console.log('   - id (Text)');
      console.log('   - fullName (Text)');
      console.log('   - dateOfBirth (Date)');
      console.log('   - sponsor (Text)');
      console.log('   - joinedSponsorshipProgram (Date)');
      console.log('   - ageAtJoining (Number)');
      console.log('   - gradeAtJoining (Text)');
      console.log('   - currentGrade (Text)');
      console.log('   - school (Text)');
      console.log('   - walkToSchool (Text)');
      console.log('   - family (Text - Long text)');
      console.log('   - location (Text)');
      console.log('   - education (Text)');
      console.log('   - aspiration (Text)');
      console.log('   - hobby (Text)');
      console.log('   - about (Text - Long text)\n');
      return false;
    }
    
    console.log('✅ API endpoint exists\n');
    return true;
  } catch (error) {
    console.error('❌ Could not connect to Strapi:', error.message);
    console.log('   Make sure Strapi is running on', STRAPI_URL);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 STRAPI DATA SEEDER');
  console.log('='.repeat(50));
  console.log(`📍 Strapi URL: ${STRAPI_URL}`);
  console.log(`📄 Data file: ${path.basename(dataPath)}`);
  console.log(`📊 Total records: ${childrenData.length}`);
  console.log('='.repeat(50));

  // Test the endpoint first
  const endpointExists = await testEndpoint();
  if (!endpointExists) {
    process.exit(1);
  }

  // Ask for confirmation
  console.log('\n⚠️  This will create all child profiles in your Strapi backend.');
  console.log('   Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
  
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Run the seeding
  const result = await seedDataInBatches(5);
  
  // Exit with appropriate code
  process.exit(result.failureCount > 0 ? 1 : 0);
}

// Execute if run directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
}