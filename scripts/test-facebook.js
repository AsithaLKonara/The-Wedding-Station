#!/usr/bin/env node

/**
 * Test Facebook API Connection
 * 
 * Usage: node scripts/test-facebook.js
 * 
 * This script tests your Facebook API credentials
 * and shows you what posts will be fetched.
 */

require('dotenv').config({ path: '.env.local' });

const FB_PAGE_ID = process.env.FB_PAGE_ID;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

async function testConnection() {
  console.log('🔍 Testing Facebook API Connection...\n');

  // Check environment variables
  if (!FB_PAGE_ID) {
    console.error('❌ Error: FB_PAGE_ID is not set in .env.local');
    console.log('   Please add: FB_PAGE_ID="your_page_id"');
    process.exit(1);
  }

  if (!FB_ACCESS_TOKEN) {
    console.error('❌ Error: FB_ACCESS_TOKEN is not set in .env.local');
    console.log('   Please add: FB_ACCESS_TOKEN="your_access_token"');
    process.exit(1);
  }

  console.log(`✅ Page ID: ${FB_PAGE_ID}`);
  console.log(`✅ Access Token: ${FB_ACCESS_TOKEN.substring(0, 20)}...\n`);

  // Test 1: Verify token
  console.log('📡 Test 1: Verifying access token...');
  try {
    const tokenUrl = `${GRAPH_API_BASE}/me?access_token=${FB_ACCESS_TOKEN}`;
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error(`❌ Token Error: ${tokenData.error.message}`);
      if (tokenData.error.code === 190) {
        console.log('\n💡 Your token has expired. Please get a new token:');
        console.log('   1. Follow FACEBOOK_SETUP.md Step 4-6');
        console.log('   2. Update FB_ACCESS_TOKEN in .env.local');
      }
      process.exit(1);
    }
    console.log('✅ Token is valid!\n');
  } catch (error) {
    console.error(`❌ Error verifying token: ${error.message}`);
    process.exit(1);
  }

  // Test 2: Get page info
  console.log('📡 Test 2: Fetching page information...');
  try {
    const pageUrl = `${GRAPH_API_BASE}/${FB_PAGE_ID}?fields=name,id&access_token=${FB_ACCESS_TOKEN}`;
    const pageResponse = await fetch(pageUrl);
    const pageData = await pageResponse.json();

    if (pageData.error) {
      console.error(`❌ Page Error: ${pageData.error.message}`);
      if (pageData.error.code === 100) {
        console.log('\n💡 Invalid Page ID. Please check:');
        console.log('   1. Make sure you\'re using a Page ID, not a Profile ID');
        console.log('   2. Verify the Page ID in FACEBOOK_SETUP.md Step 1');
      }
      process.exit(1);
    }
    console.log(`✅ Page found: ${pageData.name} (${pageData.id})\n`);
  } catch (error) {
    console.error(`❌ Error fetching page: ${error.message}`);
    process.exit(1);
  }

  // Test 3: Fetch posts
  console.log('📡 Test 3: Fetching posts...');
  try {
    const postsUrl = `${GRAPH_API_BASE}/${FB_PAGE_ID}/posts?fields=id,message,created_time,permalink_url,attachments{media,type,target}&access_token=${FB_ACCESS_TOKEN}&limit=5`;
    const postsResponse = await fetch(postsUrl);
    const postsData = await postsResponse.json();

    if (postsData.error) {
      console.error(`❌ Posts Error: ${postsData.error.message}`);
      if (postsData.error.code === 200) {
        console.log('\n💡 Missing permissions. Please check:');
        console.log('   1. Make sure you selected pages_read_engagement permission');
        console.log('   2. Make sure you selected pages_read_user_content permission');
        console.log('   3. Follow FACEBOOK_SETUP.md Step 4');
      }
      process.exit(1);
    }

    const posts = postsData.data || [];
    console.log(`✅ Found ${posts.length} recent posts\n`);

    if (posts.length === 0) {
      console.log('⚠️  No posts found. This could mean:');
      console.log('   - Your page has no posts');
      console.log('   - Posts are not public');
      console.log('   - Posts don\'t have media (photos/videos)');
    } else {
      console.log('📸 Sample posts:');
      posts.slice(0, 3).forEach((post, index) => {
        console.log(`\n   ${index + 1}. Post ID: ${post.id}`);
        console.log(`      Created: ${post.created_time}`);
        if (post.message) {
          const message = post.message.substring(0, 50);
          console.log(`      Message: ${message}${post.message.length > 50 ? '...' : ''}`);
        }
        if (post.attachments?.data?.[0]) {
          const attachment = post.attachments.data[0];
          console.log(`      Type: ${attachment.type}`);
        }
      });
    }
  } catch (error) {
    console.error(`❌ Error fetching posts: ${error.message}`);
    process.exit(1);
  }

  // Success!
  console.log('\n🎉 All tests passed! Your Facebook connection is working.');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure your dev server is running: npm run dev');
  console.log('   2. Visit: http://localhost:3000');
  console.log('   3. Check the Gallery section for your Facebook photos');
  console.log('   4. Visit: http://localhost:3000/admin to manually refresh posts');
}

testConnection().catch(console.error);

