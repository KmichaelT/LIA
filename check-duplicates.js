// Script to check for duplicate children in Strapi
// Run this with: node check-duplicates.js

async function checkForDuplicates() {
  try {
    // Fetch all children from Strapi API
    const response = await fetch('http://localhost:1337/api/children?pagination[pageSize]=1000');
    const data = await response.json();
    
    if (!data.data) {
      console.log('No data found or API error');
      return;
    }

    const children = data.data;
    console.log(`Total children found: ${children.length}`);
    
    // Check for duplicate names
    const nameMap = new Map();
    const duplicates = [];
    
    children.forEach((child) => {
      const attributes = child.attributes;
      const fullName = `${attributes.firstName || ''} ${attributes.lastName || ''}`.trim().toLowerCase();
      
      if (!fullName) return; // Skip if no name
      
      if (nameMap.has(fullName)) {
        // Found duplicate
        const existing = nameMap.get(fullName);
        duplicates.push({
          name: fullName,
          entries: [
            {
              id: existing.id,
              createdAt: existing.attributes.createdAt,
              firstName: existing.attributes.firstName,
              lastName: existing.attributes.lastName
            },
            {
              id: child.id,
              createdAt: child.attributes.createdAt,
              firstName: attributes.firstName,
              lastName: attributes.lastName
            }
          ]
        });
      } else {
        nameMap.set(fullName, child);
      }
    });
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicate names found!');
    } else {
      console.log(`\n❌ Found ${duplicates.length} potential duplicates:`);
      duplicates.forEach((duplicate, index) => {
        console.log(`\n${index + 1}. Duplicate name: "${duplicate.name}"`);
        duplicate.entries.forEach((entry, i) => {
          console.log(`   ${i + 1}. ID: ${entry.id}, Created: ${entry.createdAt}`);
        });
      });
    }
    
    // Additional checks can be added here (age, location, etc.)
    
  } catch (error) {
    console.error('Error checking duplicates:', error);
    console.log('Make sure your Strapi server is running on http://localhost:1337');
  }
}

checkForDuplicates();