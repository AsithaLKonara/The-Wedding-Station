# 🔧 Facebook Connection Fix

## Current Status

✅ **Your access token is valid and working!**
- Token expires: November 24, 2025
- Permissions: `pages_read_engagement`, `pages_show_list` ✅

❌ **Issue**: The Page ID `100046893432179` is not accessible with this token.

## The Problem

The ID `100046893432179` appears to be either:
1. A personal profile (not a Page) - Facebook restricts API access to personal profiles
2. A Page you don't have admin access to with this token
3. An incorrect or old Page ID

## ✅ Solution: Create a Facebook Page

Since you have a personal profile, you need to create a **Facebook Page** for your business:

### Step 1: Create the Page

1. **Go to Facebook Pages:**
   - Visit: https://www.facebook.com/pages/create
   - Or: Go to your Facebook → "Pages" → "Create New Page"

2. **Choose Page Type:**
   - Select **"Business or Brand"**

3. **Fill in Details:**
   - **Page Name**: "The Wedding Station"
   - **Category**: "Photographer" or "Business"
   - **Description**: (Optional) Add your business description

4. **Complete Setup:**
   - Add a profile picture
   - Add a cover photo
   - Click "Create Page"

### Step 2: Get Your New Page ID

**Method 1: From Page Settings**
1. Go to your new Facebook Page
2. Click "Settings" → "Page Info"
3. Scroll down to find "Page ID"
4. Copy the ID

**Method 2: From Page URL**
1. Go to your Facebook Page
2. Look at the URL - it might be:
   - `https://www.facebook.com/YourPageName` (username)
   - `https://www.facebook.com/profile.php?id=123456789` (numeric ID)
3. If it's a username, use Method 1 or Method 3

**Method 3: Using Graph API (Easiest)**
1. Go to: https://developers.facebook.com/tools/explorer/
2. Make sure your app is selected
3. Use the same access token you provided
4. In the search box, type: `me/accounts`
5. Click "Submit"
6. You'll see your new Page in the list
7. Copy the `id` field - that's your Page ID!

### Step 3: Update Your Configuration

1. **Open `.env.local` file:**
   ```bash
   # In your project root
   nano .env.local
   # or open it in your code editor
   ```

2. **Update the Page ID:**
   ```env
   FB_PAGE_ID="your_new_page_id_here"
   ```

3. **Save the file**

### Step 4: Test Again

```bash
npm run test:fb
```

You should see:
```
✅ Page found: The Wedding Station (your_page_id)
✅ Found X posts
```

### Step 5: Restart Your Server

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

Then visit: http://localhost:3000 - your Facebook posts should appear!

---

## Alternative: Use Your Profile (Limited)

If you want to use your personal profile instead (not recommended):

1. **Update `.env.local`:**
   ```env
   FB_PAGE_ID="122148629030716824"  # Your User ID from the token
   ```

2. **Note**: Personal profiles have very limited API access:
   - You can only see your own posts
   - Many posts may not be accessible
   - Facebook may restrict access further

**We strongly recommend creating a Facebook Page for better results.**

---

## Quick Checklist

- [ ] Created Facebook Page
- [ ] Got new Page ID
- [ ] Updated `FB_PAGE_ID` in `.env.local`
- [ ] Ran `npm run test:fb` (all tests passed)
- [ ] Restarted dev server
- [ ] Checked homepage - posts are showing!

---

## Need Help?

If you're still having issues:
1. Make sure you're an admin of the Page
2. Verify the Page ID is correct
3. Check that your Page has public posts with photos/videos
4. Try the admin panel: http://localhost:3000/admin (click "Refresh Posts")

