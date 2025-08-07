const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuration
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'sponsee_pictures');

// Helper to convert name format
function normalizeChildName(filename) {
  // Remove number suffix and extension: "abebech_teferi_teka_1.jpg" -> "abebech_teferi_teka"
  const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|gif)$/i, '');
  const nameWithoutNumber = nameWithoutExt.replace(/_\d+$/, '');
  
  // Convert to title case: "abebech_teferi_teka" -> "Abebech Teferi Teka"
  return nameWithoutNumber
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Get all children from Strapi
async function getAllChildren() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/children?pagination[pageSize]=200`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const children = data.data || [];
    
    console.log(`✅ Fetched ${children.length} children from Strapi`);
    return children;
  } catch (error) {
    console.error('❌ Error fetching children:', error.message);
    return [];
  }
}

// Upload a single image to Strapi
async function uploadImage(imagePath, childId, childName) {
  try {
    const form = new FormData();
    form.append('files', fs.createReadStream(imagePath));
    
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        ...form.getHeaders()
      },
      body: form
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    
    const result = await response.json();
    console.log(`  ✅ Uploaded: ${path.basename(imagePath)}`);
    return result;
  } catch (error) {
    console.error(`  ❌ Failed to upload ${path.basename(imagePath)}:`, error.message);
    return null;
  }
}

// Main function to process all images
async function uploadAllImages() {
  console.log('\n🖼️  STRAPI IMAGE UPLOADER');
  console.log('=' .repeat(50));
  
  // Get all children from Strapi
  const children = await getAllChildren();
  
  // Create a map for quick lookup
  const childrenMap = {};
  children.forEach(child => {
    // Check if it's the new Strapi v5 format or v4 format
    const fullName = child.fullName || child.attributes?.fullName;
    if (fullName) {
      const normalizedName = fullName.toLowerCase().replace(/ /g, '_');
      childrenMap[normalizedName] = child;
    }
  });
  
  // Get all image files
  const imageFiles = fs.readdirSync(IMAGES_DIR)
    .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
    .filter(file => !file.startsWith('.'));
  
  console.log(`\n📁 Found ${imageFiles.length} image files`);
  
  // Group images by child name
  const imagesByChild = {};
  imageFiles.forEach(file => {
    const childName = normalizeChildName(file);
    const normalizedKey = childName.toLowerCase().replace(/ /g, '_');
    
    if (!imagesByChild[normalizedKey]) {
      imagesByChild[normalizedKey] = {
        name: childName,
        files: []
      };
    }
    imagesByChild[normalizedKey].files.push(file);
  });
  
  console.log(`\n👥 Images grouped for ${Object.keys(imagesByChild).length} children`);
  
  // Process each child's images
  let successCount = 0;
  let failureCount = 0;
  
  for (const [normalizedName, data] of Object.entries(imagesByChild)) {
    const child = childrenMap[normalizedName];
    
    if (!child) {
      console.log(`\n⚠️  No matching child found for: ${data.name}`);
      console.log(`   Images: ${data.files.join(', ')}`);
      failureCount += data.files.length;
      continue;
    }
    
    const childFullName = child.fullName || child.attributes?.fullName;
    console.log(`\n📤 Uploading images for: ${childFullName}`);
    
    for (const imageFile of data.files) {
      const imagePath = path.join(IMAGES_DIR, imageFile);
      const result = await uploadImage(imagePath, child.id, childFullName);
      
      if (result) {
        successCount++;
      } else {
        failureCount++;
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 UPLOAD SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Successfully uploaded: ${successCount} images`);
  console.log(`❌ Failed: ${failureCount} images`);
  console.log('\n✨ Upload process completed!\n');
}

// Check if form-data is installed
function checkDependencies() {
  try {
    require('form-data');
    return true;
  } catch {
    console.error('❌ Missing dependency: form-data');
    console.log('\nPlease install it by running:');
    console.log('  npm install form-data\n');
    return false;
  }
}

// Main execution
async function main() {
  // Check dependencies
  if (!checkDependencies()) {
    process.exit(1);
  }
  
  // Check API token
  if (!API_TOKEN) {
    console.error('❌ No API token provided!');
    console.log('\nPlease run with:');
    console.log('  STRAPI_API_TOKEN="your-token" node scripts/upload-images-to-strapi.js\n');
    process.exit(1);
  }
  
  // Check if images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ Images directory not found:', IMAGES_DIR);
    process.exit(1);
  }
  
  // Run the upload
  await uploadAllImages();
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}