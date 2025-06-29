#!/usr/bin/env node

// Script to identify required environment variables for production deployment

console.log('🔍 Required Environment Variables for Production Deployment\n');

const requiredVars = [
  // Core Payload Configuration
  { name: 'PAYLOAD_SECRET', description: 'Secret key to secure Payload CMS (required for build)' },
  { name: 'NEXT_PUBLIC_SERVER_URL', description: 'Your production domain URL' },

  // Database Configuration
  { name: 'DATABASE_URI', description: 'Database connection string (if using MongoDB)' },
  { name: 'DATABASE_URL', description: 'Database connection string (if using PostgreSQL)' },
  { name: 'POSTGRES_URL', description: 'PostgreSQL connection string for Neon/Vercel' },

  // Email Configuration (SendGrid)
  { name: 'SENDGRID_API_KEY', description: 'SendGrid API key for email functionality' },
  { name: 'SENDGRID_FROM_EMAIL', description: 'Verified sender email address' },
  { name: 'SENDGRID_FROM_NAME', description: 'Sender name for emails' },

  // Admin Configuration
  { name: 'ADMIN_EMAIL', description: 'Admin email address' },

  // Cloud Storage (if using)
  { name: 'R2_ACCESS_KEY_ID', description: 'Cloudflare R2 access key (if using cloud storage)' },
  {
    name: 'R2_SECRET_ACCESS_KEY',
    description: 'Cloudflare R2 secret key (if using cloud storage)',
  },
  { name: 'R2_BUCKET_NAME', description: 'Cloudflare R2 bucket name (if using cloud storage)' },
  { name: 'R2_ACCOUNT_ID', description: 'Cloudflare R2 account ID (if using cloud storage)' },

  // Preview/Security
  { name: 'PREVIEW_SECRET', description: 'Secret for preview functionality' },
];

console.log('📋 Copy these environment variables to your Vercel project settings:\n');
console.log(
  'Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables\n',
);

requiredVars.forEach(({ name, description }) => {
  console.log(`${name}=`);
  console.log(`  # ${description}`);
  console.log('');
});

console.log('\n⚠️  IMPORTANT NOTES:');
console.log('1. Use strong random values for secrets (PAYLOAD_SECRET, PREVIEW_SECRET)');
console.log(
  '2. Set NEXT_PUBLIC_SERVER_URL to your production domain (e.g., https://yourdomain.com)',
);
console.log('3. Make sure all secrets are kept secure and never committed to version control');
console.log('4. Test your build locally with production environment variables first');

console.log('\n🔗 Useful links:');
console.log(
  '• Vercel Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables',
);
console.log(
  '• Payload Environment Variables: https://payloadcms.com/docs/configuration/environment-variables',
);
