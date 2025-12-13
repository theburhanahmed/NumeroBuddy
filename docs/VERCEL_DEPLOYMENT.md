# Vercel Frontend Deployment Guide

Complete guide for deploying the NumerAI Next.js frontend to Vercel.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Deploying to Vercel](#deploying-to-vercel)
4. [Environment Variables](#environment-variables)
5. [Custom Domain Configuration](#custom-domain-configuration)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Troubleshooting](#troubleshooting)
8. [CI/CD Integration](#cicd-integration)

---

## Prerequisites

### Required Accounts & Services

- **Vercel Account**: Sign up at https://vercel.com
- **GitHub Account**: Your code must be in a GitHub repository
- **DigitalOcean Backend**: Backend API must be deployed and accessible
- **Domain Name** (optional): For custom domain setup

### Required Information

Before starting, gather:
- GitHub repository URL
- DigitalOcean backend API URL (e.g., `https://api.yourdomain.com/api/v1`)
- Custom domain (if using)
- Backend CORS configuration (must allow your Vercel domain)

---

## Initial Setup

### Step 1: Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Install Vercel CLI (Optional)

For easier management, install Vercel CLI:

```bash
npm install -g vercel
```

Authenticate:

```bash
vercel login
```

---

## Deploying to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Navigate to Vercel**:
   - Go to https://vercel.com
   - Sign in with your GitHub account

2. **Create New Project**:
   - Click **"Add New..."** → **"Project"**
   - Select your GitHub repository (`theburhanahmed/NumerAI`)
   - Click **"Import"**

3. **Configure Project Settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Set Environment Variables**:
   - Click **"Environment Variables"**
   - Add `NEXT_PUBLIC_API_URL` with your backend API URL
   - Example: `https://api.yourdomain.com/api/v1`
   - Select environments: Production, Preview, Development
   - Click **"Save"**

5. **Deploy**:
   - Click **"Deploy"**
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Using Vercel CLI

1. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Link Project**:
   ```bash
   vercel link
   ```
   - Follow prompts to select/create project
   - Select scope and project name

3. **Set Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```
   - Enter your backend API URL when prompted
   - Select environments (production, preview, development)

4. **Deploy**:
   ```bash
   vercel --prod
   ```

---

## Environment Variables

### Required Environment Variables

#### `NEXT_PUBLIC_API_URL`

**Description**: Backend API base URL

**Format**: `https://your-backend-domain.com/api/v1`

**Examples**:
- DigitalOcean default: `https://numerai-xxxxx.ondigitalocean.app/api/v1`
- Custom domain: `https://api.yourdomain.com/api/v1`

**Setting in Vercel Dashboard**:
1. Go to your project → **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Key: `NEXT_PUBLIC_API_URL`
4. Value: Your backend API URL
5. Select environments: Production, Preview, Development
6. Click **"Save"**

**Setting via CLI**:
```bash
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_API_URL preview
vercel env add NEXT_PUBLIC_API_URL development
```

### Optional Environment Variables

If you need additional environment variables for your frontend, add them the same way.

**Note**: Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Other variables are only available server-side.

---

## Custom Domain Configuration

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Add Domain"**
4. Enter your domain name (e.g., `yourdomain.com`)
5. Click **"Add"**

### Step 2: Configure DNS

Vercel will provide DNS records to add:

1. **For Root Domain** (`yourdomain.com`):
   - Type: `A`
   - Value: Provided by Vercel (e.g., `76.76.21.21`)

2. **For WWW** (`www.yourdomain.com`):
   - Type: `CNAME`
   - Value: `cname.vercel-dns.com`

3. **Alternative (Using CNAME for root)**:
   - Some DNS providers support CNAME for root domain
   - Use the CNAME value provided by Vercel

### Step 3: Update Backend CORS

After adding your custom domain, update your DigitalOcean backend:

1. Go to DigitalOcean App Platform dashboard
2. Navigate to your backend service
3. Go to **"Settings"** → **"Environment Variables"**
4. Update `CORS_ALLOWED_ORIGINS`:
   - Add your Vercel domain: `https://yourdomain.com,https://www.yourdomain.com`
   - Include Vercel preview URLs if needed: `https://*.vercel.app`
5. Update `CSRF_TRUSTED_ORIGINS`:
   - Add the same domains: `https://yourdomain.com,https://www.yourdomain.com`
6. Save and redeploy backend

### Step 4: Verify SSL

Vercel automatically provisions SSL certificates. Wait a few minutes for DNS propagation and SSL activation.

---

## Post-Deployment Steps

### Step 1: Verify Deployment

1. **Check Build Logs**:
   - Go to your project → **Deployments**
   - Click on the latest deployment
   - Review build logs for any errors

2. **Test Frontend**:
   - Visit your Vercel URL
   - Verify the app loads correctly
   - Check browser console for errors

3. **Test API Connectivity**:
   - Try logging in or making an API call
   - Check Network tab in browser DevTools
   - Verify API requests are going to correct backend URL

### Step 2: Update Backend CORS (If Not Done)

Ensure your backend allows requests from Vercel:

1. **Get Your Vercel Domain**:
   - Production: `https://your-project.vercel.app` or custom domain
   - Preview: `https://your-project-git-branch-username.vercel.app`

2. **Update DigitalOcean Backend**:
   - Add Vercel domain(s) to `CORS_ALLOWED_ORIGINS`
   - Add Vercel domain(s) to `CSRF_TRUSTED_ORIGINS`
   - Redeploy backend service

### Step 3: Test Authentication Flow

1. **Test Login**:
   - Navigate to login page
   - Attempt to log in
   - Verify tokens are stored correctly

2. **Test Protected Routes**:
   - Access protected pages
   - Verify API calls include authentication headers

3. **Test Logout**:
   - Log out
   - Verify tokens are cleared

---

## Troubleshooting

### Build Fails

**Issue**: Build fails with errors

**Solutions**:
1. **Check Build Logs**:
   - Go to deployment → **Build Logs**
   - Look for specific error messages

2. **Common Issues**:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

3. **Fix**:
   - Resolve errors locally first
   - Push fixes to GitHub
   - Vercel will automatically redeploy

### API Calls Fail (CORS Errors)

**Issue**: Browser console shows CORS errors

**Solutions**:
1. **Verify CORS Configuration**:
   - Check backend `CORS_ALLOWED_ORIGINS` includes your Vercel domain
   - Ensure exact match (including `https://`)

2. **Check API URL**:
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Check it matches your backend URL

3. **Test Backend CORS**:
   ```bash
   curl -H "Origin: https://your-vercel-domain.vercel.app" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        https://your-backend-domain.com/api/v1/health/
   ```

### Environment Variables Not Working

**Issue**: Environment variables not accessible in frontend

**Solutions**:
1. **Check Variable Name**:
   - Must start with `NEXT_PUBLIC_` for browser access
   - Case-sensitive

2. **Redeploy**:
   - Environment variable changes require redeployment
   - Go to **Deployments** → **Redeploy**

3. **Verify in Build**:
   - Check build logs for environment variable values
   - Use `console.log(process.env.NEXT_PUBLIC_API_URL)` to debug

### Preview Deployments Not Working

**Issue**: Preview deployments fail or can't connect to backend

**Solutions**:
1. **Update Backend CORS**:
   - Add `https://*.vercel.app` to `CORS_ALLOWED_ORIGINS`
   - Or add specific preview URLs as needed

2. **Check Environment Variables**:
   - Ensure preview environment has `NEXT_PUBLIC_API_URL` set
   - Can be different from production URL

### Custom Domain Not Working

**Issue**: Custom domain shows error or doesn't load

**Solutions**:
1. **Check DNS Configuration**:
   - Verify DNS records are correct
   - Wait for DNS propagation (can take up to 48 hours)

2. **Check SSL Certificate**:
   - Vercel automatically provisions SSL
   - Wait a few minutes after DNS is configured

3. **Verify Domain in Vercel**:
   - Go to **Settings** → **Domains**
   - Check domain status
   - Follow any configuration instructions

---

## CI/CD Integration

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from other branches and pull requests

### Manual Deployments

1. **Via Dashboard**:
   - Go to **Deployments**
   - Click **"Redeploy"** on any deployment

2. **Via CLI**:
   ```bash
   vercel --prod
   ```

### Deployment Hooks

You can configure deployment hooks for notifications:

1. Go to **Settings** → **Git**
2. Configure webhooks or integrations
3. Set up notifications (Slack, email, etc.)

---

## Best Practices

### Environment Variables

1. **Use Different URLs for Environments**:
   - Production: Production backend URL
   - Preview: Staging backend URL (if available)
   - Development: Local backend URL

2. **Never Commit Secrets**:
   - Use Vercel environment variables
   - Don't commit `.env` files

### Performance

1. **Enable Vercel Analytics**:
   - Go to **Settings** → **Analytics**
   - Enable Web Analytics for insights

2. **Optimize Images**:
   - Use Next.js Image component
   - Configure `next.config.mjs` for image optimization

3. **Enable Edge Functions** (if needed):
   - Use Vercel Edge Functions for serverless functions
   - Faster response times globally

### Monitoring

1. **Check Deployment Logs**:
   - Regularly review build and runtime logs
   - Set up alerts for failed deployments

2. **Monitor Performance**:
   - Use Vercel Analytics
   - Check Core Web Vitals

---

## Quick Reference Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL

# Remove environment variable
vercel env rm NEXT_PUBLIC_API_URL

# Pull environment variables
vercel env pull .env.local
```

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **Vercel Status**: https://vercel-status.com

---

## Architecture Overview

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Vercel Frontend│
│   (Next.js)     │
└────────┬────────┘
         │ API Calls
         ▼
┌─────────────────┐
│ DigitalOcean    │
│ Backend (Django)│
└─────────────────┘
```

**Key Points**:
- Frontend hosted on Vercel (optimized for Next.js)
- Backend hosted on DigitalOcean App Platform
- CORS configured to allow cross-origin requests
- Environment variables configured in both platforms

---

**Last Updated**: 2025-01-XX  
**Version**: 1.0

