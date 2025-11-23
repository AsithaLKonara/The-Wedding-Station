# The Wedding Station - Portfolio Website

A modern, responsive portfolio website for a photographer/videographer built with Next.js, TypeScript, and Tailwind CSS. The site automatically syncs and displays Facebook posts (photos and videos) from a Facebook Page.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Facebook Integration**: Automatic sync of posts from Facebook Page
- **Gallery**: Masonry-style photo gallery with lightbox
- **Video Reel**: Responsive video player with thumbnails
- **Contact Form**: Server-side email sending via SendGrid or SMTP
- **Performance Optimized**: Lighthouse score optimizations, lazy loading, ISR
- **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels
- **TypeScript**: Full type safety throughout the application
- **Testing**: Unit and integration tests with Jest and React Testing Library

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Facebook Developer Account (for Facebook API access)
- SendGrid account OR SMTP server (for contact form)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AsithaLKonara/The-Wedding-Station.git
   cd The-Wedding-Station
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and fill in your configuration (see [Environment Variables](#environment-variables) section).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_TITLE="The Wedding Station"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# Facebook API Configuration
FB_PAGE_ID="100046893432179"
FB_ACCESS_TOKEN="your_long_lived_access_token"
FB_CACHE_TTL_SECONDS=900

# Email Configuration (Choose one)
# Option 1: SendGrid
SENDGRID_API_KEY="your_sendgrid_api_key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
CONTACT_EMAIL="contact@yourdomain.com"

# Option 2: SMTP
SMTP_URL="smtp://user:pass@smtp.example.com:587"

# Optional: Redis Cache
REDIS_URL="redis://localhost:6379"

# Node Environment
NODE_ENV="development"
```

### Environment Variable Descriptions

- `NEXT_PUBLIC_SITE_TITLE`: The site title displayed in the header and metadata
- `NEXT_PUBLIC_BASE_URL`: Your production URL (used for oEmbed/fallback)
- `FB_PAGE_ID`: Your Facebook Page ID (numeric or username)
- `FB_ACCESS_TOKEN`: Long-lived Page Access Token (see [Facebook Setup](#facebook-setup))
- `FB_CACHE_TTL_SECONDS`: Cache TTL in seconds (default: 900 = 15 minutes)
- `SENDGRID_API_KEY`: SendGrid API key for email sending
- `SENDGRID_FROM_EMAIL`: Email address to send from (must be verified in SendGrid)
- `CONTACT_EMAIL`: Email address to receive contact form submissions
- `SMTP_URL`: Alternative to SendGrid - SMTP connection string
- `REDIS_URL`: Optional Redis URL for distributed caching (falls back to in-memory)

## 📘 Facebook Setup

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in app details and create the app

### Step 2: Add Facebook Login Product

1. In your app dashboard, go to "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Add "www" to Valid OAuth Redirect URIs (if needed)

### Step 3: Get Page Access Token

#### Option A: Using Graph API Explorer (Quick Start)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click "Generate Access Token"
4. Select permissions: `pages_read_engagement`, `pages_read_user_content`
5. Copy the short-lived token

#### Option B: Using Graph API (Recommended for Production)

1. Get a User Access Token with `pages_read_engagement` permission
2. Exchange it for a Page Access Token:

```bash
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token=USER_ACCESS_TOKEN"
```

3. Find your page in the response and copy the `access_token` field

### Step 4: Exchange for Long-Lived Token

Short-lived tokens expire in 1-2 hours. Exchange for a long-lived token (60 days):

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

**Note**: For even longer-lived tokens (no expiration), you can:
1. Set up a Facebook App with App Review
2. Request `pages_read_engagement` permission
3. Use the Page Access Token directly (doesn't expire if page admin doesn't revoke)

### Step 5: Get Your Page ID

1. Go to your Facebook Page
2. Click "About" → find "Page ID" (or use the numeric ID from the URL)
3. Copy the ID to `FB_PAGE_ID` in your `.env.local`

### Required Permissions

- `pages_read_engagement`: Read engagement data
- `pages_read_user_content`: Read posts and content from the page

### Important Notes

- **Personal Profiles**: The Graph API has limited access to personal profile posts. **We recommend converting to a Facebook Page** for full functionality.
- **Page vs Profile**: If using a personal profile, you'll need to create a Page and link it, or use alternative methods (see [Fallback Options](#fallback-options)).

## 🔄 Facebook Sync — Troubleshooting

### Token Refresh

If you see errors like "Invalid OAuth access token":

1. **Check token expiration**: Long-lived tokens expire after 60 days
2. **Regenerate token**: Follow [Step 4](#step-4-exchange-for-long-lived-token) above
3. **Update `.env.local`**: Replace `FB_ACCESS_TOKEN` with the new token
4. **Restart server**: Restart your Next.js server to load the new token

### Common Graph API Errors

#### Error: "Invalid OAuth access token"
- **Cause**: Token expired or invalid
- **Solution**: Generate a new token (see [Token Refresh](#token-refresh))

#### Error: "Unsupported get request"
- **Cause**: Trying to access a personal profile instead of a Page
- **Solution**: Convert profile to Page or use Page ID instead

#### Error: "Insufficient permissions"
- **Cause**: Missing required permissions
- **Solution**: Ensure `pages_read_engagement` and `pages_read_user_content` are granted

#### Error: "Rate limit exceeded"
- **Cause**: Too many API calls
- **Solution**: Increase `FB_CACHE_TTL_SECONDS` to reduce API calls

### Converting Profile to Page

If you're using a personal Facebook profile:

1. Go to [Facebook Pages](https://www.facebook.com/pages/create)
2. Choose "Business or Brand"
3. Enter your business name and category
4. Complete the setup
5. Use the new Page ID in `FB_PAGE_ID`

### Fallback Options

If Facebook Graph API is unavailable:

1. **Manual Upload**: Use the admin interface to manually add posts
2. **Facebook Embed**: Use Facebook's oEmbed API for individual posts
3. **RSS Feed**: If available, use Facebook Page RSS feed
4. **Manual JSON**: Create a JSON file with post data and import it

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- `components/__tests__/`: Component unit tests
- `lib/__tests__/`: Utility function tests
- `app/api/__tests__/`: API route integration tests

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy after adding variables

4. **ISR Configuration**
   - The site uses ISR (Incremental Static Regeneration)
   - Facebook posts are cached server-side
   - Set `revalidate` in `next.config.js` if needed

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Add all from `.env.local`
4. **Scheduled Functions**: Use Netlify Scheduled Functions for cache refresh

### Self-Hosting

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Use a process manager** (PM2 recommended)
   ```bash
   npm install -g pm2
   pm2 start npm --name "wedding-station" -- start
   ```

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── fb/
│   │   │   └── fetch/          # Facebook posts API
│   │   └── contact/            # Contact form API
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/
│   ├── __tests__/              # Component tests
│   ├── About.tsx               # About section
│   ├── ContactForm.tsx         # Contact form
│   ├── Footer.tsx               # Footer
│   ├── Gallery.tsx              # Photo gallery
│   ├── Hero.tsx                 # Hero section
│   ├── Lightbox.tsx             # Image lightbox
│   ├── MediaCard.tsx            # Media card component
│   ├── PostFeed.tsx             # Facebook post feed
│   └── VideoReel.tsx            # Video reel section
├── lib/
│   ├── __tests__/              # Library tests
│   ├── cache.ts                # Caching abstraction
│   └── fb.ts                   # Facebook API integration
├── types/
│   └── index.ts                # TypeScript type definitions
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
└── public/                     # Static assets
```

## 🎨 Customization

### Styling

- **Tailwind CSS**: All styles use Tailwind utility classes
- **Colors**: Modify `tailwind.config.ts` to change color scheme
- **Fonts**: Update `app/layout.tsx` to change fonts

### Content

- **Site Title**: Update `NEXT_PUBLIC_SITE_TITLE` in `.env.local`
- **About Section**: Edit `components/About.tsx`
- **Hero Text**: Edit `components/Hero.tsx`

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check formatting

# Testing
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## 📝 Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example:
```bash
git commit -m "feat: add dark mode toggle"
```

## 🐛 Known Issues

- Facebook API rate limits may affect frequent refreshes
- Personal profiles have limited Graph API access (use Pages instead)
- Video thumbnails may not always be available from Facebook

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api) - Social media integration

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [Troubleshooting](#facebook-sync--troubleshooting) section
- Review Facebook API documentation

---

**Built with ❤️ for The Wedding Station**

