# 📧 Simple Email Template Update Guide

## 🎯 Solution: Two Buttons in One Email

Instead of smart detection, your email template will have **TWO buttons**:
1. **"Confirm on Website"** - For web users
2. **"Open in Mobile App"** - For mobile app users

## 📋 What to Do in Strapi

### Step 1: Open Strapi Admin Panel
Go to: **http://localhost:1337/admin**

### Step 2: Update Email Templates
**Settings** → **Users & Permissions Plugin** → **Email Templates**

### Step 3: Copy the Template Content

#### For "Email address confirmation":
Copy the content from: `email-templates/email-confirmation-unified.html`

**Key parts to include:**
```html
<!-- Button for Website -->
<a href="https://loveinaction.co/auth/email-confirmation?confirmation=<%= CODE %>">
    Confirm on Website
</a>

<!-- Button for Mobile App -->
<a href="thomasasfaw.com://auth/email-confirmation?confirmation=<%= CODE %>">
    Open in Mobile App
</a>
```

#### For "Reset password":
Copy the content from: `email-templates/password-reset-unified.html`

**Key parts to include:**
```html
<!-- Button for Website -->
<a href="https://loveinaction.co/auth/reset-password?code=<%= CODE %>">
    Reset on Website
</a>

<!-- Button for Mobile App -->
<a href="thomasasfaw.com://auth/reset-password?code=<%= CODE %>">
    Reset in Mobile App
</a>
```

## 🔑 Strapi Settings (Keep Current)

**Settings** → **Users & Permissions Plugin** → **Advanced Settings**:

| **Setting** | **Keep As** |
|-------------|-------------|
| Email confirmation redirection | `https://loveinaction.co/auth/email-confirmation` |
| Reset password page | `https://loveinaction.co/auth/reset-password` |

## ✅ Benefits of This Approach

- ✅ **Simple** - No smart detection needed
- ✅ **User chooses** - Let user pick their platform
- ✅ **Works for both** - Website and app users
- ✅ **No code changes** - Just template updates
- ✅ **Clear instructions** - User knows what to click

## 🎨 Template Features

### Email Confirmation Template:
- Two buttons (Website / Mobile App)
- Alternative text links for both
- Clear platform instructions
- Professional styling

### Password Reset Template:
- Two buttons (Website / Mobile App)
- Alternative text links for both
- Security warnings
- Expiry notice

## 🚀 That's It!

Just copy the templates from the `email-templates/` folder and paste them into your Strapi email templates. Users can choose which button to click based on where they're using your app!
