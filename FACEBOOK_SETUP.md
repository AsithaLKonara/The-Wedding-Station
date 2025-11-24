# 🔗 Facebook Connection Guide - Step by Step

This guide will help you connect your Facebook Page to automatically fetch posts, images, and videos.

## 📋 Quick Overview

You need 2 things:
1. **Facebook Page ID** - Your page's unique identifier
2. **Facebook Access Token** - A token that allows the app to read your posts

---

## 🚀 Step-by-Step Setup

### Step 1: Get Your Facebook Page ID

**Option A: From Facebook Page URL**
1. Go to your Facebook Page: https://www.facebook.com/profile.php?id=100046893432179
2. The Page ID is the number after `id=`: `100046893432179`

**Option B: Using Graph API Explorer**
1. Go to https://developers.facebook.com/tools/explorer/
2. Click "Get Token" → "Get User Access Token"
3. Select `pages_read_engagement` permission
4. In the search box, type: `me/accounts`
5. Click "Submit"
6. You'll see a list of pages you manage - find your page and copy the `id` field

**Option C: From Page Settings**
1. Go to your Facebook Page
2. Click "Settings" → "Page Info"
3. Scroll down to find "Page ID"

---

### Step 2: Create a Facebook App

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/
   - Log in with your Facebook account

2. **Create a New App**
   - Click "My Apps" (top right)
   - Click "Create App"
   - Choose "Business" as the app type
   - Fill in:
     - **App Name**: "The Wedding Station Portfolio" (or any name)
     - **App Contact Email**: Your email
   - Click "Create App"

3. **Add Facebook Login Product**
   - In your app dashboard, find "Add Product" or "Products"
   - Find "Facebook Login" and click "Set Up"
   - You don't need to configure anything else for basic access

---

### Step 3: Get Your App ID and App Secret

1. In your Facebook App dashboard, go to "Settings" → "Basic"
2. Copy these values:
   - **App ID**: (e.g., `1234567890123456`)
   - **App Secret**: Click "Show" and copy it (e.g., `abc123def456...`)

**⚠️ Keep your App Secret private! Never commit it to Git.**

---

### Step 4: Get a Short-Lived Access Token

**Using Graph API Explorer (Easiest Method):**

1. Go to: https://developers.facebook.com/tools/explorer/
2. **Select Your App**: Use the dropdown at the top to select the app you just created
3. **Get Token**:
   - Click "Get Token" → "Get User Access Token"
   - In the popup, check these permissions:
     - ✅ `pages_read_engagement`
     - ✅ `pages_read_user_content`
     - ✅ `pages_show_list` (optional, but helpful)
   - Click "Generate Access Token"
   - **Copy the token** - it looks like: `EAABwzLix...` (this is a short-lived token, expires in 1-2 hours)

---

### Step 5: Get Your Page Access Token

1. **Still in Graph API Explorer**, in the search box, type:
   ```
   me/accounts
   ```
2. Click "Submit" (or press Enter)
3. You'll see a JSON response with all pages you manage
4. Find your page in the list (look for the page name or ID)
5. **Copy the `access_token`** from that page object
   - This is your **Page Access Token** (still short-lived)

**Example response:**
```json
{
  "data": [
    {
      "access_token": "EAABwzLix...",
      "category": "Photographer",
      "name": "The Wedding Station",
      "id": "100046893432179"
    }
  ]
}
```

---

### Step 6: Exchange for Long-Lived Token (60 Days)

Short-lived tokens expire quickly. Let's get a long-lived token:

