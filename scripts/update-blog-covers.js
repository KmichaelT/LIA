const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = 'http://localhost:1337';

// Cover image URLs to download and use
const blogCovers = [
  {
    blogTitle: "How to build a successful brand and business",
    imageUrl: "https://images.unsplash.com/photo-1536735561749-fc87494598cb?w=800&q=80"
  },
  {
    blogTitle: "The difference between UI and UX",
    imageUrl: "https://images.unsplash.com/photo-1653288973812-81d1951b8127?w=800&q=80"
  },
  {
    blogTitle: "Optimizing your website for SEO and getting more traffic",
    imageUrl: "https://images.unsplash.com/photo-1563952532949-3d1a874ad614?w=800&q=80"
  },
  {
    blogTitle: "Supporting Education in Ethiopia: Making a Real Difference",
    imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80"
  }
];

// Function to get all blogs
async function getBlogs() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/blogs?pagination[pageSize]=100`);
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

// Function to get all media files
async function getMediaFiles() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/upload/files?pagination[pageSize]=500`);
    if (!response.ok) {
      throw new Error('Failed to fetch media files');
    }
    const mediaFiles = await response.json();
    return mediaFiles;
  } catch (error) {
    console.error('Error fetching media files:', error);
    return [];
  }
}

// Function to update blog with cover image
async function updateBlogCover(blogId, mediaId) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/blogs/${blogId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          cover: mediaId
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Failed to update blog ${blogId}:`, error.message);
    return null;
  }
}

// Function to download image from URL and upload to Strapi
async function downloadAndUploadImage(imageUrl, filename) {
  try {
    // Download image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image from ${imageUrl}`);
    }
    
    const buffer = await response.arrayBuffer();
    const tempPath = `/tmp/${filename}.jpg`;
    fs.writeFileSync(tempPath, Buffer.from(buffer));
    
    // Upload to Strapi using curl
    const { execSync } = require('child_process');
    const curlCommand = `curl -s -X POST \
      -F "files=@${tempPath}" \
      ${STRAPI_URL}/api/upload`;
    
    const uploadResult = execSync(curlCommand, { encoding: 'utf8' });
    const uploadData = JSON.parse(uploadResult);
    
    // Clean up temp file
    fs.unlinkSync(tempPath);
    
    if (uploadData && uploadData[0] && uploadData[0].id) {
      return uploadData[0].id;
    }
    
    throw new Error('Upload failed');
  } catch (error) {
    console.error(`Failed to download/upload image:`, error.message);
    return null;
  }
}

// Main function
async function updateBlogCovers() {
  console.log('\n📸 BLOG COVER IMAGE UPDATER');
  console.log('=' .repeat(50));
  
  // Get all blogs
  const blogs = await getBlogs();
  console.log(`\n✅ Found ${blogs.length} blogs`);
  
  // Get existing media files
  const mediaFiles = await getMediaFiles();
  console.log(`✅ Found ${mediaFiles.length} media files in library`);
  
  // Check if we have a screenshot that matches the one you mentioned
  const screenshot = mediaFiles.find(file => 
    file.name && file.name.includes('Screenshot_2025_08_06')
  );
  
  if (screenshot) {
    console.log(`\n📷 Found screenshot: ${screenshot.name}`);
    console.log(`   URL: ${STRAPI_URL}${screenshot.url}`);
  }
  
  let successCount = 0;
  let failureCount = 0;
  
  console.log('\n🔄 Updating blog covers...\n');
  
  for (const blogCover of blogCovers) {
    // Find the blog by title
    const blog = blogs.find(b => b.Heading === blogCover.blogTitle);
    
    if (!blog) {
      console.log(`⚠️  Blog not found: "${blogCover.blogTitle}"`);
      failureCount++;
      continue;
    }
    
    if (blog.cover) {
      console.log(`✓ Blog already has cover: "${blog.Heading}"`);
      successCount++;
      continue;
    }
    
    console.log(`📥 Processing: "${blog.Heading}"`);
    
    // Generate a filename from the blog title
    const filename = blog.Heading.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 50);
    
    // Download and upload the image
    const mediaId = await downloadAndUploadImage(blogCover.imageUrl, filename);
    
    if (mediaId) {
      // Update the blog with the cover image
      const result = await updateBlogCover(blog.documentId, mediaId);
      
      if (result) {
        console.log(`  ✅ Cover image added successfully`);
        successCount++;
      } else {
        console.log(`  ❌ Failed to update blog`);
        failureCount++;
      }
    } else {
      console.log(`  ❌ Failed to upload image`);
      failureCount++;
    }
    
    // Small delay between operations
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 UPDATE SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Successfully updated: ${successCount} blogs`);
  console.log(`❌ Failed: ${failureCount} blogs`);
  
  // If you want to use the existing screenshot for a specific blog
  if (screenshot) {
    console.log('\n💡 TIP: To use the existing screenshot for a blog:');
    console.log(`   You can manually assign media ID ${screenshot.id} to any blog`);
    console.log(`   Or update this script to use it for a specific blog`);
  }
  
  console.log('\n✨ Blog cover update process completed!\n');
}

// Run the updater
if (require.main === module) {
  updateBlogCovers().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}