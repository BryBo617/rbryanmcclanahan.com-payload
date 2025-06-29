# Email Security Configuration Guide

This guide outlines the email security implementation for your Payload CMS application using SendGrid.

## Security Features Implemented

### 1. Rate Limiting

- **Password Reset**: 3 attempts per 15 minutes per email
- **Email Verification**: 5 attempts per hour per email
- **General Emails**: 10 attempts per hour per email

### 2. Domain Validation

- Blocks disposable email domains (10minutemail, tempmail, etc.)
- Optional domain whitelist support
- Email format validation

### 3. Secure Transport

- TLS/SSL encryption enforced
- Connection pooling for performance
- Rate limiting at SendGrid level (14 emails/second)

### 4. Logging & Monitoring

- Security event logging
- Email health monitoring endpoint
- Admin notification system

## Environment Variables Required

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Your Site Name

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_API_TOKEN=your-secure-admin-token-here

# Optional: Email Templates (if using SendGrid templates)
EMAIL_TEMPLATE_RESET_PASSWORD=d-template-id-here
EMAIL_TEMPLATE_VERIFY_EMAIL=d-template-id-here

# Security Settings
ENABLE_EMAIL_DOMAIN_VALIDATION=true
ALLOWED_EMAIL_DOMAINS=yourdomain.com,gmail.com,outlook.com
```

## SendGrid Setup Checklist

### 1. Domain Authentication (DNS Records)

Make sure you've added these DNS records to GoDaddy:

**CNAME Records:**

- `s1._domainkey.yourdomain.com` → `s1.domainkey.u12345.wl123.sendgrid.net`
- `s2._domainkey.yourdomain.com` → `s2.domainkey.u12345.wl123.sendgrid.net`

**TXT Record:**

- `yourdomain.com` → `v=spf1 include:sendgrid.net ~all`

**Optional DMARC Record:**

- `_dmarc.yourdomain.com` → `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com`

### 2. SendGrid API Key Setup

1. Create a new API key in SendGrid dashboard
2. Set permissions to "Full Access" or specific mail send permissions
3. Store securely in environment variables

## Best Practices

### 1. Security Hardening

- **Never expose API keys** in client-side code
- **Use environment variables** for all sensitive configuration
- **Implement proper authentication** for admin endpoints
- **Monitor email sending patterns** for abuse
- **Set up alerts** for unusual activity

### 2. Email Content Security

- **Validate all email inputs** before sending
- **Use templating** to prevent injection attacks
- **Sanitize user-generated content** in emails
- **Include unsubscribe links** where required by law

### 3. Monitoring & Maintenance

- **Check email health** regularly using `/api/email-health`
- **Monitor SendGrid dashboard** for bounces and spam reports
- **Review rate limiting logs** for abuse patterns
- **Update disposable domain blocklist** periodically

## Usage Examples

### Basic Email Sending

```typescript
import { emailService } from '@/utilities/emailService'

// Send password reset
await emailService.sendPasswordReset(
  'user@example.com',
  'reset-token-here',
  req
)

// Send custom email
await emailService.sendGeneralEmail(
  'user@example.com',
  'Welcome!',
  {
    html: '<h1>Welcome to our platform!</h1>',
    text: 'Welcome to our platform!'
  },
  req
)
```

### Health Monitoring

```bash
# Check email health (requires admin token)
curl -H "Authorization: Bearer your-admin-token" \
     https://yourdomain.com/api/email-health

# Clear rate limits for a user
curl -X POST \
     -H "Authorization: Bearer your-admin-token" \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "type": "pwd_reset"}' \
     https://yourdomain.com/api/email-health
```

## Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Check SENDGRID_API_KEY is set correctly
   - Verify API key has mail send permissions

2. **"Domain not authenticated"**
   - Verify DNS records are properly configured
   - Allow 24-48 hours for DNS propagation

3. **"SSL routines: wrong version number" or "ESOCKET" errors**
   - This is a common TLS/SSL configuration issue
   - The configuration uses STARTTLS (port 587) instead of SSL (port 465)
   - If issues persist, temporarily set `rejectUnauthorized: false` for testing
   - Check if your hosting provider blocks certain ports

4. **"Rate limit exceeded"**
   - Use admin endpoint to clear rate limits
   - Check for suspicious activity

5. **"Email domain not allowed"**
   - Review domain validation settings
   - Add domain to whitelist if needed

6. **"Connection timeout" or "ECONNREFUSED"**
   - Check if port 587 is blocked by firewall
   - Try alternative SendGrid ports: 25, 2525
   - Verify network connectivity to smtp.sendgrid.net

### SendGrid Dashboard Checks

- **Activity Feed**: Monitor email sending activity
- **Suppressions**: Check bounced/unsubscribed emails
- **Statistics**: Monitor delivery rates
- **Alerts**: Set up notifications for issues

## Production Considerations

1. **Use Redis for rate limiting** instead of in-memory storage
2. **Implement proper logging** with tools like Winston
3. **Set up monitoring alerts** for email failures
4. **Configure backup email service** for critical emails
5. **Implement email queue** for high-volume sending
6. **Regular security audits** of email configuration

## Compliance

- **GDPR**: Ensure proper consent for marketing emails
- **CAN-SPAM**: Include unsubscribe links and sender information
- **Data Retention**: Configure email log retention policies
- **Privacy**: Don't log sensitive email content

Remember to test your email configuration thoroughly before going to production!