**Method 1: Using curl (Terminal)**

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_PAGE_ACCESS_TOKEN"
```

Replace:
- `YOUR_APP_ID` - Your App ID from Step 3
- `YOUR_APP_SECRET` - Your App Secret from Step 3
- `YOUR_PAGE_ACCESS_TOKEN` - The Page Access Token from Step 5

**Method 2: Using Browser**

Open this URL in your browser (replace the values):
```
https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_PAGE_ACCESS_TOKEN
```

**Response:**
```json
{
  "access_token": "EAABwzLix...",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

**Copy the `access_token`** - this is your long-lived token (valid for 60 days).

---

### Step 7: Set Up Environment Variables

1. **Create `.env.local` file** in the project root (if it doesn't exist):
   ```bash
   touch .env.local
   ```

2. **Add your Facebook credentials:**
   ```env
   # Facebook API Configuration
   FB_PAGE_ID="100046893432179"
   FB_ACCESS_TOKEN="EAABwzLix..." # Your long-lived token from Step 6
   FB_CACHE_TTL_SECONDS=900
   ```

3. **Save the file**

---

### Step 8: Test the Connection

1. **Restart your development server:**
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

2. **Test the API endpoint:**
   - Open: http://localhost:3000/api/fb/fetch
   - You should see JSON with your Facebook posts

3. **Check the homepage:**
   - Go to: http://localhost:3000
   - Scroll to the Gallery section
   - Your Facebook photos should appear!

4. **Test manual refresh (Admin Panel):**
   - Go to: http://localhost:3000/admin
   - Password: `admin123` (or set `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`)
   - Click "Refresh Posts"

---

## 🔄 Token Refresh (When Token Expires)

Long-lived tokens expire after 60 days. To refresh:

1. Follow **Step 4** and **Step 5** to get a new Page Access Token
2. Follow **Step 6** to exchange it for a new long-lived token
3. Update `FB_ACCESS_TOKEN` in `.env.local`
4. Restart your server

---

## 🎯 Getting a Never-Expiring Token (Advanced)

For production, you can get a token that never expires:

1. **Complete App Review** (takes 1-2 weeks):
   - Go to your App → "App Review" → "Permissions and Features"
   - Request `pages_read_engagement` permission
   - Submit for review

2. **Once approved**, the Page Access Token won't expire unless:
   - You revoke it manually
   - The page admin changes
   - You remove the app

---

## ❌ Troubleshooting

### Error: "Invalid OAuth access token"
- **Solution**: Token expired. Get a new token (Step 4-6)

### Error: "Unsupported get request"
- **Solution**: You're using a personal profile instead of a Page. Convert to a Page (see below)

### Error: "Insufficient permissions"
- **Solution**: Make sure you selected `pages_read_engagement` and `pages_read_user_content` in Step 4

### No posts showing up
- **Check**: Make sure your Page has public posts with photos/videos
- **Check**: Verify `FB_PAGE_ID` is correct
- **Check**: Test the API endpoint directly: http://localhost:3000/api/fb/fetch

### Converting Personal Profile to Page
1. Go to: https://www.facebook.com/pages/create
2. Choose "Business or Brand"
3. Enter business name: "The Wedding Station"
4. Choose category: "Photographer" or "Business"
5. Complete setup
6. Use the new Page ID in `FB_PAGE_ID`

---

## 📝 Quick Reference

**Your Facebook Page URL:**
```
https://www.facebook.com/profile.php?id=100046893432179
```

**Your Page ID:**
```
100046893432179
```

**Test API Endpoint:**
```
http://localhost:3000/api/fb/fetch
```

**Admin Panel:**
```
http://localhost:3000/admin
```

---

## ✅ Checklist

- [ ] Created Facebook App
- [ ] Got App ID and App Secret
- [ ] Got Page Access Token
- [ ] Exchanged for Long-Lived Token
- [ ] Created `.env.local` file
- [ ] Added `FB_PAGE_ID` and `FB_ACCESS_TOKEN`
- [ ] Restarted development server
- [ ] Tested API endpoint
- [ ] Verified posts appear on homepage

---

## 🆘 Need Help?

If you're stuck:
1. Check the main README.md for more details
2. Visit Facebook Graph API docs: https://developers.facebook.com/docs/graph-api
3. Test your token: https://developers.facebook.com/tools/debug/accesstoken/

