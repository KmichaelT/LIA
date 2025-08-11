# Make.com (Free Alternative to Zapier)

## Setup Instructions

1. **Sign up for Make.com** (free account)
   - Go to https://www.make.com/
   - Create free account (1,000 operations/month)

2. **Create New Scenario**
   - Click "Create a new scenario"
   - Search for "Zeffy" and add as trigger
   - Select "Watch Donations" or similar trigger

3. **Add HTTP Module**
   - Add "HTTP" module after Zeffy trigger
   - Choose "Make a request"
   - Method: POST
   - URL: `https://your-strapi-domain.com/api/zeffy/webhook`

4. **Configure Headers**
   ```
   Content-Type: application/json
   X-Auth-Token: ZeffyWebhook2025SecureToken_LoveInAction_!@#$RandomString789xyz
   ```

5. **Map Body Data** (same as Zapier mapping)
   ```json
   {
     "transaction_id": "{{zeffy.transaction_id}}",
     "amount": "{{zeffy.amount}}",
     "currency": "{{zeffy.currency}}",
     "frequency": "{{zeffy.frequency}}",
     "created_at": "{{zeffy.created_at}}",
     "form_name": "{{zeffy.form_name}}",
     "donor": {
       "first_name": "{{zeffy.donor_first_name}}",
       "last_name": "{{zeffy.donor_last_name}}",
       "email": "{{zeffy.donor_email}}",
       "phone": "{{zeffy.donor_phone}}"
     },
     "address": {
       "line1": "{{zeffy.address_line1}}",
       "city": "{{zeffy.city}}",
       "country": "{{zeffy.country}}"
     }
   }
   ```

6. **Test and Activate**