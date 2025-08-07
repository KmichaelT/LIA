// STRAPI EXTENSION FILE
// Path: src/extensions/users-permissions/strapi-server.js
// Copy this file to your Strapi project at the path above

module.exports = (plugin) => {
  // Save the original register controller
  const originalRegister = plugin.controllers.auth.register;

  // Override the register controller
  plugin.controllers.auth.register = async (ctx) => {
    // Extract the custom fields from the request
    const { 
      firstName, 
      lastName, 
      phone, 
      address, 
      city, 
      country 
    } = ctx.request.body;

    // Call the original register method
    await originalRegister(ctx);

    // If registration was successful, update the user with custom fields
    if (ctx.response.status === 200 && ctx.response.body.user) {
      const userId = ctx.response.body.user.id;
      
      try {
        // Update the user with the additional fields
        const updatedUser = await strapi.entityService.update(
          'plugin::users-permissions.user', 
          userId, 
          {
            data: {
              firstName: firstName || '',
              lastName: lastName || '',
              phone: phone || '',
              address: address || '',
              city: city || '',
              country: country || ''
            },
          }
        );

        // Fetch the complete updated user data
        const completeUser = await strapi.entityService.findOne(
          'plugin::users-permissions.user',
          userId,
          {
            fields: ['id', 'username', 'email', 'firstName', 'lastName', 'phone', 'address', 'city', 'country'],
          }
        );

        // Update the response with the complete user data
        ctx.response.body.user = completeUser;
      } catch (error) {
        console.error('Error updating user with custom fields:', error);
        // Don't fail the registration if update fails
      }
    }
  };

  return plugin;
};