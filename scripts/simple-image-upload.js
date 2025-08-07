const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'sponsee_pictures');

// Main function to upload all images using curl
async function uploadAllImagesWithCurl() {
  console.log('\n🖼️  STRAPI IMAGE UPLOADER (CURL VERSION)');
  console.log('=' .repeat(50));
  
  // Get all image files
  const imageFiles = fs.readdirSync(IMAGES_DIR)
    .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
    .filter(file => !file.startsWith('.'));
  
  console.log(`\n📁 Found ${imageFiles.length} image files`);
  console.log('📤 Starting upload...\n');
  
  let successCount = 0;
  let failureCount = 0;
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    const imagePath = path.join(IMAGES_DIR, imageFile);
    
    console.log(`[${i + 1}/${imageFiles.length}] Uploading: ${imageFile}`);
    
    try {
      const curlCommand = `curl -s -X POST \\
        -H "Authorization: Bearer ${API_TOKEN}" \\
        -F "files=@${imagePath}" \\
        ${STRAPI_URL}/api/upload`;
      
      const result = execSync(curlCommand, { encoding: 'utf8', timeout: 30000 });
      
      // Parse the response to check if it was successful
      const response = JSON.parse(result);
      if (Array.isArray(response) && response.length > 0 && response[0].id) {
        console.log(`  ✅ Uploaded successfully (ID: ${response[0].id})`);
        successCount++;
      } else {
        console.log(`  ❌ Unexpected response format`);
        failureCount++;
      }
      
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message.slice(0, 100)}...`);
      failureCount++;
    }
    
    // Small delay to avoid overwhelming the server
    if (i < imageFiles.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 UPLOAD SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Successfully uploaded: ${successCount} images`);
  console.log(`❌ Failed: ${failureCount} images`);
  console.log(`📍 Images uploaded to: ${STRAPI_URL}/uploads/`);
  console.log('\n✨ Upload process completed!\n');
  
  return { successCount, failureCount };
}

// Main execution
async function main() {
  // Check API token
  if (!API_TOKEN) {
    console.error('❌ No API token provided!');
    console.log('\nPlease run with:');
    console.log('  STRAPI_API_TOKEN="your-token" node scripts/simple-image-upload.js\n');
    process.exit(1);
  }
  
  // Check if images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ Images directory not found:', IMAGES_DIR);
    process.exit(1);
  }
  
  // Run the upload
  const result = await uploadAllImagesWithCurl();
  
  // Exit with appropriate code
  process.exit(result.failureCount > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}