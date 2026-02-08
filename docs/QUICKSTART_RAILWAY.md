# Railway Quick Start Guide

Deploy your NumerAI backend to Railway in 5 minutes.

## Prerequisites
- GitHub account (recommended) or Railway account
- Railway CLI installed: `npm i -g @railway/cli` (optional)

## Step 1: Login
```bash
railway login
```

## Step 2: Initialize Project
```bash
cd backend
railway init
```
This creates a `railway.json` file (already included in this repo).

## Step 3: Add Services

### Add PostgreSQL Database
```bash
railway add postgresql
```
Railway automatically sets `DATABASE_URL` environment variable.

### Add Redis
```bash
railway add redis
```
Railway automatically sets `REDIS_URL`. You'll need to manually set:
- `CELERY_BROKER_URL` (same as REDIS_URL but with database 1)
- `CELERY_RESULT_BACKEND` (same as REDIS_URL but with database 2)

## Step 4: Set Environment Variables

In Railway dashboard → Variables, add:

```bash
# Required Django settings
DJANGO_SETTINGS_MODULE=numerai.settings.production
SECRET_KEY=<generate-with: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'>
DEBUG=False
ALLOWED_HOSTS=*.up.railway.app,your-domain.com

# Redis for Celery (adjust database number)
CELERY_BROKER_URL=<same-as-REDIS_URL-but-db1>
CELERY_RESULT_BACKEND=<same-as-REDIS_URL-but-db2>

# CORS - Set your frontend URL
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app

# Add other required variables (see DEPLOYMENT.md)
```

## Step 5: Deploy

### Option A: CLI
```bash
railway up
```

### Option B: GitHub Integration (Recommended)
1. In Railway dashboard: Settings → Source
2. Connect your GitHub repository
3. Select branch: `main`
4. Root Directory: `backend`
5. Railway auto-deploys on every push

## Step 6: Run Migrations

```bash
railway run python manage.py migrate
```

Or in Railway dashboard → Deployments → Latest → View Logs → Run Command

## Step 7: Add Celery Workers (Optional)

### Add Worker Service
1. New Service → Use existing codebase
2. Start Command: `celery -A numerai worker --loglevel=info --concurrency=2`
3. Share environment variables from web service

### Add Beat Service
1. New Service → Use existing codebase
2. Start Command: `celery -A numerai beat --loglevel=info`
3. Share environment variables

## Step 8: Set Custom Domain (Optional)

1. Settings → Domains
2. Add your domain
3. Update `ALLOWED_HOSTS` environment variable
4. Add DNS records as instructed

## Verify Deployment

Check health endpoint:
```bash
curl https://your-app.up.railway.app/api/v1/health/
```

Expected: `{"status":"healthy"}`

## Troubleshooting

- **Build fails**: Check logs in Railway dashboard
- **Database errors**: Verify `DATABASE_URL` is set
- **502 errors**: Check if migrations ran successfully
- **Static files 404**: Run `railway run python manage.py collectstatic`

## Next Steps

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed configuration.
