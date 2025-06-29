# R2 Configuration Guide

## Current Issue

Your R2 images are failing with 400 errors because the URLs include the bucket name in the path, which is not valid for R2 public URLs.

Error: `⨯ upstream image response failed for https://60c6cdbc9b1162a5dc26e53cbdb7d54e.r2.cloudflarestorage.com/rbryanmcclanahan/hero_banner.png`

## Root Cause

The current `R2_PUBLIC_URL` is set to the R2 API endpoint (`https://60c6cdbc9b1162a5dc26e53cbdb7d54e.r2.cloudflarestorage.com`), but R2 doesn't serve public files through this endpoint when the bucket name is in the path.

## Solutions

### Option 1: Set up a Custom Domain (Recommended for Production)

1. In Cloudflare R2 dashboard, go to your bucket settings
2. Set up a custom domain (e.g., `media.rbryanmcclanahan.com`)
3. Update your DNS to point the domain to R2
4. Update `.env.production.example`:

   ```env
   R2_PUBLIC_URL="https://media.rbryanmcclanahan.com"
   ```

### Option 2: Use R2 Public Bucket URL

1. In Cloudflare R2 dashboard:
   - Go to your `rbryanmcclanahan` bucket
   - Go to Settings → Public access
   - Enable "Allow Access" and note the public URL format
   - You'll get a URL like `https://pub-{hash}.r2.dev`

2. Update `.env.production.example`:

   ```env
   R2_PUBLIC_URL="https://pub-{actual-hash}.r2.dev"
   ```

### Option 3: Disable R2 Public Access (Fallback)

If public access can't be configured, you can serve images through Payload:

1. In `src/plugins/index.ts`, remove `disablePayloadAccessControl: true`
2. Images will be served through your app instead of directly from R2

## Testing

After configuring R2 public access:

1. Test a direct URL: `{R2_PUBLIC_URL}/hero_banner.png`
2. If it works, rebuild and deploy your app
3. Images should load correctly

## Current Configuration

The hook in `src/hooks/r2MediaUrl.ts` will automatically transform URLs to use the correct public URL format once `R2_PUBLIC_URL` is properly configured.
