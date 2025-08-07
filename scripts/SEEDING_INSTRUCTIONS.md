# Strapi Data Seeding Instructions

## Prerequisites

1. **Strapi must be running** on `http://localhost:1337`
2. **Create the Children content type** in Strapi Admin Panel first

## Step 1: Create the Content Type in Strapi

1. Go to Strapi Admin Panel (http://localhost:1337/admin)
2. Navigate to Content-Type Builder
3. Create a new Collection Type called "Children" (plural)
4. Add the following fields:

| Field Name | Type | Required | Notes |
|------------|------|----------|-------|
| liaId | Text (Short) | Yes | Unique identifier (e.g., LIA-00001) |
| fullName | Text (Short) | Yes | Child's full name |
| dateOfBirth | Date | No | Birth date |
| sponsor | Text (Short) | No | Sponsor's name |
| joinedSponsorshipProgram | Date | No | Date joined |
| ageAtJoining | Number (Integer) | No | Age when joined |
| gradeAtJoining | Text (Short) | No | Grade when joined |
| currentGrade | Text (Short) | No | Current grade |
| school | Text (Short) | No | School name |
| walkToSchool | Text (Short) | No | Commute time |
| family | Text (Long) | No | Family description |
| location | Text (Short) | No | Location/address |
| education | Text (Short) | No | Education details |
| aspiration | Text (Short) | No | Career aspirations |
| hobby | Text (Short) | No | Hobbies |
| about | Text (Long) | No | Full description |

5. Save and publish the content type

## Step 2: Configure API Permissions

1. Go to Settings → Roles → Public
2. Under "Children" collection:
   - Enable `find` (to read)
   - Enable `findOne` (to read single)
   - Enable `create` (for seeding - disable after seeding for security)
3. Save

## Step 3: Run the Seeding Script

### Option A: Simple Seeding (No Authentication)

```bash
# From the project root directory
node scripts/seed-strapi-simple.js
```

This will:
- Check if Strapi is running
- Verify the /api/children endpoint exists
- Seed all data in batches of 5
- Show progress and summary

### Option B: With Authentication (Production)

1. First, create an API token in Strapi:
   - Go to Settings → API Tokens
   - Create new API Token
   - Set type to "Full access" or custom with Children create permission
   - Copy the token

2. Run with token:
```bash
# Set the API token as environment variable
STRAPI_API_TOKEN="your-token-here" node scripts/seed-strapi.js
```

## Step 4: Verify the Data

1. Go to Content Manager in Strapi Admin
2. Click on "Children"
3. You should see all the imported child profiles

## Step 5: Secure Your API (Important!)

After seeding:
1. Go to Settings → Roles → Public
2. Under "Children" collection:
   - **Disable** `create` permission
   - Keep only `find` and `findOne` if needed
3. Save

## Troubleshooting

### "The /api/children endpoint does not exist"
- Make sure you created the content type with the exact name "Children" (plural)
- Restart Strapi after creating the content type

### "Failed to fetch" or connection errors
- Ensure Strapi is running: `npm run develop` in your Strapi project
- Check if it's accessible at http://localhost:1337

### Authentication errors
- For development, ensure "create" permission is enabled for Public role
- For production, use API token method

### Data format errors
- Check that your content type fields match the JSON structure
- Field types must be compatible (Text for strings, Number for integers, etc.)

## Data File Location

The script reads from: `lia-children-profiles-with-sponsors.json` in the project root.

## Script Features

- **Batch processing**: Processes 5 records at a time to avoid overwhelming the server
- **Error handling**: Continues even if some records fail
- **Progress tracking**: Shows real-time progress
- **Summary report**: Lists successes and failures at the end
- **Retry logic**: Can be run multiple times (will create duplicates though)

## Note on Duplicates

The script doesn't check for existing records. Running it multiple times will create duplicate entries. To avoid this:
1. Clear existing data first in Strapi Content Manager
2. Or add logic to check for existing records by liaId before creating