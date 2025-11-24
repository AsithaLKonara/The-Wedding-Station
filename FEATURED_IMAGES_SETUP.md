# 🖼️ Featured Images Setup Guide

This guide will help you set up the Featured Images section that appears between the Hero and Gallery sections.

## 📋 Overview

The Featured Images feature allows you to:
- Add selected images to showcase between Hero and Gallery sections
- Upload images directly to Cloudinary (recommended)
- Or use image URLs from Google Drive or other sources
- Manage featured images from the Admin Dashboard

## 🚀 Setup Options

### Option 1: Cloudinary (Recommended - Free Tier Available)

Cloudinary offers a free tier with:
- 25GB storage
- 25GB bandwidth/month
- Automatic image optimization
- CDN delivery

#### Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/
2. Click "Sign Up" (free account)
3. Complete the registration

#### Step 2: Get Your Cloudinary Credentials

1. After logging in, you'll see your **Dashboard**
2. Copy these values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

#### Step 3: Add to Environment Variables

Add these to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Option 2: Google Drive (URL Method)

If you prefer to use Google Drive or other image hosting:

1. **Upload images to Google Drive**
2. **Get shareable link**:
   - Right-click image → "Get link"
   - Set to "Anyone with the link"
   - Copy the link

3. **Convert to direct image URL**:
   - For Google Drive, use this format:
     ```
     https://drive.google.com/uc?export=view&id=FILE_ID
     ```
   - Replace `FILE_ID` with the ID from your shareable link
   - Or use services like: https://sites.google.com/site/gdocs2direct/

4. **Use the direct image URL** in the admin panel (URL upload mode)

## 📝 Using the Featured Images Feature

### Adding Featured Images

1. **Go to Admin Dashboard**
   - Navigate to `/admin`
   - Enter your admin password

2. **Scroll to "Featured Images" section**

3. **Choose Upload Method**:
   - **Upload File**: Direct upload to Cloudinary (requires Cloudinary setup)
   - **Image URL**: Use URL from Google Drive or other source

4. **Fill in the form**:
   - Select/enter image
   - Add title (optional)
   - Add caption (optional)
   - Click "Add Featured Image"

5. **View on homepage**:
   - Featured images appear between Hero and Gallery sections
   - Maximum 6 images displayed
   - Images are sorted by order

### Managing Featured Images

- **View all**: See all featured images in the admin panel
- **Remove**: Click "Remove" button on any image
- **Reorder**: Currently sorted by creation order (can be enhanced)

## 🔧 Technical Details

### Storage

- **Metadata**: Stored in `data/featured.json` (local file)
- **Images**: 
  - Cloudinary: Stored in Cloudinary's CDN
  - URL method: Hosted on external source (Google Drive, etc.)

### API Endpoints

- `GET /api/featured` - Get all featured images
- `POST /api/featured` - Add new featured image
- `DELETE /api/featured` - Remove featured image
- `PATCH /api/featured` - Update image order

### File Structure

```
data/
  └── featured.json    # Stores featured images metadata
```

## 🎨 Display

- Featured section appears between Hero and Gallery
- Responsive grid layout:
  - 2 columns on mobile
  - 3 columns on tablet
  - 3-4 columns on desktop
- Hover effects with image titles/captions
- Click to open in lightbox

## ⚠️ Important Notes

1. **Cloudinary Setup**: Required for file uploads. If not set up, use URL method instead.

2. **Google Drive URLs**: Must be converted to direct image URLs. Regular shareable links won't work.

3. **Image Optimization**: Cloudinary automatically optimizes images. For URL method, ensure images are optimized.

4. **Data Directory**: The `data/` directory is created automatically. Make sure it's writable.

5. **Backup**: The `data/featured.json` file contains all featured image metadata. Consider backing it up.

## 🐛 Troubleshooting

### Images not uploading to Cloudinary

- Check `.env.local` has correct Cloudinary credentials
- Verify Cloudinary account is active
- Check file size (Cloudinary free tier has limits)

### Images from Google Drive not showing

- Ensure URL is a direct image link (not shareable link)
- Check image permissions (must be publicly accessible)
- Verify URL format is correct

### Featured section not appearing

- Check that featured images exist (go to admin panel)
- Verify API endpoint is working (`/api/featured`)
- Check browser console for errors

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Google Drive Direct Links Guide](https://sites.google.com/site/gdocs2direct/)
- [Next.js Image Optimization](https://nextjs.org/docs/pages/api-reference/components/image)

