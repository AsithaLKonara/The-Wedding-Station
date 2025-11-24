# 🚀 Vercel Deployment Guide

This guide will help you deploy "The Wedding Station" portfolio website to Vercel.

---

## 📋 Prerequisites

- ✅ GitHub repository pushed (already done)
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Environment variables ready

---

## 🎯 Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Import Project

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Sign in (or create account)

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select "The-Wedding-Station" repository
   - Click "Import"

### Step 2: Configure Project

1. **Project Settings**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

2. **Environment Variables**
   Click "Environment Variables" and add:

   ```env
   # Site Configuration
   NEXT_PUBLIC_SITE_TITLE=The Wedding Station
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

   # Facebook API Configuration
   FB_PAGE_ID=100046893432179
   FB_ACCESS_TOKEN=your_long_lived_access_token_here
   FB_CACHE_TTL_SECONDS=900

   # Email Configuration (Optional)
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   CONTACT_EMAIL=contact@yourdomain.com

   # Or SMTP (Alternative)
   # SMTP_URL=smtp://user:pass@smtp.example.com:587

   # Optional: Redis Cache
   # REDIS_URL=redis://localhost:6379

   # Node Environment
   NODE_ENV=production
   ```

   **Important:**
   - Add variables for **Production**, **Preview**, and **Development** environments
   - Replace `your_long_lived_access_token_here` with your actual token
   - Replace `your-domain.vercel.app` with your actual Vercel domain (after first deploy)

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your site will be live at: `https://your-project.vercel.app`

---

## 🎯 Method 2: Deploy via Vercel CLI

### Step 1: Login to Vercel

```bash
vercel login
```

### Step 2: Link Project (First Time)

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (first time)
- Project name? **the-wedding-station** (or your choice)
- Directory? **./** (current directory)
- Override settings? **No**

### Step 3: Set Environment Variables

```bash
# Set Facebook credentials
vercel env add FB_PAGE_ID production
vercel env add FB_ACCESS_TOKEN production
vercel env add FB_CACHE_TTL_SECONDS production

# Set site configuration
vercel env add NEXT_PUBLIC_SITE_TITLE production
vercel env add NEXT_PUBLIC_BASE_URL production

# Set email (if using)
vercel env add SENDGRID_API_KEY production
vercel env add CONTACT_EMAIL production
```

**Or set all at once:**
```bash
vercel env pull .env.production
# Edit .env.production with your values
vercel env push .env.production
```

### Step 4: Deploy

```bash
# Deploy to production
vercel --prod

# Or deploy preview
vercel
```

---

## 🔧 Post-Deployment Configuration

### 1. Update Base URL

After first deployment, update `NEXT_PUBLIC_BASE_URL`:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_BASE_URL` to your actual Vercel domain
3. Redeploy

### 2. Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### 3. Verify Deployment

1. Visit your deployed site
2. Check Gallery section (should show loading or empty state)
3. Test contact form
4. Check admin panel: `https://your-domain.vercel.app/admin`

---

## 🔍 Troubleshooting

### Build Fails

**Error: "Module not found"**
- Solution: Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "Environment variable missing"**
- Solution: Add all required env vars in Vercel dashboard
- Redeploy after adding variables

### Facebook API Not Working

**Error: "Invalid OAuth access token"**
- Solution: Token may have expired
- Get a new token and update `FB_ACCESS_TOKEN` in Vercel
- Redeploy

**Error: "Page ID not found"**
- Solution: Make sure you're using a Facebook Page ID, not Profile ID
- See `FACEBOOK_FIX.md` for details

### Images Not Loading

- Solution: Make sure images are in `/public` directory
- Use Next.js `Image` component for optimization

---

## 📊 Deployment Checklist

- [ ] Project pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Build successful
- [ ] Site accessible
- [ ] Facebook API working (or shows graceful error)
- [ ] Contact form working
- [ ] Custom domain configured (optional)

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. Push to `main` branch → Production deployment
2. Push to other branches → Preview deployment
3. Create Pull Request → Preview deployment

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `FB_PAGE_ID` | Yes | Facebook Page ID |
| `FB_ACCESS_TOKEN` | Yes | Long-lived Facebook access token |
| `FB_CACHE_TTL_SECONDS` | No | Cache TTL (default: 900) |
| `NEXT_PUBLIC_SITE_TITLE` | No | Site title (default: "The Wedding Station") |
| `NEXT_PUBLIC_BASE_URL` | No | Base URL for the site |
| `SENDGRID_API_KEY` | No* | SendGrid API key for emails |
| `CONTACT_EMAIL` | No* | Email to receive contact form submissions |
| `SMTP_URL` | No* | SMTP connection string (alternative to SendGrid) |

*Required if you want contact form to send emails

---

## 🎉 Success!

Once deployed, your site will be:
- ✅ Live and accessible worldwide
- ✅ Automatically optimized by Vercel
- ✅ SSL certificate included (HTTPS)
- ✅ CDN enabled for fast loading
- ✅ Auto-deployed on every Git push

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Project README: See `README.md` for more details

