# Zeffy + Zapier + Strapi + Next.js Integration Setup

This guide explains how to set up the single-entry sponsorship flow where users enter their information once in Zeffy, and all data flows automatically to your Strapi backend.

## ✅ Completed Code Changes

The following has been implemented in your codebase:

### Strapi Backend (lia-back-end)
- ✅ **Donation Content Type** created at `/src/api/donation/content-types/donation/schema.json`
- ✅ **Zeffy Webhook Endpoint** created at `/src/api/zeffy-webhook/`
- ✅ **Sponsor Schema Updated** to include donations relation
- ✅ **Environment Variable** added for webhook security
- ✅ **Test Script** created for webhook verification

### Next.js Frontend (Lia_Current)
- ✅ **Complete Profile Page** updated at `/src/app/complete-profile/page.tsx` (now uses Zeffy iframe)
- ✅ **Sponsor Checkout Page** created at `/src/app/sponsor/checkout/page.tsx`
- ✅ **Thank You Page** created at `/src/app/thanks/page.tsx`

## 🔧 Manual Setup Required

### 1. Restart Strapi
Restart your Strapi server to load the new content types and webhook endpoints:
```bash
cd /path/to/lia-back-end
npm run develop
# or
yarn develop
```

### 2. Set Permissions in Strapi Admin

1. Go to **Strapi Admin** → **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public** role
3. Enable permissions for **Donation**:
   - ✅ `create` (for webhook to create donations)
   - ✅ `find` (optional, for API access)
   - ✅ `findOne` (optional, for API access)

### 3. Zeffy Form Setup

1. **Create/Configure Zeffy Form**:
   - Enable donor fields: first name, last name, email, phone, address, city, country
   - Add custom question: "Sponsorship ID" or "Child ID" (optional)
   - Get your form's **embed URL slug**

2. **Form URL Updated**:
   ✅ Both pages now use your actual Zeffy form:
   ```tsx
   src="https://www.zeffy.com/embed/donation-form/d7a24fa2-5425-4e72-b337-120c4f0b8c64"
   ```

3. **Set Post-Submission Redirect**:
   Ask Zeffy support to set redirect URL to: `https://your-domain.com/thanks`

### 4. Zapier Integration

1. **Create New Zap**:
   - **Trigger**: Zeffy → Get Donations
   - **Action**: Webhooks by Zapier → POST

2. **Configure Webhook Action**:
   - **URL**: `https://your-strapi-domain.com/api/zeffy/webhook`
   - **Method**: POST
   - **Headers**:
     ```
     Content-Type: application/json
     X-Auth-Token: ZeffyWebhook2025SecureToken_LoveInAction_!@#$RandomString789xyz
     ```

3. **Map Zapier Fields** to JSON body:
   ```json
   {
     "transaction_id": "[Zeffy Transaction ID]",
     "amount": "[Zeffy Amount]",
     "currency": "[Zeffy Currency]",
     "frequency": "[one_time or monthly]",
     "created_at": "[Zeffy Created At]",
     "form_name": "[Zeffy Form Name]",
     "utm": {
       "source": "[UTM Source if available]",
       "medium": "[UTM Medium if available]",
       "campaign": "[UTM Campaign if available]"
     },
     "donor": {
       "first_name": "[Donor First Name]",
       "last_name": "[Donor Last Name]",
       "email": "[Donor Email]",
       "phone": "[Donor Phone]"
     },
     "address": {
       "line1": "[Address Line 1]",
       "city": "[City]",
       "country": "[Country]"
     },
     "custom_questions": "[Custom Questions Array]"
   }
   ```

4. **Test and Activate** the Zap

## 🧪 Testing

### Test Webhook Endpoint
Run the provided test script:
```bash
./scripts/test-zeffy-webhook.sh
```

Expected responses:
- Test 1: `{"ok": true}`
- Test 2: `{"ok": true, "duplicate": true}`
- Test 3: `401 Unauthorized`
- Test 4: `400 Bad Request`

### Test End-to-End Flow
1. Navigate to `/sponsor/checkout` on your Next.js app
2. Complete a test donation in the Zeffy iframe
3. Verify in Strapi Admin:
   - New **Sponsor** created/updated
   - New **Donation** record created
4. Check that redirect goes to `/thanks` page

## 🔒 Security Notes

- **Webhook Secret**: The `ZEFFY_WEBHOOK_SECRET` in your `.env` file must match the `X-Auth-Token` header in Zapier
- **No Authentication**: The webhook endpoint has `auth: false` but requires the secret header
- **Raw Payload Storage**: All webhook data is stored in `raw_payload` for debugging/auditing

## 📊 Data Flow

### New User Profile Completion:
1. **User** registers and is directed to `/complete-profile`
2. **User** sees Zeffy iframe and completes donation with their account email
3. **Zeffy** processes payment and triggers webhook
4. **Zapier** receives trigger and POSTs to your Strapi webhook
5. **Strapi** webhook:
   - Creates new Sponsor profile automatically
   - Creates new Donation record
   - Links Donation to Sponsor
6. **User** is redirected to `/thanks` page with welcome message
7. **User** can now access their dashboard and view sponsored children

### Existing Sponsor Additional Donations:
1. **User** goes to `/sponsor/checkout` for additional donations
2. **User** completes Zeffy form with same email
3. **Strapi** webhook updates existing Sponsor profile and adds new Donation
4. **User** is redirected to `/thanks` page

## 🐛 Troubleshooting

### Common Issues

**401 Unauthorized from Webhook**:
- Check `X-Auth-Token` header matches `ZEFFY_WEBHOOK_SECRET`

**400 Missing transaction_id**:
- Ensure Zapier maps transaction ID from Zeffy trigger

**400 Missing donor email**:
- Ensure Zeffy form requires email field
- Check Zapier mapping for donor.email

**Donation not appearing**:
- Check Strapi logs for errors
- Verify webhook endpoint is accessible
- Test with cURL script

**Custom Questions not working**:
- Ensure Zapier passes `custom_questions` as an array
- Check question text matching in webhook controller

### Webhook URL for Reference
Your webhook endpoint will be available at:
```
https://your-strapi-domain.com/api/zeffy/webhook
```

## 📈 Next Steps

After setup:
1. Monitor initial donations in Strapi Admin
2. Set up email notifications for new donations (optional)
3. Create dashboard views for sponsors to see their donation history
4. Configure automated thank you emails through Strapi
5. Set up recurring donation handling if using monthly donations

## 🔗 Important URLs

- **Sponsor Checkout**: `/sponsor/checkout`
- **Thank You Page**: `/thanks`
- **Webhook Endpoint**: `/api/zeffy/webhook`
- **Webhook Secret**: `ZeffyWebhook2025SecureToken_LoveInAction_!@#$RandomString789xyz`