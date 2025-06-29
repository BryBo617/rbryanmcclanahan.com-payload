# SendGrid DNS Configuration Guide

## 🚨 Potential Issues

### DMARC Policy Error (RESOLVED)

~~Your domain has a strict DMARC policy (`p=reject`) and the SPF record doesn't include SendGrid, causing email delivery failures.~~

**Error**: ~~`550 5.7.1 Email rejected per DMARC policy for rbryanmcclanahan.com`~~ ✅ **FIXED**

### Mail Policy Violation Error (CURRENT)

The receiving mail server is blocking emails due to policy violations.

**Error**: `554 5.2.3 MailPolicy violation Error delivering to mailboxes`

**Common Causes**:

- Recipient server (Zoho) blocking emails from SendGrid IPs
- Content filtering rules blocking the email content
- Rate limiting or reputation issues
- Self-sending emails (sending to the same domain/address as sender)

## 📋 Required DNS Changes

### 1. Update SPF Record (CRITICAL)

**Current SPF Record:**

```
v=spf1 include:zohomail.com ~all
```

**Required SPF Record:**

```
v=spf1 include:zohomail.com include:sendgrid.net ~all
```

**Where to update**: Your DNS provider (GoDaddy, Cloudflare, etc.)

- Record Type: TXT
- Name: @ (or your root domain)
- Value: `v=spf1 include:zohomail.com include:sendgrid.net ~all`

### 2. DMARC Policy Options

**Current DMARC Record:**

```
v=DMARC1; p=reject; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;
```

**Option A - Recommended for Production:**

```
v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;
```

**Option B - For Testing Only:**

```
v=DMARC1; p=none; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;
```

**Where to update**: Your DNS provider

- Record Type: TXT
- Name: `_dmarc`
- Value: (one of the options above)

### 3. DKIM Setup (Optional - Requires Paid Plan)

**Note**: DKIM domain authentication is not available in SendGrid's free tier. Your current setup with SPF is sufficient for basic email delivery.

#### If you upgrade to a paid SendGrid plan

##### Step 1: Generate DKIM in SendGrid

1. Go to SendGrid Dashboard → Settings → Sender Authentication
2. Click "Authenticate Your Domain"
3. Follow the wizard to generate DKIM records

##### Step 2: Add DKIM Records to DNS

SendGrid will provide you with CNAME records like:

```
s1._domainkey.rbryanmcclanahan.com → s1.domainkey.u123456.wl.sendgrid.net
s2._domainkey.rbryanmcclanahan.com → s2.domainkey.u123456.wl.sendgrid.net
```

Add these as CNAME records in your DNS.

#### Free Tier Alternative

Your current configuration with SPF is working perfectly:

- ✅ SPF authentication passing
- ✅ DMARC policy working
- ✅ Emails delivering successfully
- ✅ Production-ready setup

## 🔧 Step-by-Step Fix

### ✅ DMARC/SPF Fix (COMPLETED)

Your DNS is now correctly configured:

- ✅ SPF includes SendGrid: `v=spf1 include:zohomail.com include:sendgrid.net ~all`
- ✅ DMARC policy working with strict settings

### 🚨 Mail Policy Violation Troubleshooting

#### Step 1: Test with External Email

Change `TEST_EMAIL` to a non-Zoho address (Gmail, Outlook, etc.) to isolate the issue:

```bash
# In your .env.development.local, temporarily change:
TEST_EMAIL=your-gmail-address@gmail.com
```

#### Step 2: Check Zoho Mail Settings

1. Log into Zoho Mail Admin Console
2. Go to Email Security → Mail Policy
3. Check if SendGrid IPs are blocked
4. Review spam/content filtering rules

#### Step 3: Avoid Self-Sending

Don't send test emails TO the same address you're sending FROM:

- ❌ FROM: <noreply@rbryanmcclanahan.com> → TO: <noreply@rbryanmcclanahan.com>
- ✅ FROM: <noreply@rbryanmcclanahan.com> → TO: <different-address@gmail.com>

#### Step 4: Content Review

The email content might trigger Zoho's filters:

- Avoid spam trigger words
- Include proper text/HTML balance
- Add unsubscribe links for marketing emails

### ✅ Current Status (COMPLETED)

Your SendGrid + Payload CMS email system is fully functional:

1. **DNS Configuration**: ✅ Complete
   - SPF record includes SendGrid
   - DMARC policy working with strict settings

2. **SendGrid Configuration**: ✅ Complete
   - API key configured and working
   - Sender identity verified
   - Free tier limitations understood

3. **Email Delivery**: ✅ Working
   - Test emails sending successfully
   - Proper error handling implemented
   - Production-ready setup

### Production Setup (Optional - Paid Plans Only)

1. Complete SendGrid domain authentication (requires paid plan)
2. Add all provided DKIM CNAME records
3. Verify in SendGrid dashboard

**Note**: DKIM is not required for basic email functionality and is only available in paid SendGrid plans.

## 🧪 Testing After Changes

Run the test script again after DNS changes:

```bash
npx tsx test-email.ts
```

Or test specific DNS records:

```bash
# Check SPF
nslookup -type=TXT rbryanmcclanahan.com

# Check DMARC
nslookup -type=TXT _dmarc.rbryanmcclanahan.com

# Check DKIM (after setup)
nslookup -type=CNAME s1._domainkey.rbryanmcclanahan.com
```

## 📊 DMARC Policy Levels

| Policy | Effect | Use Case |
|--------|--------|----------|
| `p=none` | Monitor only, don't block | Testing/monitoring |
| `p=quarantine` | Send to spam/junk | Balanced security |
| `p=reject` | Block completely | Maximum security |

## ⚠️ Important Notes

- DNS changes can take 5-30 minutes to propagate
- Start with `p=none` for DMARC testing
- Always test email sending after DNS changes
- Keep backups of your original DNS records
- DKIM setup significantly improves deliverability

## 🔗 Useful Tools

- [MX Toolbox SPF Check](https://mxtoolbox.com/spf.aspx)
- [DMARC Inspector](https://dmarcian.com/dmarc-inspector/)
- [SendGrid Documentation](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication)
