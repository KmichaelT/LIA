# Check for Direct Zeffy Webhook Support

## Steps to Check

1. **Log into Zeffy Admin Panel**
   - Go to your donation form settings
   - Look for "Integrations" or "Webhooks" section
   - Check if there's a "Webhook URL" field

2. **If Available**
   - Enter your Strapi webhook URL directly:
     ```
     https://your-strapi-domain.com/api/zeffy/webhook
     ```
   - Add custom headers if supported:
     ```
     X-Auth-Token: ZeffyWebhook2025SecureToken_LoveInAction_!@#$RandomString789xyz
     ```

3. **Test Direct Connection**
   - Make a test donation
   - Check Strapi logs for webhook calls
   - If it works, you don't need Zapier/Make at all!

## Contact Zeffy Support
If not immediately visible, contact Zeffy support:
- Ask: "Do you support direct webhooks to external APIs?"
- Mention: "We need to send donation data to our CRM system"
- They may enable it or provide documentation