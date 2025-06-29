import { PayloadRequest } from 'payload';
import { emailTemplates, sendEmail } from './email';

// Rate limiting configuration
const EMAIL_RATE_LIMITS = {
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  EMAIL_VERIFICATION: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  GENERAL: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};

// In-memory rate limiting store (consider using Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting helper
const checkRateLimit = (key: string, limit: { maxAttempts: number; windowMs: number }): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + limit.windowMs });
    return true;
  }

  if (record.count >= limit.maxAttempts) {
    return false;
  }

  record.count++;
  return true;
};

// Security helper to validate email domains
const isValidEmailDomain = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();

  if (!domain) {
    return false;
  }

  // Block common disposable email domains
  const disposableDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'temp-mail.org',
    // Add more as needed
  ];

  if (disposableDomains.includes(domain)) {
    return false;
  }

  // Add domain whitelist if needed
  // const allowedDomains = ['gmail.com', 'outlook.com', 'yourdomain.com']
  // return allowedDomains.includes(domain)

  return true;
};

// Secure email service functions
export const emailService = {
  // Send password reset email with security checks
  sendPasswordReset: async (email: string, resetToken: string, req?: PayloadRequest) => {
    const rateLimitKey = `pwd_reset:${email}`;

    if (!checkRateLimit(rateLimitKey, EMAIL_RATE_LIMITS.PASSWORD_RESET)) {
      throw new Error('Too many password reset attempts. Please try again later.');
    }

    if (!isValidEmailDomain(email)) {
      throw new Error('Email domain not allowed');
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/reset-password?token=${resetToken}`;
    const template = emailTemplates.passwordReset(resetUrl);

    // Log security event
    console.log(`Password reset requested for: ${email}`, {
      userAgent: req?.headers?.get('user-agent'),
      timestamp: new Date().toISOString(),
    });

    return await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  },

  // Send email verification with security checks
  sendEmailVerification: async (email: string, verifyToken: string, req?: PayloadRequest) => {
    const rateLimitKey = `email_verify:${email}`;

    if (!checkRateLimit(rateLimitKey, EMAIL_RATE_LIMITS.EMAIL_VERIFICATION)) {
      throw new Error('Too many verification attempts. Please try again later.');
    }

    if (!isValidEmailDomain(email)) {
      throw new Error('Email domain not allowed');
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/verify-email?token=${verifyToken}`;
    const template = emailTemplates.emailVerification(verifyUrl);

    // Log security event
    console.log(`Email verification sent to: ${email}`, {
      userAgent: req?.headers?.get('user-agent'),
      timestamp: new Date().toISOString(),
    });

    return await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  },

  // Send general email with rate limiting
  sendGeneralEmail: async (
    to: string | string[],
    subject: string,
    content: { html?: string; text?: string },
    req?: PayloadRequest,
  ) => {
    const recipients = Array.isArray(to) ? to : [to];

    // Check rate limits for each recipient
    for (const email of recipients) {
      const rateLimitKey = `general:${email}`;
      if (!checkRateLimit(rateLimitKey, EMAIL_RATE_LIMITS.GENERAL)) {
        throw new Error(`Rate limit exceeded for recipient: ${email}`);
      }

      if (!isValidEmailDomain(email)) {
        throw new Error(`Email domain not allowed: ${email}`);
      }
    }

    // Log email send event
    console.log(`General email sent to: ${recipients.join(', ')}`, {
      subject,
      userAgent: req?.headers?.get('user-agent'),
      timestamp: new Date().toISOString(),
    });

    return await sendEmail({
      to,
      subject,
      html: content.html,
      text: content.text,
    });
  },

  // Admin notification email (for critical events)
  sendAdminNotification: async (
    subject: string,
    message: string,
    additionalData?: Record<string, unknown>,
  ) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('Admin email not configured for notifications');
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #dc3545;">Security Alert</h2>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        ${
          additionalData
            ? `
          <h3>Additional Information:</h3>
          <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto;">
${JSON.stringify(additionalData, null, 2)}
          </pre>
        `
            : ''
        }
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </div>
    `;

    return await sendEmail({
      to: adminEmail,
      subject: `[SECURITY ALERT] ${subject}`,
      html,
      text: `Security Alert: ${subject}\n\n${message}\n\nTimestamp: ${new Date().toISOString()}`,
    });
  },
};

// Email monitoring and health check
export const emailMonitoring = {
  // Test email configuration
  testEmailConfig: async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        return { success: false, error: 'SendGrid API key not configured' };
      }

      if (!process.env.SENDGRID_FROM_EMAIL) {
        return { success: false, error: 'SendGrid from email not configured' };
      }

      // Test with a simple email
      await sendEmail({
        to: process.env.SENDGRID_FROM_EMAIL, // Send to self for testing
        subject: 'Email Configuration Test',
        text: 'This is a test email to verify SendGrid configuration.',
        html: '<p>This is a test email to verify SendGrid configuration.</p>',
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Clear rate limit for specific email (admin function)
  clearRateLimit: (email: string, type?: 'pwd_reset' | 'email_verify' | 'general') => {
    if (type) {
      rateLimitStore.delete(`${type}:${email}`);
    } else {
      // Clear all rate limits for this email
      const keys = Array.from(rateLimitStore.keys()).filter((key) => key.endsWith(`:${email}`));
      keys.forEach((key) => rateLimitStore.delete(key));
    }
  },

  // Get rate limit status
  getRateLimitStatus: (email: string) => {
    const results: Record<string, { count: number; resetTime: number; remaining: number }> = {};

    for (const [type, limit] of Object.entries(EMAIL_RATE_LIMITS)) {
      const key = `${type.toLowerCase()}:${email}`;
      const record = rateLimitStore.get(key);

      if (record && Date.now() <= record.resetTime) {
        results[type] = {
          count: record.count,
          resetTime: record.resetTime,
          remaining: Math.max(0, limit.maxAttempts - record.count),
        };
      } else {
        results[type] = {
          count: 0,
          resetTime: 0,
          remaining: limit.maxAttempts,
        };
      }
    }

    return results;
  },
};
