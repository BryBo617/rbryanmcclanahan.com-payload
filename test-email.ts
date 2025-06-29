import dotenv from 'dotenv';

// Load environment variables FIRST before importing any modules
dotenv.config({ path: '.env.development.local' });
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Now import after environment variables are loaded
import { emailMonitoring, emailService } from './src/utilities/emailService';

// Simple test script to verify email configuration
async function testEmailSetup(): Promise<void> {
  console.log('🧪 Testing Email Configuration...\n');

  // Debug: Show loaded environment variables
  console.log('🔍 Debug - Environment Variables:');
  console.log(
    'SENDGRID_API_KEY:',
    process.env.SENDGRID_API_KEY
      ? '✅ Set (starts with: ' + process.env.SENDGRID_API_KEY.substring(0, 10) + '...)'
      : '❌ Not set',
  );
  console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || '❌ Not set');
  console.log('SENDGRID_FROM_NAME:', process.env.SENDGRID_FROM_NAME || '❌ Not set');
  console.log('TEST_EMAIL:', process.env.TEST_EMAIL || '❌ Not set');

  // Warning about self-sending
  if (process.env.TEST_EMAIL && process.env.SENDGRID_FROM_EMAIL) {
    const testEmailDomain = process.env.TEST_EMAIL.split('@')[1];
    const fromEmailDomain = process.env.SENDGRID_FROM_EMAIL.split('@')[1];
    if (testEmailDomain === fromEmailDomain) {
      console.log(
        '⚠️  WARNING: Sending to same domain as sender - may trigger mail policy violations',
      );
    }
  }
  console.log('');

  // Test 1: Check configuration
  console.log('1. Checking configuration...');
  const healthCheck = await emailMonitoring.testEmailConfig();

  if (healthCheck.success) {
    console.log('✅ Email configuration is healthy');
  } else {
    console.log('❌ Email configuration failed:', healthCheck.error);
    // Don't return, let's continue to see what we can learn
  }

  // Test 2: Check environment variables
  console.log('\n2. Checking environment variables...');
  const requiredVars: string[] = [
    'SENDGRID_API_KEY',
    'SENDGRID_FROM_EMAIL',
    'NEXT_PUBLIC_SERVER_URL',
  ];

  let allVarsPresent = true;
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: configured`);
    } else {
      console.log(`❌ ${varName}: missing`);
      allVarsPresent = false;
    }
  }

  if (!allVarsPresent) {
    console.log('\n❌ Please configure missing environment variables before proceeding.');
    return;
  }

  // Test 3: Send test email (optional)
  if (process.env.TEST_EMAIL) {
    console.log('\n3. Sending test email...');
    try {
      await emailService.sendGeneralEmail(process.env.TEST_EMAIL, 'Email Configuration Test', {
        html: '<h2>🎉 Email Configuration Test</h2><p>If you receive this email, your SendGrid configuration is working correctly!</p>',
        text: '🎉 Email Configuration Test\n\nIf you receive this email, your SendGrid configuration is working correctly!',
      });
      console.log('✅ Test email sent successfully');
    } catch (error: unknown) {
      const err = error as Error & {
        code?: string;
        response?: { status?: number; body?: unknown };
      };
      console.log('❌ Failed to send test email:');
      console.log('Error message:', err.message);
      console.log('Error code:', err.code);
      if (err.response) {
        console.log('Response status:', err.response.status);
        console.log('Response body:', err.response.body);
      }

      // Check for specific error types
      if (err.message && err.message.includes('DMARC')) {
        console.log('\n🚨 DMARC Policy Issue Detected!');
        console.log('📋 Solution: Update your DNS records to include SendGrid.');
        console.log('📖 See SENDGRID_DNS_SETUP.md for detailed instructions.');
      } else if (err.message && err.message.includes('MailPolicy violation')) {
        console.log('\n🚨 Mail Policy Violation Detected!');
        console.log('📋 This often happens when sending to the same domain as the sender.');
        console.log('💡 Solution: Change TEST_EMAIL to a different domain (Gmail, Outlook, etc.)');
        console.log('📖 See SENDGRID_DNS_SETUP.md for detailed troubleshooting.');
      }
    }
  } else {
    console.log('\n3. Skipping test email (set TEST_EMAIL environment variable to enable)');
  }

  console.log('\n🎉 Email setup test completed!');
  process.exit(0);
}

// Run the test
testEmailSetup().catch((error: Error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
