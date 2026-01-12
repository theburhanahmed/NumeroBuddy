# Deployment Setup Guide

This guide will help you deploy NumerAI to Render (backend) and Netlify (frontend).

## Prerequisites

- GitHub account with repository access
- Render.com account (free tier available)
- Netlify account (free tier available)
- All environment variables ready (see below)

---

## Part 1: Deploy Backend to Render

### Step 1: Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository: `theburhanahmed/NumerAI`
4. Render will detect the `render.yaml` file automatically
5. Click "Apply" to create all services

### Step 2: Configure Environment Variables

After services are created, go to each service and add these environment variables:

#### Backend Web Service (`numerai-backend`)

**Required Variables:**
```
ALLOWED_HOSTS=numerai-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
CSRF_TRUSTED_ORIGINS=https://your-netlify-app.netlify.app
```

**Optional Variables (if you have them):**
```
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
FIREBASE_PROJECT_ID=...
FIREBASE_CREDENTIALS=...
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=...
```

### Step 3: Wait for Deployment

- Render will automatically build and deploy your backend
- The database and Redis will be created automatically
- Note your backend URL (e.g., `https://numerai-backend.onrender.com`)

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Connect Repository to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `theburhanahmed/NumerAI`
4. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `.next` (Netlify Next.js plugin will handle this)

### Step 2: Install Netlify Next.js Plugin

1. In your Netlify site settings, go to "Plugins"
2. Search for "@netlify/plugin-nextjs"
3. Click "Install" (or it may be auto-detected from `netlify.toml`)

### Step 3: Configure Environment Variables

Go to Site settings → Environment variables and add:

```
NEXT_PUBLIC_API_URL=https://numerai-backend.onrender.com/api/v1
```

**Optional Variables (if you have them):**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-...
```

### Step 4: Deploy

1. Click "Deploy site"
2. Netlify will build and deploy your frontend
3. Note your frontend URL (e.g., `https://your-app.netlify.app`)

---

## Part 3: Update CORS Settings

After both deployments are complete:

1. Go back to Render → Backend service → Environment
2. Update `CORS_ALLOWED_ORIGINS` with your actual Netlify URL:
   ```
   CORS_ALLOWED_ORIGINS=https://your-app.netlify.app
   ```
3. Update `CSRF_TRUSTED_ORIGINS`:
   ```
   CSRF_TRUSTED_ORIGINS=https://your-app.netlify.app
   ```
4. Update `ALLOWED_HOSTS` if needed:
   ```
   ALLOWED_HOSTS=numerai-backend.onrender.com
   ```
5. Save changes (backend will auto-redeploy)

---

## Part 4: Verify Deployment

### Backend Health Check
Visit: `https://numerai-backend.onrender.com/api/v1/health/`

Should return: `{"status": "healthy"}`

### Frontend
Visit your Netlify URL and verify:
- ✅ Homepage loads
- ✅ API calls work (check browser console)
- ✅ Authentication works
- ✅ No CORS errors

---

## Troubleshooting

### Backend Issues

**Build fails:**
- Check Render build logs
- Ensure `build.sh` is executable: `chmod +x backend/build.sh`
- Verify all dependencies in `requirements.txt`

**Database connection errors:**
- Verify `DATABASE_URL` is set correctly
- Check database service is running in Render

**CORS errors:**
- Ensure `CORS_ALLOWED_ORIGINS` includes your Netlify URL
- Check `CSRF_TRUSTED_ORIGINS` matches

### Frontend Issues

**Build fails:**
- Check Netlify build logs
- Ensure Node version matches (22.x)
- Verify `NEXT_PUBLIC_API_URL` is set correctly

**API connection errors:**
- Verify `NEXT_PUBLIC_API_URL` points to your Render backend
- Check browser console for CORS errors
- Ensure backend is running and accessible

---

## Cost Estimate

### Render (Starter Plans)
- Web Service: $7/month
- PostgreSQL: $7/month
- Redis: $10/month
- Celery Worker: $7/month (optional)
- Celery Beat: $7/month (optional)
- **Total: ~$31/month** (or $17/month without workers)

### Netlify
- **Free tier** includes:
  - 100GB bandwidth/month
  - 300 build minutes/month
  - Unlimited sites
  - **Total: $0/month** (for most use cases)

---

## Next Steps

1. Set up custom domains (optional)
2. Configure SSL certificates (automatic on both platforms)
3. Set up monitoring and alerts
4. Configure CI/CD for automatic deployments
5. Set up staging environment (optional)

---

## Support

- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- Project Issues: GitHub Issues
