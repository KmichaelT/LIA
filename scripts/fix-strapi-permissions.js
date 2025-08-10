#!/usr/bin/env node

const STRAPI_URL = 'https://best-desire-8443ae2768.strapiapp.com';
const STRAPI_API_TOKEN = '923dc61df3092b1f966480aa381371094e184a0192f5af6c4623a0b17f338b4b8260f7518679549df25af58519cb40cef45284d6b3e087f3f1206c4cbdae3b812b19f31d11c0dc729e6db3cb7b9ea40363d2210ec00905fcfec2600376ca1bb996eb2b27e8ea6761c06eb159557186ebb6e5db64c10d975b826072a5fa6497ee';

async function setPublicPermissions() {
  console.log('Setting public permissions for Strapi content types...\n');

  // Content types to make publicly accessible
  const contentTypes = [
    'api::home-page.home-page',
    'api::about-us.about-us',
    'api::event.event',
    'api::cause.cause',
    'api::service.service',
    'api::stat.stat',
    'api::link.link',
    'api::blog.blog',
    'api::gallery.gallery'
  ];

  try {
    // First, get the public role
    const rolesResponse = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    if (!rolesResponse.ok) {
      throw new Error(`Failed to fetch roles: ${rolesResponse.status}`);
    }

    const rolesData = await rolesResponse.json();
    const publicRole = rolesData.roles?.find(role => role.type === 'public');

    if (!publicRole) {
      throw new Error('Public role not found');
    }

    console.log(`Found public role with ID: ${publicRole.id}\n`);

    // Get current permissions for the public role
    const permissionsResponse = await fetch(`${STRAPI_URL}/api/users-permissions/roles/${publicRole.id}`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      }
    });

    if (!permissionsResponse.ok) {
      throw new Error(`Failed to fetch permissions: ${permissionsResponse.status}`);
    }

    const permissionsData = await permissionsResponse.json();
    const currentPermissions = permissionsData.role.permissions || {};

    // Update permissions to allow find and findOne for each content type
    const updatedPermissions = { ...currentPermissions };

    for (const contentType of contentTypes) {
      console.log(`Setting permissions for ${contentType}...`);
      
      if (!updatedPermissions[contentType]) {
        updatedPermissions[contentType] = {
          controllers: {}
        };
      }

      // Extract the controller name from content type
      const [plugin, ctName] = contentType.split('::');
      const controllerName = ctName.split('.')[0];

      updatedPermissions[contentType].controllers[controllerName] = {
        find: { enabled: true },
        findOne: { enabled: true }
      };
    }

    // Update the public role with new permissions
    const updateResponse = await fetch(`${STRAPI_URL}/api/users-permissions/roles/${publicRole.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        permissions: updatedPermissions
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update permissions: ${updateResponse.status} - ${errorText}`);
    }

    console.log('\n✅ Successfully set public permissions for all content types!');
    console.log('\nThe following content types are now publicly accessible:');
    contentTypes.forEach(ct => console.log(`  - ${ct}`));

  } catch (error) {
    console.error('❌ Error setting permissions:', error.message);
    process.exit(1);
  }
}

// Run the script
setPublicPermissions();