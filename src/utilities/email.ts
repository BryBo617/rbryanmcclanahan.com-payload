import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import nodemailer from 'nodemailer';

// Validate required environment variables
const requiredEnvVars = ['SENDGRID_API_KEY', 'SENDGRID_FROM_EMAIL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} environment variable is not set`);
  }
}

// Create SendGrid transporter configuration
const getSendGridTransportOptions = () => {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not found. Email functionality will be disabled.');
    return undefined;
  }

  return {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // Use STARTTLS (port 587) instead of SSL (port 465)
    auth: {
      user: 'apikey', // This is literally 'apikey' for SendGrid
      pass: process.env.SENDGRID_API_KEY,
    },
    // Security configurations
    requireTLS: true,
    tls: {
      rejectUnauthorized: false, // Temporarily set to false for testing
    },
    // Connection pool settings for better performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    // Rate limiting
    rateLimit: 14, // 14 emails per second (SendGrid's limit is 15/sec)
  };
};

// Alternative SendGrid configurations for troubleshooting
const _getAlternativeSendGridOptions = () => {
  if (!process.env.SENDGRID_API_KEY) {
    return undefined;
  }

  // Configuration options in order of preference
  const configs = [
    // Option 1: Standard STARTTLS (port 587) - Most common
    {
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY },
      requireTLS: true,
      tls: { rejectUnauthorized: false }, // Less strict for compatibility
    },
    // Option 2: Alternative port for restrictive networks
    {
      host: 'smtp.sendgrid.net',
      port: 2525,
      secure: false,
      auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY },
      requireTLS: true,
      tls: { rejectUnauthorized: false },
    },
    // Option 3: SSL port (less common but sometimes needed)
    {
      host: 'smtp.sendgrid.net',
      port: 465,
      secure: true,
      auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY },
      tls: { rejectUnauthorized: false },
    },
  ];

  // Return the first config for now, but you can iterate through them if needed
  return configs[0];
};

// Create SendGrid transporter instance for direct use
const createSendGridTransporter = () => {
  const options = getSendGridTransportOptions();
  if (!options) {
    return null;
  }

  return nodemailer.createTransport(options);
};

// Default email configuration for Payload
export const emailConfig = nodemailerAdapter({
  defaultFromAddress: process.env.SENDGRID_FROM_EMAIL || 'noreply@localhost',
  defaultFromName: process.env.SENDGRID_FROM_NAME || 'Your Site',

  // Use SendGrid transport options
  transportOptions: getSendGridTransportOptions(),
});

// Helper function to send custom emails with proper error handling
export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  from,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}) => {
  const transporter = createSendGridTransporter();

  if (!transporter) {
    throw new Error('Email transporter not configured');
  }

  try {
    const result = await transporter.sendMail({
      from: from || process.env.SENDGRID_FROM_EMAIL,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text,
      replyTo,
      // Security headers
      headers: {
        'X-Mailer': 'Payload CMS',
        'X-Priority': '3',
      },
    });

    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// Email template helpers
export const emailTemplates = {
  // Password reset template
  passwordReset: (resetUrl: string, userName?: string) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello${userName ? ` ${userName}` : ''},</p>
        <p>You requested a password reset for your account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="background-color: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
      </div>
    `,
    text: `
      Password Reset Request

      Hello${userName ? ` ${userName}` : ''},

      You requested a password reset for your account.
      Please visit the following link to reset your password:

      ${resetUrl}

      If you didn't request this password reset, please ignore this email.
      This link will expire in 1 hour for security reasons.
    `,
  }),

  // Email verification template
  emailVerification: (verifyUrl: string, userName?: string) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email Address</h2>
        <p>Hello${userName ? ` ${userName}` : ''},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}"
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If you didn't create this account, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verifyUrl}">${verifyUrl}</a>
        </p>
      </div>
    `,
    text: `
      Verify Your Email Address

      Hello${userName ? ` ${userName}` : ''},

      Please verify your email address by visiting the following link:

      ${verifyUrl}

      If you didn't create this account, please ignore this email.
    `,
  }),
};
