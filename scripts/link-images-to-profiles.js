const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

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

// Get all media files from Strapi
async function getAllMedia() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/upload/files?pagination[pageSize]=500`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const mediaFiles = await response.json();
    console.log(`✅ Fetched ${mediaFiles.length} media files from Strapi`);
    return mediaFiles;
  } catch (error) {
    console.error('❌ Error fetching media files:', error.message);
    return [];
  }
}

// Update a child with their images
async function updateChildWithImages(child, imageIds) {
  try {
    // Use documentId for Strapi v5 if available, otherwise use regular id
    const identifier = child.documentId || child.id;
    
    const response = await fetch(`${STRAPI_URL}/api/children/${identifier}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          images: imageIds
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`❌ Failed to update child ${identifier}:`, error.message);
    return null;
  }
}

// Main function to link images to profiles
async function linkImagesToProfiles() {
  console.log('\n🔗 STRAPI IMAGE LINKER');
  console.log('=' .repeat(50));
  
  // Get all children and media files
  const children = await getAllChildren();
  const mediaFiles = await getAllMedia();
  
  if (children.length === 0) {
    console.log('❌ No children found. Make sure the children data is seeded first.');
    return;
  }
  
  if (mediaFiles.length === 0) {
    console.log('❌ No media files found. Make sure images are uploaded first.');
    return;
  }
  
  // Create a map for quick lookup by child name
  const childrenMap = {};
  children.forEach(child => {
    const fullName = child.fullName || child.attributes?.fullName;
    if (fullName) {
      const normalizedName = fullName.toLowerCase().replace(/ /g, '_');
      childrenMap[normalizedName] = child;
    }
  });
  
  // Group media files by child name
  const imagesByChild = {};
  mediaFiles.forEach(media => {
    const filename = media.name;
    if (!filename.match(/\.(jpg|jpeg|png|gif)$/i)) return;
    
    const childName = normalizeChildName(filename);
    const normalizedKey = childName.toLowerCase().replace(/ /g, '_');
    
    if (!imagesByChild[normalizedKey]) {
      imagesByChild[normalizedKey] = {
        name: childName,
        images: []
      };
    }
    imagesByChild[normalizedKey].images.push(media);
  });
  
  console.log(`\n📊 Found images for ${Object.keys(imagesByChild).length} children`);
  console.log('🔄 Starting to link images to profiles...\n');
  
  let successCount = 0;
  let failureCount = 0;
  const errors = [];
  
  // Process each child's images
  for (const [normalizedName, data] of Object.entries(imagesByChild)) {
    const child = childrenMap[normalizedName];
    
    if (!child) {
      console.log(`⚠️  No matching child profile found for: ${data.name}`);
      console.log(`   Images: ${data.images.map(img => img.name).join(', ')}`);
      failureCount++;
      errors.push({ child: data.name, error: 'No matching profile found' });
      continue;
    }
    
    const fullName = child.fullName || child.attributes?.fullName;
    console.log(`🔗 Linking ${data.images.length} images to: ${fullName}`);
    
    // Get image IDs
    const imageIds = data.images.map(img => img.id);
    console.log(`   Image IDs: ${imageIds.join(', ')}`);
    
    // Update the child with images
    const result = await updateChildWithImages(child, imageIds);
    
    if (result) {
      console.log(`   ✅ Successfully linked ${data.images.length} images`);
      successCount++;
    } else {
      console.log(`   ❌ Failed to link images`);
      failureCount++;
      errors.push({ child: fullName, error: 'Update failed' });
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 LINKING SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Successfully linked: ${successCount} children profiles`);
  console.log(`❌ Failed: ${failureCount} children profiles`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(({ child, error }) => {
      console.log(`  • ${child}: ${error}`);
    });
  }
  
  console.log('\n✨ Image linking process completed!\n');
  
  return { successCount, failureCount, errors };
}

// Main execution
async function main() {
  // Check API token
  if (!API_TOKEN) {
    console.error('❌ No API token provided!');
    console.log('\nPlease run with:');
    console.log('  STRAPI_API_TOKEN="your-token" node scripts/link-images-to-profiles.js\n');
    process.exit(1);
  }
  
  // Run the linking process
  const result = await linkImagesToProfiles();
  
  // Exit with appropriate code
  process.exit(result.failureCount > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}