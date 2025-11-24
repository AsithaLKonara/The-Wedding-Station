# ⚡ Quick Facebook Setup (5 Minutes)

## 🎯 What You Need

1. Your Facebook Page ID: `100046893432179` (already have this!)
2. A Facebook Access Token (need to get this)

---

## 🚀 3 Simple Steps

### Step 1: Get Access Token (2 minutes)

1. **Open Graph API Explorer:**
   - Go to: https://developers.facebook.com/tools/explorer/

2. **Get Token:**
   - Click "Get Token" → "Get User Access Token"
   - Check these boxes:
     - ✅ `pages_read_engagement`
     - ✅ `pages_read_user_content`
   - Click "Generate Access Token"
   - **Copy the token** (looks like: `EAABwzLix...`)

3. **Get Page Token:**
   - In the search box, type: `me/accounts`
   - Click "Submit"
   - Find your page in the list
   - **Copy the `access_token`** from your page

4. **Make it Long-Lived:**
   - Open this URL (replace YOUR_APP_ID, YOUR_APP_SECRET, YOUR_TOKEN):
   ```
   https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_TOKEN
   ```
   - **Copy the `access_token`** from the response

### Step 2: Create .env.local File (1 minute)

1. **Create the file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and add:**
   ```env
   FB_PAGE_ID="100046893432179"
   FB_ACCESS_TOKEN="paste_your_token_here"
   ```

### Step 3: Test It! (1 minute)

1. **Install dotenv (if needed):**
   ```bash
   npm install
   ```

2. **Test the connection:**
   ```bash
   npm run test:fb
   ```

3. **Restart your server:**
   ```bash
   npm run dev
   ```

4. **Visit your site:**
   - Go to: http://localhost:3000
   - Your Facebook photos should appear in the Gallery!

---

## ✅ Done!

Your Facebook posts, images, and videos will now automatically sync to your website!

---

## 🆘 Need More Help?

- **Detailed Guide**: See `FACEBOOK_SETUP.md`
- **Troubleshooting**: Check the README.md "Facebook Sync — Troubleshooting" section

---

## 📝 Quick Checklist

- [ ] Got access token from Graph API Explorer
- [ ] Exchanged for long-lived token
- [ ] Created `.env.local` file
- [ ] Added `FB_PAGE_ID` and `FB_ACCESS_TOKEN`
- [ ] Ran `npm run test:fb` (all tests passed)
- [ ] Restarted dev server
- [ ] Checked homepage - photos are showing!

