# Quick Start Guide

Get The Wedding Station up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add at minimum:

```env
NEXT_PUBLIC_SITE_TITLE="The Wedding Station"
FB_PAGE_ID="100046893432179"
FB_ACCESS_TOKEN="your_token_here"
```

## 3. Get Facebook Access Token (Quick Method)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app (or create one)
3. Click "Generate Access Token"
4. Select permissions: `pages_read_engagement`, `pages_read_user_content`
5. Copy the token to `.env.local`

**Note**: This token expires in 1-2 hours. For production, exchange it for a long-lived token (see README.md).

## 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 5. Test the Contact Form (Optional)

Add to `.env.local`:

```env
SENDGRID_API_KEY="your_sendgrid_key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
CONTACT_EMAIL="contact@yourdomain.com"
```

Or use SMTP:

```env
SMTP_URL="smtp://user:pass@smtp.example.com:587"
```

## Troubleshooting

### Facebook Posts Not Showing?

1. Check `FB_PAGE_ID` is correct (use numeric ID, not username)
2. Verify `FB_ACCESS_TOKEN` is valid (not expired)
3. Check browser console for errors
4. Check server logs for API errors

### Contact Form Not Working?

1. Verify email service is configured (SendGrid or SMTP)
2. Check environment variables are set correctly
3. For SendGrid: verify sender email is verified in SendGrid dashboard

### Build Errors?

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Set up long-lived Facebook token for production
- Configure CI/CD pipeline
- Deploy to Vercel or your preferred platform

